import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sourceImageUrl: text("source_image_url").notNull(),
  brandTone: text("brand_tone").notNull(),
  targetPlatforms: jsonb("target_platforms").$type<string[]>().notNull(),
  campaignFocus: text("campaign_focus").notNull(),
  generatedAssets: jsonb("generated_assets").$type<GeneratedAsset[]>().default([]),
  shareableLink: text("shareable_link"),
  status: text("status").notNull().default("draft"), // draft, generating, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const catalogProducts = pgTable("catalog_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  seoTitle: text("seo_title"),
  seoKeywords: text("seo_keywords"),
  catalogId: integer("catalog_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const catalogs = pgTable("catalogs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  shareableLink: text("shareable_link"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GeneratedAsset = {
  type: 'image' | 'video' | 'copy' | 'pdf';
  platform: string;
  title: string;
  url?: string;
  content?: string;
  dimensions?: string;
};

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  shareableLink: true,
  generatedAssets: true,
}).extend({
  generatedAssets: z.array(z.any()).optional(),
});

export const insertCatalogProductSchema = createInsertSchema(catalogProducts).omit({
  id: true,
  createdAt: true,
});

export const insertCatalogSchema = createInsertSchema(catalogs).omit({
  id: true,
  createdAt: true,
  shareableLink: true,
});

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type CatalogProduct = typeof catalogProducts.$inferSelect;
export type InsertCatalogProduct = z.infer<typeof insertCatalogProductSchema>;
export type Catalog = typeof catalogs.$inferSelect;
export type InsertCatalog = z.infer<typeof insertCatalogSchema>;
