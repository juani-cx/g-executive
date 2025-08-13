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
  Newspaper
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    if (isDragging) {
      setViewport(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
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
      
      {/* Canvas Toolbar */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40">
        <div className="glass-elevated border-glass-border rounded-2xl p-3 flex items-center space-x-2">
          {/* Tool Selection */}
          <div className="flex items-center space-x-1 mr-3 border-r border-glass-border pr-3">
            <Button
              variant={tool === "select" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("select")}
              className="w-8 h-8 p-0"
            >
              <Hand className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === "hand" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("hand")}
              className="w-8 h-8 p-0"
            >
              <Hand className="w-4 h-4" />
            </Button>
          </div>

          {/* Add Card */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="glass-surface">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 border-l border-glass-border pl-3">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="w-8 h-8 p-0">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-glass-text-secondary min-w-[3rem] text-center">
              {Math.round(viewport.zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="w-8 h-8 p-0">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFitToView} className="w-8 h-8 p-0">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>

          {/* View Options */}
          <div className="flex items-center space-x-1 border-l border-glass-border pl-3">
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="w-8 h-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <StickyNote className="w-4 h-4" />
            </Button>
          </div>

          {/* Share */}
          <Button variant="outline" size="sm" className="glass-surface border-l border-glass-border ml-3 pl-3">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
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
                className={`absolute glass-elevated border-glass-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCard === asset.id ? "ring-2 ring-blue-500" : ""
                }`}
                style={{
                  left: asset.position.x,
                  top: asset.position.y,
                  width: asset.size.width,
                  height: asset.size.height,
                }}
                onClick={() => setSelectedCard(asset.id)}
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
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
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

      {/* Expanded Card Dialog */}
      <Dialog open={!!expandedCard} onOpenChange={() => setExpandedCard(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto glass-surface">
          <DialogHeader>
            <DialogTitle>
              Edit {project.assets.find(a => a.id === expandedCard)?.title}
            </DialogTitle>
            <DialogDescription>
              Refine your asset with AI prompts or manual editing
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* AI Edit Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-glass-text-primary">
                AI Edit Prompt
              </label>
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Describe how you want to modify this asset..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 glass-surface border-glass-border"
                />
                <Button className="px-6">Apply</Button>
              </div>
            </div>

            {/* Current Content Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-glass-text-primary">
                Current Content
              </label>
              <div className="p-4 glass-surface border-glass-border rounded-lg">
                <p className="text-sm text-glass-text-secondary">
                  {project.assets.find(a => a.id === expandedCard)?.content?.text || "No content generated yet"}
                </p>
              </div>
            </div>

            {/* Export Options */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-glass-border">
              <Button variant="outline" className="glass-surface">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setExpandedCard(null)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Info Panel */}
      <div className="fixed bottom-6 left-6 z-40">
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
    </div>
  );
}