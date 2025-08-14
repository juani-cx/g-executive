import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';

import { CampaignConfigCard } from "@/components/canvas/campaign-config-card";
import { ShareModal } from "@/components/collaboration/share-modal";

import { 
  Settings, 
  Maximize2,
  FileImage,
  FileText,
  Mail,
  Facebook,
  Twitter,
  Youtube,
  Newspaper,
} from "lucide-react";

import { useCollaboration } from "@/hooks/useCollaboration";

// Asset card type definition
export type AssetType = 
  | "slides" 
  | "landing" 
  | "linkedin" 
  | "instagram" 
  | "twitter" 
  | "facebook" 
  | "email" 
  | "ads" 
  | "blog" 
  | "youtube" 
  | "press";

interface AssetCard {
  id: string;
  type: AssetType;
  title: string;
  status: "generating" | "ready" | "editing";
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

interface Project {
  id: string;
  title: string;
  prompt: string;
  createdAt: Date;
  assets: AssetCard[];
}

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
  
  // Core canvas state
  const [project, setProject] = useState<Project | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // UI state
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [cardDragStart, setCardDragStart] = useState({ x: 0, y: 0 });
  
  // Collaboration state
  const [cardLocks, setCardLocks] = useState<Record<string, string>>({});
  const urlParams = new URLSearchParams(window.location.search);
  const linkToken = urlParams.get('token');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load campaign data if campaignId is provided
  const { data: campaignData } = useQuery({
    queryKey: ['/api/campaigns', campaignId],
    enabled: !!campaignId,
  });

  // Initialize collaboration
  const collaboration = useCollaboration({
    canvasId: campaignId ? parseInt(campaignId) : 0,
    linkToken: linkToken || undefined,
    displayName: `User ${Math.floor(Math.random() * 1000)}`,
    enabled: !!campaignId
  });

  // Initialize project once - using useCallback to prevent infinite loops
  const initializeProject = useCallback(() => {
    if (project) return; // Already initialized
    
    // If we have campaign data, use it
    if (campaignData && typeof campaignData === 'object' && 'id' in campaignData) {
      const campaign = campaignData as any;
      const newProject: Project = {
        id: campaign.id.toString(),
        title: campaign.name,
        prompt: campaign.name + ' - ' + (campaign.campaignFocus || 'Campaign'),
        createdAt: new Date(campaign.createdAt),
        assets: DEFAULT_CARDS.map((card, index) => ({
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
      localStorage.removeItem('campaignPrompt');
    } else if (!campaignId) {
      // Redirect back to home if no prompt and no campaign ID
      setLocation('/');
    }
  }, [campaignData, campaignId, project, setLocation]);

  // Run initialization once
  useEffect(() => {
    initializeProject();
  }, [initializeProject]);

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

  // Canvas interaction handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) { // Middle mouse button for panning
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
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggedCard(null);
    document.body.style.cursor = 'default';
  };

  const handleCardMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    setDraggedCard(cardId);
    setCardDragStart({ x: e.clientX, y: e.clientY });
    setSelectedCard(cardId);
  };

  if (!project) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">{project.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Share
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 top-14 cursor-move"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{ 
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Asset Cards */}
        {project.assets.map((asset) => (
          <div
            key={asset.id}
            className="absolute"
            style={{
              left: asset.position.x,
              top: asset.position.y,
              width: asset.size.width,
              height: asset.size.height,
            }}
            onMouseDown={(e) => handleCardMouseDown(e, asset.id)}
          >
            <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{asset.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  asset.status === 'generating' ? 'bg-orange-100 text-orange-800' :
                  asset.status === 'ready' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {asset.status}
                </span>
              </div>
              {asset.status === 'generating' ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  {asset.content?.text || `Generated content for ${asset.type}`}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Campaign Configuration Card */}
        {campaignData && (
          <div
            className="absolute"
            style={{
              left: 900,
              top: 100,
              width: 320,
              height: 240,
            }}
          >
            <CampaignConfigCard 
              campaign={campaignData as any}
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Modals */}

      {showShareModal && campaignId && (
        <ShareModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          canvasId={parseInt(campaignId)}
        />
      )}
    </div>
  );
}