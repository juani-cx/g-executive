import { campaigns, catalogs, catalogProducts, type Campaign, type InsertCampaign, type Catalog, type InsertCatalog, type CatalogProduct, type InsertCatalogProduct } from "@shared/schema";

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
      generatedAssets: insertCampaign.generatedAssets || [],
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

export const storage = new MemStorage();
