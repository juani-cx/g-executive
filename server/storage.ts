import { campaigns, catalogs, catalogProducts, presences, collaborationSessions, type Campaign, type InsertCampaign, type Catalog, type InsertCatalog, type CatalogProduct, type InsertCatalogProduct, type GeneratedAsset, type Presence, type InsertPresence, type CollaborationSession, type InsertCollaborationSession } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Campaign methods
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  getAllCampaigns(): Promise<Campaign[]>;

  // Catalog methods
  getCatalog(id: number): Promise<Catalog | undefined>;
  createCatalog(catalog: InsertCatalog): Promise<Catalog>;
  updateCatalog(id: number, updates: Partial<Catalog>): Promise<Catalog | undefined>;
  getAllCatalogs(): Promise<Catalog[]>;

  // Catalog Product methods
  getCatalogProduct(id: number): Promise<CatalogProduct | undefined>;
  createCatalogProduct(product: InsertCatalogProduct): Promise<CatalogProduct>;
  updateCatalogProduct(id: number, updates: Partial<CatalogProduct>): Promise<CatalogProduct | undefined>;
  getCatalogProducts(catalogId: number): Promise<CatalogProduct[]>;
  deleteCatalogProduct(id: number): Promise<boolean>;

  // Collaboration methods
  createPresence(presence: InsertPresence): Promise<Presence>;
  updatePresence(ephemeralId: string, updates: Partial<Presence>): Promise<Presence | undefined>;
  removePresence(ephemeralId: string): Promise<boolean>;
  getCanvasPresences(canvasId: number): Promise<Presence[]>;
  createCollaborationSession(session: InsertCollaborationSession): Promise<CollaborationSession>;
  updateCampaignShareSettings(canvasId: number, settings: Partial<any>): Promise<Campaign | undefined>;
  lockCard(canvasId: number, cardId: string, ephemeralId: string): Promise<boolean>;
  unlockCard(canvasId: number, cardId: string, ephemeralId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values(insertCampaign)
      .returning();
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const [campaign] = await db
      .update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    return campaign || undefined;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getCatalog(id: number): Promise<Catalog | undefined> {
    const [catalog] = await db.select().from(catalogs).where(eq(catalogs.id, id));
    return catalog || undefined;
  }

  async createCatalog(insertCatalog: InsertCatalog): Promise<Catalog> {
    const [catalog] = await db
      .insert(catalogs)
      .values(insertCatalog)
      .returning();
    return catalog;
  }

  async updateCatalog(id: number, updates: Partial<Catalog>): Promise<Catalog | undefined> {
    const [catalog] = await db
      .update(catalogs)
      .set(updates)
      .where(eq(catalogs.id, id))
      .returning();
    return catalog || undefined;
  }

  async getAllCatalogs(): Promise<Catalog[]> {
    return await db.select().from(catalogs);
  }

  async getCatalogProduct(id: number): Promise<CatalogProduct | undefined> {
    const [product] = await db.select().from(catalogProducts).where(eq(catalogProducts.id, id));
    return product || undefined;
  }

  async createCatalogProduct(insertProduct: InsertCatalogProduct): Promise<CatalogProduct> {
    const [product] = await db
      .insert(catalogProducts)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateCatalogProduct(id: number, updates: Partial<CatalogProduct>): Promise<CatalogProduct | undefined> {
    const [product] = await db
      .update(catalogProducts)
      .set(updates)
      .where(eq(catalogProducts.id, id))
      .returning();
    return product || undefined;
  }

  async getCatalogProducts(catalogId: number): Promise<CatalogProduct[]> {
    return await db.select().from(catalogProducts).where(eq(catalogProducts.catalogId, catalogId));
  }

  async deleteCatalogProduct(id: number): Promise<boolean> {
    const result = await db.delete(catalogProducts).where(eq(catalogProducts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Collaboration methods
  async createPresence(insertPresence: InsertPresence): Promise<Presence> {
    // First try to find existing presence by ephemeralId
    const [existingPresence] = await db
      .select()
      .from(presences)
      .where(eq(presences.ephemeralId, insertPresence.ephemeralId));
    
    if (existingPresence) {
      // Update existing presence
      const [updatedPresence] = await db
        .update(presences)
        .set({
          ...insertPresence,
          lastPingAt: new Date(),
        })
        .where(eq(presences.ephemeralId, insertPresence.ephemeralId))
        .returning();
      return updatedPresence;
    }
    
    // Create new presence
    const [presence] = await db
      .insert(presences)
      .values(insertPresence)
      .returning();
    return presence;
  }

  async updatePresence(ephemeralId: string, updates: Partial<Presence>): Promise<Presence | undefined> {
    const [presence] = await db
      .update(presences)
      .set(updates)
      .where(eq(presences.ephemeralId, ephemeralId))
      .returning();
    return presence || undefined;
  }

  async removePresence(ephemeralId: string): Promise<boolean> {
    const result = await db.delete(presences).where(eq(presences.ephemeralId, ephemeralId));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getCanvasPresences(canvasId: number): Promise<Presence[]> {
    return await db.select().from(presences).where(eq(presences.canvasId, canvasId));
  }

  async createCollaborationSession(insertSession: InsertCollaborationSession): Promise<CollaborationSession> {
    const [session] = await db
      .insert(collaborationSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateCampaignShareSettings(canvasId: number, settings: Partial<any>): Promise<Campaign | undefined> {
    const campaign = await this.getCampaign(canvasId);
    if (!campaign) return undefined;

    const updatedShareSettings = { ...campaign.shareSettings, ...settings };
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ shareSettings: updatedShareSettings })
      .where(eq(campaigns.id, canvasId))
      .returning();
    return updatedCampaign || undefined;
  }

  async lockCard(canvasId: number, cardId: string, ephemeralId: string): Promise<boolean> {
    try {
      const campaign = await this.getCampaign(canvasId);
      if (!campaign || !campaign.generatedAssets) return false;

      const updatedAssets = campaign.generatedAssets.map((asset: any) => {
        if (asset.id === cardId) {
          return { ...asset, lockedBy: ephemeralId, lockedAt: new Date().toISOString() };
        }
        return asset;
      });

      await this.updateCampaign(canvasId, { generatedAssets: updatedAssets });
      return true;
    } catch (error) {
      console.error("Error locking card:", error);
      return false;
    }
  }

  async unlockCard(canvasId: number, cardId: string, ephemeralId: string): Promise<boolean> {
    try {
      const campaign = await this.getCampaign(canvasId);
      if (!campaign || !campaign.generatedAssets) return false;

      const updatedAssets = campaign.generatedAssets.map((asset: any) => {
        if (asset.id === cardId && asset.lockedBy === ephemeralId) {
          const { lockedBy, lockedAt, ...assetWithoutLock } = asset;
          return assetWithoutLock;
        }
        return asset;
      });

      await this.updateCampaign(canvasId, { generatedAssets: updatedAssets });
      return true;
    } catch (error) {
      console.error("Error unlocking card:", error);
      return false;
    }
  }
}

export class MemStorage implements IStorage {
  private campaigns: Map<number, Campaign>;
  private catalogs: Map<number, Catalog>;
  private catalogProducts: Map<number, CatalogProduct>;
  private currentCampaignId: number;
  private currentCatalogId: number;
  private currentProductId: number;

  constructor() {
    this.campaigns = new Map();
    this.catalogs = new Map();
    this.catalogProducts = new Map();
    this.currentCampaignId = 1;
    this.currentCatalogId = 1;
    this.currentProductId = 1;
  }

  // Campaign methods
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      shareableLink: null,
      createdAt: new Date(),
      status: insertCampaign.status || "draft",
      generatedAssets: (insertCampaign.generatedAssets as GeneratedAsset[]) || [],
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const existing = this.campaigns.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.campaigns.set(id, updated);
    return updated;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  // Catalog methods
  async getCatalog(id: number): Promise<Catalog | undefined> {
    return this.catalogs.get(id);
  }

  async createCatalog(insertCatalog: InsertCatalog): Promise<Catalog> {
    const id = this.currentCatalogId++;
    const catalog: Catalog = {
      ...insertCatalog,
      id,
      shareableLink: null,
      createdAt: new Date(),
      status: insertCatalog.status || "draft",
      description: insertCatalog.description || null,
    };
    this.catalogs.set(id, catalog);
    return catalog;
  }

  async updateCatalog(id: number, updates: Partial<Catalog>): Promise<Catalog | undefined> {
    const existing = this.catalogs.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.catalogs.set(id, updated);
    return updated;
  }

  async getAllCatalogs(): Promise<Catalog[]> {
    return Array.from(this.catalogs.values());
  }

  // Catalog Product methods
  async getCatalogProduct(id: number): Promise<CatalogProduct | undefined> {
    return this.catalogProducts.get(id);
  }

  async createCatalogProduct(insertProduct: InsertCatalogProduct): Promise<CatalogProduct> {
    const id = this.currentProductId++;
    const product: CatalogProduct = {
      ...insertProduct,
      id,
      createdAt: new Date(),
      catalogId: insertProduct.catalogId || null,
      seoTitle: insertProduct.seoTitle || null,
      seoKeywords: insertProduct.seoKeywords || null,
    };
    this.catalogProducts.set(id, product);
    return product;
  }

  async updateCatalogProduct(id: number, updates: Partial<CatalogProduct>): Promise<CatalogProduct | undefined> {
    const existing = this.catalogProducts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.catalogProducts.set(id, updated);
    return updated;
  }

  async getCatalogProducts(catalogId: number): Promise<CatalogProduct[]> {
    return Array.from(this.catalogProducts.values()).filter(
      product => product.catalogId === catalogId
    );
  }

  async deleteCatalogProduct(id: number): Promise<boolean> {
    return this.catalogProducts.delete(id);
  }
}

export const storage = new DatabaseStorage();
