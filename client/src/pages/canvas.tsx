import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Download,
  Edit3,
  MoreVertical,
  ZoomIn,
  ZoomOut,
  Maximize,
  Hand,
  StickyNote,
  Grid3X3,
  Share,
  Loader2,
  FileText,
  Instagram,
  Linkedin,
  Presentation,
  Globe,
  Twitter,
  Facebook,
  Mail,
  FileImage,
  Youtube,
  Newspaper,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import MaterialHeader from "@/components/material-header";
import GlassBackground from "@/components/glass-background";
import { useLocation } from "wouter";

interface AssetCard {
  id: string;
  type: "slides" | "landing" | "linkedin" | "instagram" | "twitter" | "facebook" | "email" | "ads" | "blog" | "youtube" | "press";
  title: string;
  status: "generating" | "ready" | "error";
  content?: {
    preview?: string;
    text?: string;
    image?: string;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  version: number;
  createdAt: Date;
}

interface Project {
  id: string;
  title: string;
  prompt: string;
  createdAt: Date;
  assets: AssetCard[];
}

const CARD_TEMPLATES = [
  { type: "twitter" as const, label: "X/Twitter", icon: Twitter, color: "bg-black" },
  { type: "facebook" as const, label: "Facebook", icon: Facebook, color: "bg-blue-600" },
  { type: "email" as const, label: "Email", icon: Mail, color: "bg-green-600" },
  { type: "ads" as const, label: "Ads", icon: FileImage, color: "bg-orange-600" },
  { type: "blog" as const, label: "Blog", icon: FileText, color: "bg-purple-600" },
  { type: "youtube" as const, label: "YouTube", icon: Youtube, color: "bg-red-600" },
  { type: "press" as const, label: "Press Release", icon: Newspaper, color: "bg-gray-600" },
];

const DEFAULT_CARDS: Omit<AssetCard, "id" | "createdAt">[] = [
  {
    type: "slides",
    title: "Presentation Slides",
    status: "generating",
    position: { x: 100, y: 100 },
    size: { width: 320, height: 240 },
    version: 1,
  },
  {
    type: "landing",
    title: "Landing Page",
    status: "generating", 
    position: { x: 500, y: 100 },
    size: { width: 320, height: 240 },
    version: 1,
  },
  {
    type: "linkedin",
    title: "LinkedIn Post",
    status: "generating",
    position: { x: 100, y: 400 },
    size: { width: 320, height: 240 },
    version: 1,
  },
  {
    type: "instagram",
    title: "Instagram Post",
    status: "generating",
    position: { x: 500, y: 400 },
    size: { width: 320, height: 240 },
    version: 1,
  },
];

export default function CanvasView() {
  const [, setLocation] = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [tool, setTool] = useState<"hand" | "select">("select");
  const [showGrid, setShowGrid] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [cardDragStart, setCardDragStart] = useState({ x: 0, y: 0 });

  // Initialize project from prompt
  useEffect(() => {
    const prompt = localStorage.getItem('campaignPrompt');
    if (prompt) {
      const newProject: Project = {
        id: Date.now().toString(),
        title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
        prompt,
        createdAt: new Date(),
        assets: DEFAULT_CARDS.map((card, index) => ({
          ...card,
          id: `card-${index}`,
          createdAt: new Date(),
        })),
      };
      setProject(newProject);
      
      // Simulate card generation with staggered completion
      setTimeout(() => {
        DEFAULT_CARDS.forEach((_, index) => {
          setTimeout(() => {
            setProject(prev => prev ? {
              ...prev,
              assets: prev.assets.map(asset => 
                asset.id === `card-${index}` 
                  ? { 
                      ...asset, 
                      status: "ready" as const,
                      content: {
                        preview: `Generated ${asset.type} content`,
                        text: `AI-generated content for ${asset.title} based on: "${prompt}"`,
                      }
                    }
                  : asset
              )
            } : null);
          }, (index + 1) * 2000);
        });
      }, 500);
      
      localStorage.removeItem('campaignPrompt');
    } else {
      // Redirect back to home if no prompt
      setLocation('/');
    }
  }, [setLocation]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (tool === "hand" || e.button === 1) { // Middle mouse button
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - viewport.x, 
        y: e.clientY - viewport.y 
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !draggedCard) {
      setViewport(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
    
    if (draggedCard) {
      const deltaX = (e.clientX - cardDragStart.x) / viewport.zoom;
      const deltaY = (e.clientY - cardDragStart.y) / viewport.zoom;
      
      setProject(prev => prev ? {
        ...prev,
        assets: prev.assets.map(asset => 
          asset.id === draggedCard 
            ? { 
                ...asset, 
                position: { 
                  x: asset.position.x + deltaX, 
                  y: asset.position.y + deltaY 
                }
              }
            : asset
        )
      } : null);
      
      setCardDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggedCard(null);
  };

  const handleCardMouseDown = (e: React.MouseEvent, cardId: string) => {
    if (tool === "select") {
      e.stopPropagation();
      setDraggedCard(cardId);
      setCardDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleZoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }));
  };

  const handleZoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
  };

  const handleFitToView = () => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  const addCard = (type: AssetCard['type']) => {
    if (!project) return;
    
    const newCard: AssetCard = {
      id: `card-${Date.now()}`,
      type,
      title: CARD_TEMPLATES.find(t => t.type === type)?.label || type,
      status: "generating",
      position: { 
        x: -viewport.x / viewport.zoom + 300, 
        y: -viewport.y / viewport.zoom + 300 
      },
      size: { width: 320, height: 240 },
      version: 1,
      createdAt: new Date(),
    };

    setProject(prev => prev ? {
      ...prev,
      assets: [...prev.assets, newCard]
    } : null);

    // Simulate generation
    setTimeout(() => {
      setProject(prev => prev ? {
        ...prev,
        assets: prev.assets.map(asset => 
          asset.id === newCard.id 
            ? { 
                ...asset, 
                status: "ready" as const,
                content: {
                  preview: `Generated ${type} content`,
                  text: `AI-generated ${type} content based on: "${prev.prompt}"`,
                }
              }
            : asset
        )
      } : null);
    }, 3000);
  };

  const getCardIcon = (type: AssetCard['type']) => {
    switch (type) {
      case "slides": return Presentation;
      case "landing": return Globe;
      case "linkedin": return Linkedin;
      case "instagram": return Instagram;
      case "twitter": return Twitter;
      case "facebook": return Facebook;
      case "email": return Mail;
      case "ads": return FileImage;
      case "blog": return FileText;
      case "youtube": return Youtube;
      case "press": return Newspaper;
      default: return FileText;
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <GlassBackground />
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-glass-text-primary" />
          <p className="text-glass-text-secondary">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlassBackground />
      <MaterialHeader onToggleSidebar={() => {}} />
      
      {/* Floating Canvas Toolbar - Left Side (Miro Style) */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="glass-elevated border-glass-border rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col space-y-2">
            {/* Select Tool */}
            <Button
              variant={tool === "select" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("select")}
              className="w-12 h-12 p-0 rounded-xl"
              title="Select & Move"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
              </svg>
            </Button>

            {/* Pan Tool */}
            <Button
              variant={tool === "hand" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("hand")}
              className="w-12 h-12 p-0 rounded-xl"
              title="Pan Canvas"
            >
              <Hand className="w-5 h-5" />
            </Button>

            <div className="border-t border-glass-border my-2" />

            {/* Rectangle/Card Tool */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-xl" title="Add Shape">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="ml-2">
                {CARD_TEMPLATES.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <DropdownMenuItem
                      key={template.type}
                      onClick={() => addCard(template.type)}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {template.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sticky Note */}
            <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-xl" title="Add Note">
              <StickyNote className="w-5 h-5" />
            </Button>

            {/* Text */}
            <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-xl" title="Add Text">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4,7 4,4 20,4 20,7"/>
                <line x1="9" y1="20" x2="15" y2="20"/>
                <line x1="12" y1="4" x2="12" y2="20"/>
              </svg>
            </Button>

            {/* Connect/Arrow */}
            <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-xl" title="Connect">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Button>

            {/* Frame */}
            <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-xl" title="Frame">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
              </svg>
            </Button>

            <div className="border-t border-glass-border my-2" />

            {/* Zoom Controls */}
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="w-12 h-12 p-0 rounded-xl" title="Zoom In">
              <ZoomIn className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="w-12 h-12 p-0 rounded-xl" title="Zoom Out">
              <ZoomOut className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleFitToView} className="w-12 h-12 p-0 rounded-xl" title="Fit to Screen">
              <Maximize className="w-5 h-5" />
            </Button>

            {/* Grid Toggle */}
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="w-12 h-12 p-0 rounded-xl"
              title="Toggle Grid"
            >
              <Grid3X3 className="w-5 h-5" />
            </Button>

            <div className="border-t border-glass-border my-2" />

            {/* Comments */}
            <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-xl" title="Comments">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
              </svg>
            </Button>

            {/* Add Section */}
            <Button variant="default" size="sm" className="w-12 h-12 p-0 rounded-xl bg-primary" title="Add Anything">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Share Button - Top Right */}
      <div className="fixed top-6 right-6 z-40">
        <Button variant="outline" size="sm" className="glass-surface px-4 py-2">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 top-24 cursor-move overflow-hidden"
        style={{ cursor: tool === "hand" ? "grab" : "default" }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Grid */}
        {showGrid && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
              transform: `translate(${viewport.x}px, ${viewport.y}px)`,
            }}
          />
        )}

        {/* Asset Cards */}
        <div
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {project.assets.map((asset) => {
            const IconComponent = getCardIcon(asset.type);
            return (
              <Card
                key={asset.id}
                className={`absolute glass-elevated border-glass-border transition-all duration-200 hover:shadow-lg ${
                  selectedCard === asset.id ? "ring-2 ring-blue-500" : ""
                } ${
                  tool === "select" ? "cursor-move" : "cursor-pointer"
                } ${
                  draggedCard === asset.id ? "shadow-2xl scale-105 z-50" : ""
                }`}
                style={{
                  left: asset.position.x,
                  top: asset.position.y,
                  width: asset.size.width,
                  height: asset.size.height,
                }}
                onMouseDown={(e) => handleCardMouseDown(e, asset.id)}
                onClick={() => {
                  if (tool === "select" && !draggedCard) {
                    setSelectedCard(asset.id);
                    setExpandedCard(asset.id);
                  }
                }}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4 text-glass-text-primary" />
                      <span className="text-sm font-medium text-glass-text-primary">
                        {asset.title}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-6 h-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setExpandedCard(asset.id)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 flex items-center justify-center">
                    {asset.status === "generating" ? (
                      <div className="text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-glass-text-secondary" />
                        <p className="text-xs text-glass-text-muted">Generating...</p>
                      </div>
                    ) : asset.status === "ready" ? (
                      <div className="text-center">
                        <div className="w-full h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-2 flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-glass-text-primary opacity-50" />
                        </div>
                        <p className="text-xs text-glass-text-secondary line-clamp-2">
                          {asset.content?.text}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs text-red-400">Error generating</p>
                        <Button variant="ghost" size="sm" className="mt-1">
                          Retry
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between mt-2">
                    <Badge 
                      variant={asset.status === "ready" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {asset.status}
                    </Badge>
                    <span className="text-xs text-glass-text-muted">
                      v{asset.version}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Expanded Card Drawer */}
      <Sheet open={!!expandedCard} onOpenChange={() => setExpandedCard(null)}>
        <SheetContent className="w-[500px] glass-surface border-glass-border" side="right">
          <SheetHeader>
            <SheetTitle className="text-glass-text-primary">
              Edit {project.assets.find(a => a.id === expandedCard)?.title}
            </SheetTitle>
            <SheetDescription className="text-glass-text-secondary">
              Refine your asset with AI prompts or manual editing
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {/* Asset Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-glass-text-primary">
                Preview
              </label>
              <div className="p-4 glass-elevated border-glass-border rounded-lg">
                <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-3 flex items-center justify-center">
                  {expandedCard && (() => {
                    const asset = project.assets.find(a => a.id === expandedCard);
                    const IconComponent = asset ? getCardIcon(asset.type) : FileText;
                    return <IconComponent className="w-12 h-12 text-glass-text-primary opacity-50" />;
                  })()}
                </div>
                <div className="space-y-1">
                  <Badge 
                    variant={project.assets.find(a => a.id === expandedCard)?.status === "ready" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {project.assets.find(a => a.id === expandedCard)?.status}
                  </Badge>
                  <p className="text-xs text-glass-text-muted">
                    Version {project.assets.find(a => a.id === expandedCard)?.version}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Edit Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-glass-text-primary">
                AI Edit Prompt
              </label>
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe how you want to modify this asset..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="glass-surface border-glass-border text-glass-text-primary placeholder:text-glass-text-muted"
                  rows={3}
                />
                <Button className="w-full bg-[rgba(139,92,246,0.9)] hover:bg-[rgba(139,92,246,1)]">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply AI Changes
                </Button>
              </div>
            </div>

            {/* Current Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-glass-text-primary">
                Current Content
              </label>
              <div className="p-4 glass-surface border-glass-border rounded-lg max-h-32 overflow-y-auto">
                <p className="text-sm text-glass-text-secondary">
                  {project.assets.find(a => a.id === expandedCard)?.content?.text || "No content generated yet"}
                </p>
              </div>
            </div>

            {/* Manual Edit Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-glass-text-primary">
                Manual Editing
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-glass-text-muted">Title</label>
                  <Input 
                    className="glass-surface border-glass-border text-glass-text-primary"
                    defaultValue={project.assets.find(a => a.id === expandedCard)?.title}
                  />
                </div>
                <div>
                  <label className="text-xs text-glass-text-muted">Content</label>
                  <Textarea 
                    className="glass-surface border-glass-border text-glass-text-primary"
                    defaultValue={project.assets.find(a => a.id === expandedCard)?.content?.text}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2 pt-4 border-t border-glass-border">
              <Button variant="outline" className="glass-surface w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Asset
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" className="glass-surface flex-1" onClick={() => setExpandedCard(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-[rgba(99,102,241,0.9)] hover:bg-[rgba(99,102,241,1)]">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Project Info Panel */}
      <div className="fixed bottom-6 left-24 z-40">
        <Card className="glass-elevated border-glass-border">
          <CardContent className="p-4">
            <h3 className="font-medium text-glass-text-primary mb-1">
              {project.title}
            </h3>
            <p className="text-xs text-glass-text-muted mb-2">
              {project.assets.length} assets • Created {project.createdAt.toLocaleDateString()}
            </p>
            <div className="flex space-x-1">
              {project.assets.map(asset => (
                <div
                  key={asset.id}
                  className={`w-2 h-2 rounded-full ${
                    asset.status === "ready" ? "bg-green-500" :
                    asset.status === "generating" ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zoom Display */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="glass-elevated border-glass-border rounded-lg px-3 py-2">
          <span className="text-sm text-glass-text-secondary">
            {Math.round(viewport.zoom * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}