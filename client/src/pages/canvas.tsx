import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CanvasCard } from "@/types/canvas";
import { Plus, Share, X, Home, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface AssetCard extends CanvasCard {
  content?: {
    preview?: string;
    text?: string;
    image?: string;
    [key: string]: any;
  };
  previewImage?: string;
}

interface Project {
  id: string;
  title: string;
  prompt: string;
  createdAt: Date;
  assets: AssetCard[];
}

const CARD_TEMPLATES = [
  { type: "video", label: "Vertical Video", description: "TikTok, Instagram Reels, YouTube Shorts" },
  { type: "landing", label: "Landing Page Hero", description: "Website header section" },
  { type: "linkedin", label: "LinkedIn Image", description: "Professional social post" },
  { type: "banner", label: "Ad Banner", description: "Display advertising" },
  { type: "instagram", label: "Instagram Post", description: "Square social media post" },
  { type: "twitter", label: "Twitter/X Post", description: "Social media engagement" },
  { type: "email", label: "Email Template", description: "Newsletter or marketing email" },
  { type: "facebook", label: "Facebook Post", description: "Social media content" },
];

const DEFAULT_CARDS: AssetCard[] = [
  {
    id: "1",
    type: "landing",
    title: "Landing Page Hero",
    summary: "High-converting landing page hero section with meta description",
    status: "ready", 
    version: 1,
    counts: { images: 0, sections: 0, words: 0, variants: 0, aiEdits: 0, comments: 0 },
    collaborators: [],
    lastEditedAt: new Date().toISOString(),
    content: {
      preview: "Hero section with compelling headline and CTA",
      text: "Meta description: Conversion-optimized hero section featuring bold headline, value proposition, and strategic call-to-action button. Designed to capture attention and drive user engagement from first page visit.",
    },
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='campaignGrad2' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%234285f4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23ffffff' rx='12'/%3E%3Crect x='0' y='0' width='100%25' height='55' fill='url(%23campaignGrad2)'/%3E%3Ctext x='50%25' y='32' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='14' fill='white' font-weight='bold'%3ECampaign AI Platform%3C/text%3E%3Crect x='40' y='75' width='240' height='12' rx='6' fill='%23f1f3f4'/%3E%3Crect x='40' y='95' width='200' height='8' rx='4' fill='%23f1f3f4'/%3E%3Crect x='40' y='110' width='180' height='8' rx='4' fill='%23f1f3f4'/%3E%3Crect x='40' y='140' width='140' height='28' rx='14' fill='url(%23campaignGrad2)'/%3E%3Ctext x='110' y='156' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='11' fill='white' font-weight='600'%3EStart Campaign%3C/text%3E%3C/svg%3E"
  },
  {
    id: "2",
    type: "banner",
    title: "Ad Banner",
    summary: "Eye-catching advertising banner with meta description",
    status: "ready",
    version: 1,
    counts: { images: 0, sections: 0, words: 0, variants: 0, aiEdits: 0, comments: 0 },
    collaborators: [],
    lastEditedAt: new Date().toISOString(),
    content: {
      preview: "Professional banner ad with brand elements",
      text: "Meta description: Strategic advertising banner optimized for display campaigns across web and social platforms. Features brand-consistent design, clear messaging, and compelling visuals to drive click-through rates.",
    },
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='campaignGrad4' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%234285f4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23campaignGrad4)' rx='12'/%3E%3Crect x='15' y='25' width='90' height='90' rx='12' fill='white' opacity='0.95'/%3E%3Ctext x='60' y='50' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='9' font-weight='600' fill='%234285f4'%3ECampaign%3C/text%3E%3Ctext x='60' y='65' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='9' font-weight='600' fill='%234285f4'%3EAI%3C/text%3E%3Ctext x='60' y='80' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='8' font-weight='500' fill='%236366f1'%3EPlatform%3C/text%3E%3Ctext x='180' y='50' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='16' fill='white' font-weight='bold'%3ECampaign Launch%3C/text%3E%3Ctext x='180' y='75' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='18' fill='white' font-weight='bold'%3E50%25 OFF%3C/text%3E%3Crect x='140' y='100' width='80' height='20' rx='10' fill='white'/%3E%3Ctext x='180' y='112' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='8' fill='%234285f4' font-weight='600'%3EStart Campaign%3C/text%3E%3Ccircle cx='250' cy='70' r='15' fill='white' fill-opacity='0.2'/%3E%3Ctext x='250' y='75' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='14' fill='white'%3E🎯%3C/text%3E%3C/svg%3E"
  },
  {
    id: "3",
    type: "linkedin",
    title: "Social Post",
    summary: "Professional social media post with meta description",
    status: "ready",
    version: 1,
    counts: { images: 0, sections: 0, words: 0, variants: 0, aiEdits: 0, comments: 0 },
    collaborators: [],
    lastEditedAt: new Date().toISOString(),
    content: {
      preview: "Professional social media post visual",
      text: "Meta description: Business-focused social media image designed for professional networking and thought leadership. Optimized for social algorithms with industry-appropriate design and engagement-driving elements.",
    },
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='campaignGrad3' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%234285f4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23campaignGrad3)' rx='12'/%3E%3Crect x='15' y='15' width='290' height='150' rx='8' fill='white'/%3E%3Ccircle cx='45' cy='45' r='12' fill='%234285f4'/%3E%3Ctext x='45' y='49' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='8' font-weight='bold' fill='white'%3ECB%3C/text%3E%3Crect x='65' y='35' width='100' height='6' rx='3' fill='%23333'/%3E%3Crect x='65' y='45' width='70' height='4' rx='2' fill='%23666'/%3E%3Crect x='25' y='65' width='270' height='5' rx='2' fill='%23f0f0f0'/%3E%3Crect x='25' y='75' width='250' height='5' rx='2' fill='%23f0f0f0'/%3E%3Crect x='25' y='85' width='220' height='5' rx='2' fill='%23f0f0f0'/%3E%3Crect x='25' y='105' width='270' height='35' rx='6' fill='%23f8faff'/%3E%3Crect x='45' y='115' width='12' height='15' fill='%234285f4' rx='2'/%3E%3Crect x='65' y='120' width='12' height='10' fill='%236366f1' rx='2'/%3E%3Crect x='85' y='112' width='12' height='18' fill='%234285f4' rx='2'/%3E%3Crect x='105' y='117' width='12' height='13' fill='%236366f1' rx='2'/%3E%3Ctext x='160' y='127' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='9' fill='%23666'%3E📊 Campaign Dashboard%3C/text%3E%3Crect x='25' y='150' width='50' height='12' rx='6' fill='%234285f4'/%3E%3Ctext x='50' y='157' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='7' fill='white' font-weight='600'%3ELike%3C/text%3E%3C/svg%3E"
  },
  {
    id: "4",
    type: "video",
    title: "Vertical Video",
    summary: "Engaging vertical video content with meta description for social media platforms",
    status: "generating",
    version: 1,
    counts: { images: 0, sections: 0, words: 0, variants: 0, aiEdits: 0, comments: 0 },
    collaborators: [],
    lastEditedAt: new Date().toISOString(),
    content: {
      preview: "9:16 vertical video preview with compelling visuals",
      text: "Meta description: Captivating vertical video designed for maximum engagement on mobile platforms. Optimized for TikTok, Instagram Reels, and YouTube Shorts with compelling storytelling and clear call-to-action.",
    },
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='campaignGrad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234285f4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23campaignGrad1)' rx='12'/%3E%3Ctext x='50%25' y='20' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='11' font-weight='600' fill='white'%3ECampaign AI Platform%3C/text%3E%3Crect x='130' y='35' width='60' height='110' rx='15' fill='%23ffffff' opacity='0.95'/%3E%3Ccircle cx='160' cy='90' r='18' fill='%234285f4'/%3E%3Cpolygon points='153,83 153,97 170,90' fill='white'/%3E%3Ctext x='50%25' y='165' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='9' fill='white' font-weight='500'%3EAI Video Content%3C/text%3E%3C/svg%3E"
  },
];

// Virtual Keyboard Component
function VirtualKeyboard({ 
  onKeyPress, 
  onBackspace, 
  onDone 
}: { 
  onKeyPress: (key: string) => void; 
  onBackspace: () => void; 
  onDone: () => void; 
}) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="bg-gray-100 rounded-lg p-4 space-y-3">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 text-lg font-medium"
              data-testid={`key-${key.toLowerCase()}`}
            >
              {key}
            </Button>
          ))}
        </div>
      ))}
      
      {/* Bottom row with special keys */}
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => onKeyPress(' ')}
          className="w-32 h-12 bg-white hover:bg-gray-50 border border-gray-300 text-sm"
          data-testid="key-space"
        >
          Space
        </Button>
        <Button
          onClick={onBackspace}
          className="w-20 h-12 bg-white hover:bg-gray-50 border border-gray-300 text-sm"
          data-testid="key-backspace"
        >
          ⌫
        </Button>
        <Button
          onClick={onDone}
          className="w-20 h-12 bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm"
          data-testid="key-done"
        >
          Done
        </Button>
      </div>
    </div>
  );
}

// Timeout Modal Component
function TimeoutModal({ 
  isOpen, 
  timeLeft, 
  onExtend, 
  onClose 
}: { 
  isOpen: boolean; 
  timeLeft: number; 
  onExtend: () => void; 
  onClose: () => void; 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm bg-white dotted-background" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="sr-only">
          <DialogTitle>Session Timeout</DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          {/* Placeholder Image */}
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-xl font-medium text-gray-800 mb-3">Are you still there?</h2>
          <p className="text-base text-gray-600 mb-4">
            Your experience will time out in{' '}
            <span className="inline-block bg-gray-800 text-white px-2 py-1 rounded-full font-mono text-sm">
              0:{timeLeft.toString().padStart(2, '0')}
            </span>
          </p>
          <Button
            onClick={onExtend}
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-full text-sm"
            data-testid="button-extend-session"
          >
            I'm still here!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CanvasView() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/canvas/:id");
  const campaignId = params?.id;
  
  // State management
  const [project, setProject] = useState<Project | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetCard | null>(null);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [editContent, setEditContent] = useState("");
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFullPagePreview, setShowFullPagePreview] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load campaign data if campaignId is provided
  const { data: campaignData } = useQuery({
    queryKey: ['/api/campaigns', campaignId],
    enabled: !!campaignId,
  });

  // Initialize project with default cards or campaign data
  useEffect(() => {
    if (campaignData && typeof campaignData === 'object' && 'id' in campaignData) {
      const campaign = campaignData as any;
      const newProject: Project = {
        id: campaign.id.toString(),
        title: campaign.name,
        prompt: campaign.name + ' - ' + (campaign.campaignFocus || 'Campaign'),
        createdAt: new Date(campaign.createdAt),
        assets: campaign.generatedAssets?.length > 0 
          ? campaign.generatedAssets.map((asset: any, index: number) => ({
              ...DEFAULT_CARDS[index % DEFAULT_CARDS.length],
              id: asset.id || `asset-${index}`,
              title: asset.title || DEFAULT_CARDS[index % DEFAULT_CARDS.length].title,
              status: asset.status || "ready",
              content: {
                ...DEFAULT_CARDS[index % DEFAULT_CARDS.length].content,
                ...asset.content
              },
            }))
          : DEFAULT_CARDS
      };
      setProject(newProject);
    } else {
      // Default project with sample cards
      setProject({
        id: "sample-project",
        title: "Marketing Campaign",
        prompt: "Create engaging marketing content",
        createdAt: new Date(),
        assets: DEFAULT_CARDS
      });
    }
  }, [campaignData]);

  // Simulate video generation completion after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (project) {
        setProject(prevProject => {
          if (!prevProject) return prevProject;
          return {
            ...prevProject,
            assets: prevProject.assets.map(asset => 
              asset.id === "1" && asset.status === "generating" 
                ? { ...asset, status: "ready" } 
                : asset
            )
          };
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [project?.assets[0]?.status]);

  // Timeout functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutModal(true);
    }, 20000); // Show modal after 20 seconds

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer for timeout modal
  useEffect(() => {
    if (showTimeoutModal && timeLeft > 0) {
      const countdown = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - redirect to landing page
            setLocation('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(countdown);
    }
  }, [showTimeoutModal, timeLeft, setLocation]);

  const handleExtendSession = () => {
    setShowTimeoutModal(false);
    setTimeLeft(20);
    // Reset the 20-second timer
    setTimeout(() => {
      setShowTimeoutModal(true);
    }, 20000);
  };

  const handleAssetClick = (asset: AssetCard) => {
    if (!project) return;
    
    setSelectedAsset(asset);
    setEditContent(asset.content?.text || "");
    const index = project.assets.findIndex(a => a.id === asset.id);
    setCurrentPreviewIndex(index);
    setShowFullPagePreview(true);
  };

  const handleNavigatePrevious = () => {
    if (!project || isTransitioning) return;
    
    setIsTransitioning(true);
    const prevIndex = currentPreviewIndex > 0 ? currentPreviewIndex - 1 : project.assets.length - 1;
    
    setTimeout(() => {
      setCurrentPreviewIndex(prevIndex);
      setSelectedAsset(project.assets[prevIndex]);
      setEditContent(project.assets[prevIndex].content?.text || "");
      setIsTransitioning(false);
    }, 150);
  };

  const handleNavigateNext = () => {
    if (!project || isTransitioning) return;
    
    setIsTransitioning(true);
    const nextIndex = currentPreviewIndex < project.assets.length - 1 ? currentPreviewIndex + 1 : 0;
    
    setTimeout(() => {
      setCurrentPreviewIndex(nextIndex);
      setSelectedAsset(project.assets[nextIndex]);
      setEditContent(project.assets[nextIndex].content?.text || "");
      setIsTransitioning(false);
    }, 150);
  };

  const handleKeyPress = (key: string) => {
    const newContent = editContent.slice(0, cursorPosition) + key + editContent.slice(cursorPosition);
    setEditContent(newContent);
    setCursorPosition(cursorPosition + 1);
  };

  const handleBackspace = () => {
    if (cursorPosition > 0) {
      const newContent = editContent.slice(0, cursorPosition - 1) + editContent.slice(cursorPosition);
      setEditContent(newContent);
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleKeyboardDone = () => {
    setShowVirtualKeyboard(false);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddNewCard = (cardType: string) => {
    const template = CARD_TEMPLATES.find(t => t.type === cardType);
    if (!template || !project) return;

    const newCard: AssetCard = {
      id: generateId(),
      type: cardType as any,
      title: template.label,
      summary: template.description,
      status: "ready",
      version: 1,
      counts: { images: 0, sections: 0, words: 0, variants: 0, aiEdits: 0, comments: 0 },
      collaborators: [],
      lastEditedAt: new Date().toISOString(),
      content: {
        preview: `Generated ${template.label} content`,
        text: `AI-generated ${template.label} content for your marketing campaign.`,
      },
      previewImage: `data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='14' fill='%236b7280'%3E${encodeURIComponent(template.label)}%3C/text%3E%3C/svg%3E`
    };

    setProject({
      ...project,
      assets: [...project.assets, newCard]
    });

    setShowAddModal(false);
  };

  const handleShareClick = () => {
    const currentUrl = window.location.href;
    setShowQRModal(true);
  };

  const handleSaveContent = () => {
    if (selectedAsset && project) {
      const updatedAssets = project.assets.map(asset => 
        asset.id === selectedAsset.id 
          ? { ...asset, content: { ...asset.content, text: editContent } }
          : asset
      );
      setProject({ ...project, assets: updatedAssets });
      setShowAssetModal(false);
      setShowVirtualKeyboard(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center dotted-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dotted-background overflow-hidden">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Static Centered Grid Layout */}
      <div className="min-h-screen flex flex-col">
        {/* Title Section - Matching Preview Page Style */}
        <div className="text-center pt-24 pb-16" style={{ marginTop: '-80px' }}>
          <h1 className="text-5xl font-normal text-gray-900 mb-4" style={{ fontWeight: '500' }}>
            Canvas
          </h1>
        </div>

        {/* Main Content Area - Single Line Layout */}
        <div className="flex-1 flex items-center justify-center pb-20" style={{ padding: '0 14rem', marginTop: '-260px' }}>
          <div className="w-full max-w-none">
            <div className="grid grid-cols-4 gap-10 max-w-8xl mx-auto">
              {project.assets.map((card) => (
                <Card 
                  key={card.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-xl shadow-md hover:ring-1 hover:ring-gray-300 w-full relative"
                  onClick={() => handleAssetClick(card)}
                  data-testid={`card-asset-${card.id}`}
                >
                  {/* Edit Button - Positioned close to card content */}
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAsset(card);
                        setShowAssetModal(true);
                      }}
                      className="px-3 py-1 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 text-xs rounded-full"
                      data-testid={`button-edit-card-${card.id}`}
                    >
                      Edit
                    </Button>
                  </div>
                  <CardContent className="p-8">
                    {/* Image with Spinner for generating status */}
                    <div className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden mb-6 flex items-center justify-center relative">
                      {card.status === 'generating' ? (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <img 
                          src={card.previewImage} 
                          alt={card.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Style Badge */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {card.type === 'landing' ? 'Landing Page' : 
                         card.type === 'banner' ? 'Ad Banner' : 
                         card.type === 'linkedin' ? 'Social Post' : 
                         card.type === 'video' ? 'Vertical Video' : 'Description'}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl text-gray-800 mb-4" style={{ fontWeight: '475' }}>
                      {card.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-base text-gray-600 mb-6" style={{ fontWeight: '400' }}>
                      {card.summary}
                    </p>
                    
                    {/* Learn More Button */}
                    <Button 
                      variant="outline" 
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 rounded-full"
                      data-testid={`button-learn-more-${card.id}`}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Toolbar - Optimized for Touch */}
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                onClick={() => setShowAddModal(true)}
                className="w-16 h-16 p-0 rounded-full bg-white hover:bg-gray-50 border border-gray-200 active:scale-95 transition-all"
                data-testid="button-add-new"
              >
                <span className="text-2xl text-gray-600">+</span>
              </Button>
              
              <Button
                size="lg"
                onClick={handleShareClick}
                className="w-16 h-16 p-0 rounded-full bg-white hover:bg-gray-50 border border-gray-200 active:scale-95 transition-all"
                data-testid="button-share"
              >
                <span className="text-2xl text-gray-600">⚡</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Page Preview */}
      {showFullPagePreview && selectedAsset && (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden">

          {/* Top Navigation */}
          <TopNavigation />
          
          <div className="hidden">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFullPagePreview(false)}
              className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 rounded-full"
              data-testid="button-close-preview"
            >
← Back
            </Button>
          </div>

          {/* Main Title - Centered at Top */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 text-center">
            <h1 className="text-5xl font-normal text-gray-900 mb-2" style={{ fontWeight: '500' }}>
              {selectedAsset.type === 'landing' ? 'Landing Page' : 
               selectedAsset.type === 'banner' ? 'Ad Banner' : 
               selectedAsset.type === 'linkedin' ? 'Social Post' : 
               selectedAsset.type === 'video' ? 'Vertical Video' : selectedAsset.title}
            </h1>
            <p className="text-lg text-gray-600">
              {currentPreviewIndex + 1}/{project.assets.length}
            </p>
          </div>

          {/* Navigation Arrows - Positioned closer to content */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleNavigatePrevious}
            disabled={isTransitioning}
            className="absolute left-1/4 top-1/2 transform -translate-y-1/2 -translate-x-8 z-10 w-16 h-16 rounded-full bg-white shadow-lg border-gray-300 hover:shadow-xl transition-all disabled:opacity-50"
            data-testid="button-navigate-previous"
          >
            <span className="text-2xl">←</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleNavigateNext}
            disabled={isTransitioning}
            className="absolute right-1/4 top-1/2 transform -translate-y-1/2 translate-x-8 z-10 w-16 h-16 rounded-full bg-white shadow-lg border-gray-300 hover:shadow-xl transition-all disabled:opacity-50"
            data-testid="button-navigate-next"
          >
            <span className="text-2xl">→</span>
          </Button>

          {/* Edit Button - Much closer to content */}
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-10">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedAsset(project.assets[currentPreviewIndex]);
                setShowAssetModal(true);
              }}
              className="px-6 py-2 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 text-sm rounded-full"
              data-testid="button-edit-slideshow"
            >
              Edit
            </Button>
          </div>

          {/* Export Assets Button - Bottom Center */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedAsset(project.assets[currentPreviewIndex]);
                setShowAssetModal(true);
              }}
              className="px-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 font-semibold rounded-full"
              data-testid="button-export-assets"
            >
              Export Assets
            </Button>
          </div>

          {/* Preview Content with Transition */}
          <div className={`w-full h-full flex items-center justify-center pb-24 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {selectedAsset.type === 'landing' && (
              <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Landing Page Hero Simulation */}
                <div className="bg-white p-12 flex items-center">
                  <div className="flex-1 text-left">
                    <h1 className="text-4xl font-bold mb-6 leading-tight text-gray-900">
                      Transform Your Business
                    </h1>
                    <p className="text-lg mb-8 text-gray-700 max-w-2xl">
                      {editContent || "Discover how our AI-powered platform can revolutionize your marketing strategies and drive unprecedented growth."}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-blue-600 text-white hover:bg-blue-700 text-base px-8 py-4 rounded-xl font-semibold"
                    >
                      Get Started Now
                    </Button>
                  </div>
                  {/* Image on the right */}
                  <div className="w-96 h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center ml-12">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div className="text-xl font-semibold text-gray-800">Campaign AI</div>
                      <div className="text-base text-gray-600">Landing Page</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedAsset.type === 'linkedin' && (
              <div className="w-full max-w-4xl mx-auto">
                {/* LinkedIn Post Simulation */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200">
                  {/* LinkedIn Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        CB
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Campaign Builder</h3>
                        <p className="text-sm text-gray-500">Marketing Technology • 2h</p>
                      </div>
                    </div>
                  </div>
                  {/* LinkedIn Content */}
                  <div className="p-6">
                    <p className="text-lg text-gray-800 leading-relaxed mb-6">
                      {editContent || "🚀 Excited to share how AI is transforming marketing! Our latest campaign generated 3x more engagement using intelligent targeting and personalized content creation. The future of marketing is here! #AI #Marketing #Innovation"}
                    </p>
                    {/* Image on the right */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            {/* Chart bars */}
                            <div className="flex items-end justify-center space-x-3 h-24 mb-3">
                              <div className="bg-blue-500 rounded-t" style={{height: '60%', width: '16px'}}></div>
                              <div className="bg-blue-600 rounded-t" style={{height: '85%', width: '16px'}}></div>
                              <div className="bg-blue-700 rounded-t" style={{height: '100%', width: '16px'}}></div>
                              <div className="bg-blue-800 rounded-t" style={{height: '75%', width: '16px'}}></div>
                              <div className="bg-indigo-600 rounded-t" style={{height: '90%', width: '16px'}}></div>
                            </div>
                            <div className="text-sm text-gray-600 text-center">3x Engagement Increase</div>
                          </div>
                        </div>
                        <div className="w-32 h-24 bg-blue-50 rounded-lg flex items-center justify-center ml-6">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                              </svg>
                            </div>
                            <div className="text-xs text-gray-700 font-medium">LinkedIn</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* LinkedIn Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-6 text-gray-600">
                        <button className="flex items-center space-x-2 hover:text-blue-600">
                          <span>👍</span> <span>Like</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-600">
                          <span>💬</span> <span>Comment</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-600">
                          <span>🔄</span> <span>Repost</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-600">
                          <span>📤</span> <span>Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedAsset.type === 'video' && (
              <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Vertical Video Player Simulation */}
                <div className="bg-white p-16 flex items-center">
                  <div className="flex-1">
                    <h2 className="text-5xl font-bold mb-6 text-gray-900">Vertical Video Content</h2>
                    <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                      {editContent || "Transform your content strategy with AI-powered video creation that engages your audience across all platforms."}
                    </p>
                    <div className="text-lg text-gray-600 mb-8">
                      Perfect for TikTok, Instagram Reels & YouTube Shorts
                    </div>
                    {/* Video Controls */}
                    <div className="flex space-x-6 text-gray-600">
                      <button className="flex items-center space-x-2">❤️ <span>12.5K</span></button>
                      <button className="flex items-center space-x-2">💬 <span>234</span></button>
                      <button className="flex items-center space-x-2">🔄 <span>89</span></button>
                      <button>📤</button>
                    </div>
                  </div>
                  {/* Image on the right */}
                  <div className="w-64 ml-16">
                    <div className="bg-gray-100 rounded-3xl aspect-[9/16] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[10px] border-y-transparent ml-1"></div>
                          </div>
                          <div className="text-sm font-semibold text-gray-800">Campaign AI</div>
                          <div className="text-xs text-gray-600">Video</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedAsset.type === 'banner' && (
              <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Ad Banner Simulation */}
                <div className="bg-white p-12 flex items-center">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                      Special Limited Offer!
                    </h2>
                    <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                      {editContent || "Get 50% off your first month - Transform your marketing with AI-powered campaigns that deliver results."}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-blue-600 text-white hover:bg-blue-700 text-base px-6 py-3 rounded-xl font-semibold"
                    >
                      Claim Offer Now →
                    </Button>
                  </div>
                  {/* Image on the right */}
                  <div className="w-96 h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center ml-12">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <div className="text-6xl text-white">🎯</div>
                      </div>
                      <div className="text-xl font-semibold text-gray-800">Campaign AI</div>
                      <div className="text-base text-gray-600">Ad Banner</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Asset Content Modal with Virtual Keyboard */}
      <Dialog open={showAssetModal} onOpenChange={setShowAssetModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dotted-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit {selectedAsset?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 space-y-4">
            {selectedAsset && (
              <>
                {/* Asset Preview */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <img 
                    src={selectedAsset.previewImage} 
                    alt={selectedAsset.title}
                    className="w-full max-w-xs mx-auto h-32 object-cover rounded-lg"
                  />
                </div>
                
                {/* Content Editor */}
                <div>
                  <h3 className="text-base font-medium mb-2">Content</h3>
                  <div className="relative">
                    <Textarea
                      value={editContent}
                      onChange={(e) => {
                        setEditContent(e.target.value);
                        setCursorPosition(e.target.selectionStart || 0);
                      }}
                      onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart || 0)}
                      placeholder="Edit your content here..."
                      className="min-h-20 text-sm"
                      data-testid="textarea-content-edit"
                      onClick={() => setShowVirtualKeyboard(true)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                      className="absolute top-2 right-2"
                      data-testid="button-toggle-keyboard"
                    >
                      ⌨️
                    </Button>
                  </div>
                </div>

                {/* Virtual Keyboard */}
                {showVirtualKeyboard && (
                  <VirtualKeyboard
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onDone={handleKeyboardDone}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleSaveContent}
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white"
                    data-testid="button-save-content"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAssetModal(false);
                      setShowVirtualKeyboard(false);
                    }}
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Share Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-xs dotted-background">
          <DialogHeader>
            <DialogTitle className="text-lg">Share Canvas</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Scan this QR code to access the canvas
            </p>
            <div className="bg-white p-3 rounded-lg inline-block">
              <QRCode 
                value={window.location.href} 
                size={140}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Anyone with this link can view the canvas
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Asset Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto dotted-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Asset</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">Choose the type of marketing asset you'd like to create:</p>
            <div className="grid grid-cols-2 gap-4">
              {CARD_TEMPLATES.map((template) => (
                <div
                  key={template.type}
                  className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-[#4285F4] transition-all duration-200"
                  onClick={() => handleAddNewCard(template.type)}
                  data-testid={`template-${template.type}`}
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.label}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <Button
                      className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm"
                      size="sm"
                    >
                      Create {template.label}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timeout Modal */}
      <TimeoutModal
        isOpen={showTimeoutModal}
        timeLeft={timeLeft}
        onExtend={handleExtendSession}
        onClose={() => setShowTimeoutModal(false)}
      />
    </div>
  );
}