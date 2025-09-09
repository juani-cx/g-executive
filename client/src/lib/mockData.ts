import { CanvasCard } from "@/types/canvas";

export const mockCanvasCards: CanvasCard[] = [
  {
    id: "card-slides-1",
    type: "slides",
    title: "Presentation Slides",
    summary: "**Campaign Overview:** Unlock Summer Savings | **Slide 2:** Pain Points → Value Proposition | **Slide 3:** Social Proof & Testimonials",
    status: "ready",
    version: 2,
    thumbnailUrl: "/api/placeholder/320/180",
    counts: { images: 6, sections: 12, words: 820, variants: 2, aiEdits: 3, comments: 4 },
    collaborators: [
      { id: "u1", name: "Ana Martinez", avatarUrl: "/api/placeholder/32/32", active: true },
      { id: "u2", name: "Luis Chen", avatarUrl: "/api/placeholder/32/32", active: false },
      { id: "u3", name: "Sarah Kim", avatarUrl: "/api/placeholder/32/32", active: true }
    ],
    lastEditedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    lastEditedBy: "Ana Martinez"
  },
  {
    id: "card-landing-1",
    type: "landing",
    title: "Landing Page",
    summary: "**Hero Section:** Compelling headline with value prop | **Features:** 3-column benefits layout | **CTA:** Get Started Free button with social proof",
    status: "ready",
    version: 1,
    thumbnailUrl: "/api/placeholder/320/180",
    counts: { images: 4, sections: 8, words: 1240, variants: 1, aiEdits: 5, comments: 2 },
    collaborators: [
      { id: "u2", name: "Luis Chen", avatarUrl: "/api/placeholder/32/32", active: true }
    ],
    lastEditedAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    lastEditedBy: "Luis Chen"
  },
  {
    id: "card-linkedin-1",
    type: "linkedin",
    title: "LinkedIn Post",
    summary: "**Hook:** 3 lessons from our product launch | **Body:** Bullet points with insights | **CTA:** What's your experience with launches?",
    status: "generating",
    version: 1,
    counts: { images: 1, sections: 4, words: 280, variants: 3, aiEdits: 1, comments: 0 },
    hashtags: ["#ProductLaunch", "#StartupLife", "#Marketing"],
    aspect: "1:1",
    collaborators: [
      { id: "u1", name: "Ana Martinez", avatarUrl: "/api/placeholder/32/32", active: false },
      { id: "u3", name: "Sarah Kim", avatarUrl: "/api/placeholder/32/32", active: true }
    ],
    lastEditedAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    lastEditedBy: "Sarah Kim"
  },
  {
    id: "card-instagram-1",
    type: "instagram",
    title: "Instagram Story",
    summary: "**Visual:** Product showcase with lifestyle background | **Text Overlay:** Limited time offer with countdown timer",
    status: "draft",
    version: 1,
    thumbnailUrl: "/api/placeholder/320/180",
    counts: { images: 2, sections: 2, words: 45, variants: 4, aiEdits: 2, comments: 1 },
    hashtags: ["#Sale", "#LimitedTime"],
    aspect: "9:16",
    collaborators: [
      { id: "u2", name: "Luis Chen", avatarUrl: "/api/placeholder/32/32", active: false }
    ],
    lastEditedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    lastEditedBy: "Luis Chen"
  }
];