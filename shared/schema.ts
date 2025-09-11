import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sourceImageUrl: text("source_image_url"),
  brandTone: text("brand_tone").notNull(),
  targetPlatforms: jsonb("target_platforms").$type<string[]>().notNull(),
  campaignFocus: text("campaign_focus").notNull(),
  generatedAssets: jsonb("generated_assets").$type<GeneratedAsset[]>().default([]),
  shareableLink: text("shareable_link"),
  shareSettings: jsonb("share_settings").$type<{
    enabled: boolean;
    role: "edit" | "view";
    linkToken: string;
    accessCode?: string;
    maxCollaborators: number;
  }>().default({
    enabled: false,
    role: "view",
    linkToken: "",
    maxCollaborators: 10
  }),
  status: text("status").notNull().default("in_progress"), // in_progress, in_approval, approved, finished
  commentsCount: integer("comments_count").notNull().default(0),
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

// Collaboration tables
export const presences = pgTable("presences", {
  id: serial("id").primaryKey(),
  canvasId: integer("canvas_id").references(() => campaigns.id).notNull(),
  userId: text("user_id"), // null for anonymous users
  ephemeralId: text("ephemeral_id").notNull(),
  displayName: text("display_name").notNull(),
  color: text("color").notNull(),
  cursor: jsonb("cursor").$type<{ x: number; y: number }>(),
  selection: text("selection"), // selected card/element ID
  status: text("status").notNull().default("online"), // online, offline, reconnecting
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastPingAt: timestamp("last_ping_at").defaultNow().notNull(),
});

export const collaborationSessions = pgTable("collaboration_sessions", {
  id: serial("id").primaryKey(),
  canvasId: integer("canvas_id").references(() => campaigns.id).notNull(),
  ephemeralId: text("ephemeral_id").notNull(),
  userId: text("user_id"), // null for anonymous users
  ipHash: text("ip_hash").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
});

export type GeneratedAsset = {
  id?: string;
  type: 'image' | 'video' | 'copy' | 'pdf' | 'slides' | 'landing' | 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'email' | 'ads' | 'blog' | 'youtube' | 'press' | 'config';
  platform?: string;
  title: string;
  status?: 'generating' | 'ready' | 'error';
  url?: string;
  content?: any;
  dimensions?: string;
  imagePrompt?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  version?: number;
  lockedBy?: string; // ephemeralId of user editing
  lockedAt?: string; // timestamp
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

// TypeScript types for collaboration
export type Presence = typeof presences.$inferSelect;
export type InsertPresence = typeof presences.$inferInsert;
export type CollaborationSession = typeof collaborationSessions.$inferSelect;
export type InsertCollaborationSession = typeof collaborationSessions.$inferInsert;

export interface LiveCursor {
  x: number;
  y: number;
  ephemeralId: string;
  displayName: string;
  color: string;
}

export interface CollaborationState {
  presences: Presence[];
  currentUserCount: number;
  maxCollaborators: number;
  shareSettings: {
    enabled: boolean;
    role: "edit" | "view";
    linkToken: string;
    accessCode?: string;
    maxCollaborators: number;
  };
}

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

// Canvas elements table for storing text, shapes, images, and comments
export const canvasElements = pgTable("canvas_elements", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  type: text("type").notNull(), // 'text', 'shape', 'image', 'comment'
  content: jsonb("content").$type<{
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    shapeType?: 'rectangle' | 'circle' | 'triangle';
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    imageUrl?: string;
    imagePrompt?: string;
    commentText?: string;
    author?: string;
    resolved?: boolean;
  }>().notNull(),
  position: jsonb("position").$type<{ x: number; y: number }>().notNull(),
  size: jsonb("size").$type<{ width: number; height: number }>().notNull(),
  rotation: integer("rotation").default(0),
  zIndex: integer("z_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCanvasElementSchema = createInsertSchema(canvasElements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type CatalogProduct = typeof catalogProducts.$inferSelect;
export type InsertCatalogProduct = z.infer<typeof insertCatalogProductSchema>;
export type Catalog = typeof catalogs.$inferSelect;
export type InsertCatalog = z.infer<typeof insertCatalogSchema>;
export type CanvasElement = typeof canvasElements.$inferSelect;
export type InsertCanvasElement = z.infer<typeof insertCanvasElementSchema>;
