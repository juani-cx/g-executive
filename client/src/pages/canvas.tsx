import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ShareModal from "@/components/collaboration/share-modal";
import PresenceIndicators, { LiveCursor } from "@/components/collaboration/presence-indicators";
import { useCollaboration } from "@/hooks/useCollaboration";
import RichAssetCard from "@/components/canvas/RichAssetCard";
import AssetDrawer from "@/components/canvas/AssetDrawer";
import { mockCanvasCards } from "@/lib/mockData";
import { CanvasCard } from "@/types/canvas";
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
  Sparkles,
  Type,
  MessageCircle,
  Square,
  Circle,
  Triangle,
  X,
  Check,
  Trash2,
  Home,
  Users,
  Settings,
  HelpCircle,
  Archive
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
import { MainMenu } from "@/components/main-menu";
import MaterialHeader from "@/components/material-header";
import GlassBackground from "@/components/glass-background";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface AssetCard {
  id: string;
  type: "slides" | "landing" | "linkedin" | "instagram" | "twitter" | "facebook" | "email" | "ads" | "blog" | "youtube" | "press" | "config";
  title: string;
  status: "generating" | "ready" | "error";
  content?: {
    preview?: string;
    text?: string;
    image?: string;
    [key: string]: any;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  version: number;
  createdAt?: Date;
}

interface CanvasElement {
  id: string;
  type: "text" | "shape" | "image" | "comment";
  content: {
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
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  zIndex?: number;
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
  const [match, params] = useRoute("/canvas/:id");
  const campaignId = params?.id;
  const [project, setProject] = useState<Project | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [tool, setTool] = useState<"hand" | "select" | "text" | "shape" | "image" | "comment">("select");
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [cardDragStart, setCardDragStart] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [elementDragStart, setElementDragStart] = useState({ x: 0, y: 0 });
  
  // Collaboration state
  const [showShareModal, setShowShareModal] = useState(false);
  const [cardLocks, setCardLocks] = useState<Record<string, string>>({});
  
  // Get URL parameters for collaboration
  const urlParams = new URLSearchParams(window.location.search);
  const linkToken = urlParams.get('token');
  
  // Initialize collaboration
  const collaboration = useCollaboration({
    canvasId: campaignId ? parseInt(campaignId) : 0,
    linkToken: linkToken || undefined,
    displayName: `User ${Math.floor(Math.random() * 1000)}`, // In production, get from auth
    enabled: !!campaignId
  });

  // Load campaign data if campaignId is provided
  const { data: campaignData } = useQuery({
    queryKey: ['/api/campaigns', campaignId],
    enabled: !!campaignId,
  });

  // Handle collaboration events
  useEffect(() => {
    const handleCardLocked = (event: CustomEvent) => {
      const { cardId, lockedBy } = event.detail;
      setCardLocks(prev => ({ ...prev, [cardId]: lockedBy }));
    };

    const handleCardUnlocked = (event: CustomEvent) => {
      const { cardId } = event.detail;
      setCardLocks(prev => {
        const newLocks = { ...prev };
        delete newLocks[cardId];
        return newLocks;
      });
    };

    window.addEventListener('card-locked', handleCardLocked as EventListener);
    window.addEventListener('card-unlocked', handleCardUnlocked as EventListener);

    return () => {
      window.removeEventListener('card-locked', handleCardLocked as EventListener);
      window.removeEventListener('card-unlocked', handleCardUnlocked as EventListener);
    };
  }, []);

  // Handle cursor tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current && collaboration.isConnected) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        collaboration.updateCursor(x, y);
      }
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
      return () => {
        canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [collaboration.isConnected, collaboration.updateCursor]);

  // Helper function to generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add text element to canvas
  const addTextElement = (x: number, y: number) => {
    const newElement: CanvasElement = {
      id: generateId(),
      type: "text",
      content: {
        text: "Double-click to edit",
        fontSize: 16,
        fontFamily: "Arial",
        color: "#000000",
        backgroundColor: "transparent"
      },
      position: { x, y },
      size: { width: 200, height: 40 },
      rotation: 0,
      zIndex: canvasElements.length
    };
    setCanvasElements([...canvasElements, newElement]);
    setTool("select");
  };

  // Add shape element to canvas
  const addShapeElement = (shapeType: 'rectangle' | 'circle' | 'triangle', x: number, y: number) => {
    const newElement: CanvasElement = {
      id: generateId(),
      type: "shape",
      content: {
        shapeType,
        fillColor: "#3b82f6",
        strokeColor: "#1e40af",
        strokeWidth: 2
      },
      position: { x, y },
      size: { width: 100, height: 100 },
      rotation: 0,
      zIndex: canvasElements.length
    };
    setCanvasElements([...canvasElements, newElement]);
    setShowShapeDropdown(false);
    setTool("select");
  };

  // Add comment element to canvas
  const addCommentElement = (x: number, y: number) => {
    const newElement: CanvasElement = {
      id: generateId(),
      type: "comment",
      content: {
        commentText: "",
        author: "Current User",
        resolved: false
      },
      position: { x, y },
      size: { width: 200, height: 100 },
      rotation: 0,
      zIndex: canvasElements.length
    };
    setCanvasElements([...canvasElements, newElement]);
    setActiveComment(newElement.id);
    setTool("select");
  };

  // Generate AI image
  const generateAIImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newElement: CanvasElement = {
          id: generateId(),
          type: "image",
          content: {
            imageUrl: data.url, // The API returns { url: "..." }
            imagePrompt: prompt
          },
          position: { 
            x: -viewport.x / viewport.zoom + 200, 
            y: -viewport.y / viewport.zoom + 200 
          },
          size: { width: 300, height: 300 },
          rotation: 0,
          zIndex: canvasElements.length
        };
        setCanvasElements([...canvasElements, newElement]);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
      setShowImageDialog(false);
      setImagePrompt("");
      setTool("select");
    }
  };

  // Handle canvas click for adding elements
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool === "select" || isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const y = (e.clientY - rect.top - viewport.y) / viewport.zoom;
    
    switch (tool) {
      case "text":
        addTextElement(x, y);
        break;
      case "comment":
        addCommentElement(x, y);
        break;
      case "image":
        setShowImageDialog(true);
        break;
    }
  };

  // Update element content
  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(elements => 
      elements.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  // Delete element
  const deleteElement = (id: string) => {
    setCanvasElements(elements => elements.filter(el => el.id !== id));
  };

  // Delete card
  const deleteCard = (cardId: string) => {
    setProject(prev => prev ? {
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== cardId)
    } : null);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(viewport.zoom * delta, 0.1), 5);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setViewport(prev => ({
      ...prev,
      zoom: newZoom,
      x: centerX - (centerX - prev.x) * (newZoom / prev.zoom),
      y: centerY - (centerY - prev.y) * (newZoom / prev.zoom)
    }));
  };

  // Handle keyboard events for panning
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !isPanning) {
      e.preventDefault();
      setIsPanning(true);
      document.body.style.cursor = 'grab';
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setIsPanning(false);
      document.body.style.cursor = 'default';
    }
  };

  // Setup keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.body.style.cursor = 'default';
    };
  }, [isPanning]);

  // Handle element mouse down for dragging
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (tool !== "select") return;
    
    e.stopPropagation();
    setDraggedElement(elementId);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;
    
    const mouseX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const mouseY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
    
    setElementDragStart({
      x: mouseX - element.position.x,
      y: mouseY - element.position.y
    });
  };

  // Handle element dragging
  const handleElementDrag = (e: React.MouseEvent) => {
    if (!draggedElement) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const mouseY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
    
    const newX = mouseX - elementDragStart.x;
    const newY = mouseY - elementDragStart.y;
    
    updateElement(draggedElement, {
      position: { x: newX, y: newY }
    });
  };

  // Handle element mouse up
  const handleElementMouseUp = () => {
    setDraggedElement(null);
    setElementDragStart({ x: 0, y: 0 });
  };

  // Initialize project from prompt or campaign data
  useEffect(() => {
    // If we have campaign data, use it
    if (campaignData && typeof campaignData === 'object' && 'id' in campaignData) {
      const campaign = campaignData as any; // Type assertion for campaign data
      const newProject: Project = {
        id: campaign.id.toString(),
        title: campaign.name,
        prompt: campaign.name + ' - ' + (campaign.campaignFocus || 'Campaign'),
        createdAt: new Date(campaign.createdAt),
        assets: campaign.generatedAssets?.length > 0 
          ? campaign.generatedAssets.map((asset: any) => ({
              id: asset.id || generateId(),
              type: asset.type,
              title: asset.title,
              status: asset.status || "ready",
              content: asset.content,
              position: asset.position || { x: Math.random() * 500, y: Math.random() * 300 },
              size: asset.size || { width: 300, height: 400 },
              version: 1,
              createdAt: new Date(),
            }))
          : DEFAULT_CARDS.map((card, index) => ({
              ...card,
              id: `card-${index}`,
              createdAt: new Date(),
            })),
      };
      setProject(newProject);
      return;
    }
    
    // Fallback to prompt-based initialization
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
      
      // Generate actual designs for each card using OpenAI
      setTimeout(() => {
        DEFAULT_CARDS.forEach((cardTemplate, index) => {
          setTimeout(async () => {
            try {
              const response = await fetch('/api/generate-card-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  cardType: cardTemplate.type, 
                  prompt: prompt 
                })
              });
              
              if (response.ok) {
                const { content, imageUrl } = await response.json();
                
                setProject(prev => prev ? {
                  ...prev,
                  assets: prev.assets.map(asset => 
                    asset.id === `card-${index}` 
                      ? { 
                          ...asset, 
                          status: "ready" as const,
                          content: {
                            preview: content.substring(0, 100) + '...',
                            text: content,
                            imageUrl: imageUrl
                          }
                        }
                      : asset
                  )
                } : null);
              } else {
                // Fallback if generation fails
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
              }
            } catch (error) {
              console.error(`Error generating ${cardTemplate.type} design:`, error);
              // Fallback content
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
            }
          }, (index + 1) * 3000); // Stagger by 3 seconds to avoid rate limits
        });
      }, 500);
      
      localStorage.removeItem('campaignPrompt');
    } else if (!campaignId) {
      // If no campaign data and no prompt, create default project
      const newProject: Project = {
        id: Date.now().toString(),
        title: 'New Canvas Project',
        prompt: 'Create marketing assets',
        createdAt: new Date(),
        assets: [],
      };
      setProject(newProject);
    }
  }, [campaignData, campaignId, setLocation]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (isPanning || tool === "hand" || e.button === 1) { // Middle mouse button or spacebar panning
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - viewport.x, 
        y: e.clientY - viewport.y 
      });
      document.body.style.cursor = 'grabbing';
      return;
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

    if (draggedElement) {
      handleElementDrag(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggedCard(null);
    handleElementMouseUp();
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

    // Generate actual design content
    setTimeout(async () => {
      try {
        const response = await fetch('/api/generate-card-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            cardType: type, 
            prompt: project?.prompt || "marketing campaign" 
          })
        });
        
        if (response.ok) {
          const { content, imageUrl } = await response.json();
          
          setProject(prev => prev ? {
            ...prev,
            assets: prev.assets.map(asset => 
              asset.id === newCard.id 
                ? { 
                    ...asset, 
                    status: "ready" as const,
                    content: {
                      preview: content.substring(0, 100) + '...',
                      text: content,
                      imageUrl: imageUrl
                    }
                  }
                : asset
            )
          } : null);
        } else {
          // Fallback
          setProject(prev => prev ? {
            ...prev,
            assets: prev.assets.map(asset => 
              asset.id === newCard.id 
                ? { 
                    ...asset, 
                    status: "ready" as const,
                    content: {
                      preview: `Generated ${type} content`,
                      text: `AI-generated ${type} content based on: "${prev?.prompt || "marketing campaign"}"`,
                    }
                  }
                : asset
            )
          } : null);
        }
      } catch (error) {
        console.error(`Error generating ${type} design:`, error);
        // Fallback
        setProject(prev => prev ? {
          ...prev,
          assets: prev.assets.map(asset => 
            asset.id === newCard.id 
              ? { 
                  ...asset, 
                  status: "ready" as const,
                  content: {
                    preview: `Generated ${type} content`,
                    text: `AI-generated ${type} content`,
                  }
                }
              : asset
          )
        } : null);
      }
    }, 2000);
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
      case "config": return Settings;
      default: return FileText;
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <GlassBackground />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating circles */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-green-100 rounded-full opacity-50 animate-ping"></div>
          
          {/* Floating shapes */}
          <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 transform rotate-45 opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/6 w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg opacity-40 animate-bounce"></div>
        </div>

        {/* Central Loading Content */}
        <div className="text-center space-y-6 z-10 relative">
          {/* Creative Loading Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto relative">
              {/* Central dot */}
              <div className="absolute inset-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin">
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
                <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-green-500 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-glass-text-primary">Preparing Canvas</h3>
            <p className="text-glass-text-secondary">Setting up your creative workspace...</p>
          </div>

          {/* Loading Steps */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlassBackground />
      {/* Floating Header - Miro Style */}
      <div className="fixed top-6 left-6 z-30">
        <div className="glass-elevated border-glass-border rounded-2xl px-4 py-3 shadow-xl backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            {/* Menu Icon */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 p-0"
              onClick={() => setShowMainMenu(true)}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </Button>

            {/* Logo */}
            <img 
              src="/google-logo.png" 
              alt="Google" 
              className="h-8 w-auto"
            />

            {/* Project Title */}
            <span className="text-glass-text-primary font-medium">{project?.prompt || project?.title || "New Campaign"}</span>

            {/* More Options */}
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating Canvas Toolbar - Left Side (Miro Style) */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="glass-elevated border-glass-border rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col space-y-2">
            {/* Select Tool */}
            <Button
              size="sm"
              onClick={() => setTool("select")}
              className={`w-12 h-12 p-0 rounded-xl border-0 transition-colors ${
                tool === "select" 
                  ? "bg-[#dee5f3] text-[#334155] hover:bg-[#dee5f3]" 
                  : "bg-transparent hover:bg-[#e8edf7] text-[#64748b]"
              }`}
              title="Select & Move"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
              </svg>
            </Button>

            {/* Text */}
            <Button 
              size="sm" 
              onClick={() => setTool("text")}
              className={`w-12 h-12 p-0 rounded-xl border-0 transition-colors ${
                tool === "text" 
                  ? "bg-[#dee5f3] text-[#334155] hover:bg-[#dee5f3]" 
                  : "bg-transparent hover:bg-[#e8edf7] text-[#64748b]"
              }`}
              title="Add Text"
            >
              <Type className="w-5 h-5" />
            </Button>

            {/* Shape Tool */}
            <DropdownMenu open={showShapeDropdown} onOpenChange={setShowShapeDropdown}>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  onClick={() => setTool("shape")}
                  className={`w-12 h-12 p-0 rounded-xl border-0 transition-colors ${
                    tool === "shape" 
                      ? "bg-[#dee5f3] text-[#334155] hover:bg-[#dee5f3]" 
                      : "bg-transparent hover:bg-[#e8edf7] text-[#64748b]"
                  }`}
                  title="Add Shape"
                >
                  <Square className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem onClick={() => addShapeElement('rectangle', 300, 300)}>
                  <Square className="w-4 h-4 mr-2" />
                  Rectangle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addShapeElement('circle', 300, 300)}>
                  <Circle className="w-4 h-4 mr-2" />
                  Circle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addShapeElement('triangle', 300, 300)}>
                  <Triangle className="w-4 h-4 mr-2" />
                  Triangle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Image Tool */}
            <Button 
              size="sm" 
              onClick={() => setTool("image")}
              className={`w-12 h-12 p-0 rounded-xl border-0 transition-colors ${
                tool === "image" 
                  ? "bg-[#dee5f3] text-[#334155] hover:bg-[#dee5f3]" 
                  : "bg-transparent hover:bg-[#e8edf7] text-[#64748b]"
              }`}
              title="Add AI Image"
            >
              <FileImage className="w-5 h-5" />
            </Button>

            {/* Comments */}
            <Button 
              size="sm" 
              onClick={() => setTool("comment")}
              className={`w-12 h-12 p-0 rounded-xl border-0 transition-colors ${
                tool === "comment" 
                  ? "bg-[#dee5f3] text-[#334155] hover:bg-[#dee5f3]" 
                  : "bg-transparent hover:bg-[#e8edf7] text-[#64748b]"
              }`}
              title="Add Comment"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            {/* Add Section */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  className="w-12 h-12 p-0 rounded-xl border-0 bg-[#6366f1] hover:bg-[#5856eb] text-white transition-colors" 
                  title="Add Anything"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="ml-2">
                {/* Add all current templates plus landing page and hero */}
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
                <DropdownMenuItem onClick={() => addCard("landing")}>
                  <Globe className="w-4 h-4 mr-2" />
                  Landing Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addCard("slides")}>
                  <Presentation className="w-4 h-4 mr-2" />
                  Hero Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Collaboration UI - Top Right */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        {/* Presence Indicators */}
        <PresenceIndicators 
          presences={collaboration.presences}
          currentUserEphemeralId={collaboration.currentUserEphemeralId || undefined}
        />

        {/* Connection Status */}
        {collaboration.connectionStatus !== "connected" && (
          <Badge 
            variant={collaboration.connectionStatus === "connecting" ? "secondary" : "destructive"}
            className="text-xs"
          >
            {collaboration.connectionStatus}
          </Badge>
        )}

        {/* Share Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="glass-surface px-4 py-2 gap-2"
          onClick={() => setShowShareModal(true)}
        >
          <Users className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-move overflow-hidden"
        style={{ cursor: isPanning ? "grab" : tool === "hand" ? "grab" : "default" }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
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
          {/* Canvas Elements */}
          {canvasElements.map((element) => (
            <div
              key={element.id}
              className={`absolute ${tool === "select" ? "cursor-move" : "cursor-pointer"} ${
                draggedElement === element.id ? "shadow-2xl scale-105 z-50" : ""
              }`}
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                zIndex: element.zIndex || 0,
              }}
              onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            >
              {element.type === "text" && (
                <div
                  className="w-full h-full flex items-center justify-center border border-transparent hover:border-blue-300 rounded transition-all duration-200"
                  style={{
                    fontSize: element.content.fontSize || 16,
                    fontFamily: element.content.fontFamily || "Arial",
                    color: element.content.color || "#000000",
                    backgroundColor: element.content.backgroundColor || "transparent",
                    cursor: tool === "select" ? "move" : "pointer",
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingText(element.id);
                  }}
                >
                  {editingText === element.id ? (
                    <input
                      type="text"
                      value={element.content.text || ""}
                      onChange={(e) => updateElement(element.id, {
                        content: { ...element.content, text: e.target.value }
                      })}
                      onBlur={() => setEditingText(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingText(null)}
                      className="w-full h-full bg-transparent border-none outline-none text-center"
                      autoFocus
                    />
                  ) : (
                    <span>{element.content.text || "Double-click to edit"}</span>
                  )}
                </div>
              )}

              {element.type === "shape" && (
                <div 
                  className="w-full h-full transition-all duration-200 hover:scale-105"
                  style={{ cursor: tool === "select" ? "move" : "pointer" }}
                >
                  {element.content.shapeType === "rectangle" && (
                    <div
                      className="w-full h-full rounded border-2"
                      style={{
                        backgroundColor: element.content.fillColor || "#3b82f6",
                        borderColor: element.content.strokeColor || "#1e40af",
                        borderWidth: element.content.strokeWidth || 2,
                      }}
                    />
                  )}
                  {element.content.shapeType === "circle" && (
                    <div
                      className="w-full h-full rounded-full border-2"
                      style={{
                        backgroundColor: element.content.fillColor || "#3b82f6",
                        borderColor: element.content.strokeColor || "#1e40af",
                        borderWidth: element.content.strokeWidth || 2,
                      }}
                    />
                  )}
                  {element.content.shapeType === "triangle" && (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ color: element.content.fillColor || "#3b82f6" }}
                    >
                      <Triangle className="w-full h-full" fill="currentColor" />
                    </div>
                  )}
                </div>
              )}

              {element.type === "image" && (
                <div 
                  className="w-full h-full transition-all duration-200 hover:scale-105"
                  style={{ cursor: tool === "select" ? "move" : "pointer" }}
                >
                  {element.content.imageUrl ? (
                    <img
                      src={element.content.imageUrl}
                      alt={element.content.imagePrompt || "AI Generated"}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <FileImage className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              )}

              {element.type === "comment" && (
                <div 
                  className="w-full h-full"
                  style={{ cursor: tool === "select" ? "move" : "pointer" }}
                >
                  <div className="bg-yellow-100 border-l-4 border-yellow-400 p-2 rounded shadow-sm">
                    {activeComment === element.id ? (
                      <div>
                        <Textarea
                          value={element.content.commentText || ""}
                          onChange={(e) => updateElement(element.id, {
                            content: { ...element.content, commentText: e.target.value }
                          })}
                          placeholder="Add your comment..."
                          className="w-full text-xs"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-1 mt-1">
                          <Button
                            size="sm"
                            onClick={() => setActiveComment(null)}
                            className="h-6 px-2 text-xs"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteElement(element.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setActiveComment(element.id)}
                        className="cursor-pointer"
                      >
                        <div className="text-xs font-medium text-yellow-800">
                          {element.content.author || "Comment"}
                        </div>
                        <div className="text-xs text-yellow-700">
                          {element.content.commentText || "Click to add comment..."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Rich Asset Cards */}
          {mockCanvasCards.map((card, index) => {
            const positions = [
              { x: 200, y: 150 },
              { x: 600, y: 150 },
              { x: 200, y: 450 },
              { x: 600, y: 450 }
            ];
            const position = positions[index] || { x: 200 + (index * 100), y: 150 };
            
            return (
              <div
                key={card.id}
                className="absolute"
                style={{
                  left: position.x,
                  top: position.y,
                  transform: `scale(${viewport.zoom}) translate(${viewport.x / viewport.zoom}px, ${viewport.y / viewport.zoom}px)`,
                  transformOrigin: '0 0'
                }}
              >
                <RichAssetCard
                  card={card}
                  onExpand={() => setExpandedCard(card.id)}
                  onDuplicate={() => console.log('Duplicate', card.id)}
                  onExport={() => console.log('Export', card.id)}
                  onDelete={() => console.log('Delete', card.id)}
                  onRetry={() => console.log('Retry', card.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Live Cursors */}
        {Array.from(collaboration.cursors.values()).map((cursor) => (
          <LiveCursor
            key={cursor.ephemeralId}
            cursor={cursor}
            displayName={cursor.displayName}
            color={cursor.color}
            isVisible={true}
          />
        ))}
      </div>

      {/* Share Modal */}
      <ShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        canvasId={campaignId ? parseInt(campaignId) : 0}
      />

      {/* Rich Asset Drawer */}
      <AssetDrawer
        card={mockCanvasCards.find(c => c.id === expandedCard) || null}
        open={!!expandedCard}
        onClose={() => setExpandedCard(null)}
        onApplyAI={(prompt) => console.log('Apply AI:', prompt)}
        onSaveManual={(data) => console.log('Save manual:', data)}
        onExport={() => console.log('Export')}
      />

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

      {/* Zoom Controls - Bottom Right (Miro Style) */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="glass-elevated border-glass-border rounded-2xl p-2 shadow-xl backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            {/* Fit to View */}
            <Button variant="ghost" size="sm" onClick={handleFitToView} className="w-10 h-10 p-0 rounded-xl" title="Fit to Screen">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
              </svg>
            </Button>

            {/* Separator */}
            <div className="w-px h-6 bg-glass-border"></div>

            {/* Zoom Percentage */}
            <div className="px-3 py-1">
              <span className="text-sm font-medium text-glass-text-primary">
                {Math.round(viewport.zoom * 100)}%
              </span>
            </div>

            {/* Zoom Controls */}
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="w-10 h-10 p-0 rounded-xl" title="Zoom Out">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
              </svg>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="w-10 h-10 p-0 rounded-xl" title="Zoom In">
              <Plus className="w-4 h-4" />
            </Button>

            {/* Help/Info */}
            <div className="w-px h-6 bg-glass-border"></div>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl" title="Help">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* AI Image Generation Dialog */}
      <Sheet open={showImageDialog} onOpenChange={setShowImageDialog}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Generate AI Image</SheetTitle>
            <SheetDescription>
              Create an image using AI based on your description
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 pb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Image Description
              </label>
              <Textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                rows={4}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => generateAIImage(imagePrompt)}
                disabled={!imagePrompt.trim() || isGeneratingImage}
                className="flex-1"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowImageDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Menu */}
      <MainMenu isOpen={showMainMenu} onOpenChange={setShowMainMenu} />
    </div>
  );
}