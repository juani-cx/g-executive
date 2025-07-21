import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertCatalogSchema, insertCatalogProductSchema, type GeneratedAsset } from "@shared/schema";
import { analyzeImageForCampaign, generateCampaignAssets, generatePreviewAssets, enrichProductDescription, generateImage } from "./services/openai";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Campaign routes
  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Invalid campaign data", error: (error as Error).message });
    }
  });

  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns", error: (error as Error).message });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign", error: (error as Error).message });
    }
  });

  // Image analysis endpoint
  app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const analysis = await analyzeImageForCampaign(base64Image);
      
      res.json({
        ...analysis,
        imageBase64: base64Image
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze image", error: (error as Error).message });
    }
  });

  // Generate campaign preview (lightweight, fast preview)
  app.post("/api/generate-preview", async (req, res) => {
    try {
      const { imageBase64, brandTone, targetPlatforms, campaignFocus } = req.body;

      // Generate lightweight preview assets
      const previewAssets = await generatePreviewAssets({
        imageBase64,
        brandTone,
        targetPlatforms,
        campaignFocus
      });

      res.json({ assets: previewAssets });
    } catch (error: any) {
      console.error("Preview generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate preview",
        error: error.message 
      });
    }
  });

  // Campaign generation endpoint
  app.post("/api/generate-campaign", async (req, res) => {
    try {
      const { campaignId, imageBase64, brandTone, targetPlatforms, campaignFocus } = req.body;

      if (!campaignId || !imageBase64 || !brandTone || !targetPlatforms || !campaignFocus) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Update campaign status to generating
      await storage.updateCampaign(campaignId, { status: "generating" });

      const assets = await generateCampaignAssets({
        imageBase64,
        brandTone,
        targetPlatforms,
        campaignFocus
      });

      // Assets are already in the correct GeneratedAsset format
      const generatedAssets: GeneratedAsset[] = assets;

      // Generate shareable link
      const shareableLink = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/executive/${uuidv4()}`;

      // Update campaign with generated assets
      const updatedCampaign = await storage.updateCampaign(campaignId, {
        generatedAssets,
        shareableLink,
        status: "completed"
      });

      res.json(updatedCampaign);
    } catch (error) {
      // Update campaign status to failed
      if (req.body.campaignId) {
        await storage.updateCampaign(req.body.campaignId, { status: "failed" });
      }
      res.status(500).json({ message: "Failed to generate campaign", error: (error as Error).message });
    }
  });

  // Catalog routes
  app.post("/api/catalogs", async (req, res) => {
    try {
      const validatedData = insertCatalogSchema.parse(req.body);
      const catalog = await storage.createCatalog(validatedData);
      res.json(catalog);
    } catch (error) {
      res.status(400).json({ message: "Invalid catalog data", error: (error as Error).message });
    }
  });

  app.get("/api/catalogs", async (req, res) => {
    try {
      const catalogs = await storage.getAllCatalogs();
      res.json(catalogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch catalogs", error: (error as Error).message });
    }
  });

  app.get("/api/catalogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const catalog = await storage.getCatalog(id);
      if (!catalog) {
        return res.status(404).json({ message: "Catalog not found" });
      }
      res.json(catalog);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch catalog", error: (error as Error).message });
    }
  });

  // Catalog product routes
  app.post("/api/catalog-products", async (req, res) => {
    try {
      const validatedData = insertCatalogProductSchema.parse(req.body);
      const product = await storage.createCatalogProduct(validatedData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data", error: (error as Error).message });
    }
  });

  app.get("/api/catalogs/:catalogId/products", async (req, res) => {
    try {
      const catalogId = parseInt(req.params.catalogId);
      const products = await storage.getCatalogProducts(catalogId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error: (error as Error).message });
    }
  });

  app.put("/api/catalog-products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const product = await storage.updateCatalogProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product", error: (error as Error).message });
    }
  });

  // Product enrichment endpoint
  app.post("/api/enrich-product", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { productName, category } = req.body;
      if (!productName || !category) {
        return res.status(400).json({ message: "Product name and category are required" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const enrichment = await enrichProductDescription(base64Image, productName, category);
      
      res.json({
        ...enrichment,
        imageBase64: base64Image
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to enrich product", error: (error as Error).message });
    }
  });

  // Image generation endpoint
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const result = await generateImage(prompt);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate image", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
