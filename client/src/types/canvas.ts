export type CardType = "slides" | "landing" | "linkedin" | "instagram" | "twitter" | "facebook" | "email" | "ads" | "blog" | "youtube" | "press" | "config" | "video" | "banner";
export type CardStatus = "generating" | "ready" | "draft" | "error";

export interface Collaborator {
  id: string;
  name: string;
  avatarUrl?: string;
  active?: boolean;
}

export interface Counts {
  images: number;
  sections: number;
  words: number;
  variants: number;
  aiEdits: number;
  comments: number;
}

export interface CanvasCard {
  id: string;
  type: CardType;
  title: string;
  summary: string;
  status: CardStatus;
  version: number;
  thumbnailUrl?: string;
  counts: Counts;
  hashtags?: string[];
  aspect?: "1:1" | "4:5" | "16:9" | "9:16";
  collaborators: Collaborator[];
  lastEditedAt: string;
  lastEditedBy?: string;
}