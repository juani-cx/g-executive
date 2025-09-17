import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad1)'/%3E%3Crect x='130' y='30' width='60' height='120' rx='15' fill='%23ffffff' opacity='0.9'/%3E%3Ctext x='50%25' y='25' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='12' fill='white' font-weight='600'%3EVertical Video Content%3C/text%3E%3Ccircle cx='160' cy='90' r='15' fill='white' opacity='0.8'/%3E%3Cpolygon points='155,85 155,95 167,90' fill='%23667eea'/%3E%3C/svg%3E"
  },
  {
    id: "2",
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
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ffffff'/%3E%3Crect x='0' y='0' width='100%25' height='50' fill='%234285F4'/%3E%3Ctext x='50%25' y='30' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='16' fill='white' font-weight='bold'%3EYour Brand%3C/text%3E%3Crect x='40' y='70' width='240' height='15' rx='7' fill='%23f1f3f4'/%3E%3Crect x='40' y='95' width='200' height='10' rx='5' fill='%23f1f3f4'/%3E%3Crect x='40' y='115' width='180' height='10' rx='5' fill='%23f1f3f4'/%3E%3Crect x='40' y='145' width='120' height='25' rx='12' fill='%234285F4'/%3E%3Ctext x='100' y='158' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='10' fill='white' font-weight='600'%3ECTA Button%3C/text%3E%3C/svg%3E"
  },
  {
    id: "3",
    type: "linkedin",
    title: "LinkedIn Image",
    summary: "Professional LinkedIn post image with meta description",
    status: "ready",
    version: 1,
    counts: { images: 0, sections: 0, words: 0, variants: 0, aiEdits: 0, comments: 0 },
    collaborators: [],
    lastEditedAt: new Date().toISOString(),
    content: {
      preview: "Professional LinkedIn post visual",
      text: "Meta description: Business-focused LinkedIn image designed for professional networking and thought leadership. Optimized for LinkedIn's algorithm with industry-appropriate design and engagement-driving elements.",
    },
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%230077b5'/%3E%3Crect x='20' y='20' width='280' height='140' rx='8' fill='white'/%3E%3Ccircle cx='50' cy='50' r='15' fill='%23ddd'/%3E%3Crect x='75' y='40' width='120' height='8' rx='4' fill='%23ddd'/%3E%3Crect x='75' y='55' width='80' height='6' rx='3' fill='%23ccc'/%3E%3Crect x='30' y='80' width='260' height='6' rx='3' fill='%23f0f0f0'/%3E%3Crect x='30' y='95' width='240' height='6' rx='3' fill='%23f0f0f0'/%3E%3Crect x='30' y='110' width='200' height='6' rx='3' fill='%23f0f0f0'/%3E%3Crect x='30' y='135' width='60' height='18' rx='9' fill='%230077b5'/%3E%3Ctext x='60' y='145' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='8' fill='white' font-weight='600'%3ELike%3C/text%3E%3C/svg%3E"
  },
  {
    id: "4",
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
    previewImage: "data:image/svg+xml,%3Csvg width='320' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='adGrad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b6b;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ffd93d;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23adGrad)'/%3E%3Crect x='20' y='30' width='80' height='80' rx='10' fill='white' opacity='0.9'/%3E%3Ctext x='160' y='70' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='18' fill='white' font-weight='bold'%3ESpecial Offer%3C/text%3E%3Ctext x='160' y='95' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='14' fill='white'%3E50%25 OFF%3C/text%3E%3Crect x='220' y='120' width='80' height='25' rx='12' fill='white'/%3E%3Ctext x='260' y='133' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='10' fill='%23ff6b6b' font-weight='600'%3EShop Now%3C/text%3E%3C/svg%3E"
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
      <DialogContent className="max-w-lg bg-white" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="sr-only">
          <DialogTitle>Session Timeout</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          {/* Placeholder Image */}
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Are you still there?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your experience will time out in{' '}
            <span className="inline-block bg-gray-800 text-white px-3 py-1 rounded-full font-mono">
              0:{timeLeft.toString().padStart(2, '0')}
            </span>
          </p>
          <Button
            onClick={onExtend}
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-full text-lg"
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
      {/* Header with Logo and Back Button */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-4">
          <img src="/Google_logo.svg" alt="Google" className="h-10" />
        </div>
      </div>


      {/* Static Centered Grid Layout */}
      <div className="min-h-screen flex flex-col">
        {/* Title Section - Matching Preview Page Style */}
        <div className="text-center pt-24 pb-16">
          <h1 className="text-5xl font-normal text-gray-900 mb-4" style={{ fontWeight: '500' }}>
            Canvas
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{ fontWeight: '400' }}>
            Review and customize your AI-generated marketing assets. Click on any asset to see the full preview and edit content.
          </p>
        </div>

        {/* Main Content Area - Single Line Layout */}
        <div className="flex-1 flex items-center justify-center px-8 pb-20">
          <div className="w-full max-w-none">
            <div className="grid grid-cols-4 gap-10 max-w-8xl mx-auto">
              {project.assets.map((card) => (
                <Card 
                  key={card.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-xl shadow-md hover:ring-1 hover:ring-gray-300 w-full"
                  onClick={() => handleAssetClick(card)}
                  data-testid={`card-asset-${card.id}`}
                >
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
                        {card.type === 'video' ? 'Video' : 
                         card.type === 'landing' ? 'Landing' : 
                         card.type === 'linkedin' ? 'LinkedIn' : 
                         card.type === 'banner' ? 'Banner' : 'Description'}
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
                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
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
                className="w-16 h-16 p-0 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 active:scale-95 transition-all"
                data-testid="button-add-new"
              >
                <Plus className="w-8 h-8 text-gray-600" />
              </Button>
              
              <Button
                size="lg"
                onClick={handleShareClick}
                className="w-16 h-16 p-0 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 active:scale-95 transition-all"
                data-testid="button-share"
              >
                <Share className="w-8 h-8 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Page Preview */}
      {showFullPagePreview && selectedAsset && (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden">
          {/* Google Logo - Top Left */}
          <div className="absolute top-8 left-8 z-10">
            <img src="/Google_logo.svg" alt="Google" className="h-8" />
          </div>

          {/* Navigation Header - Top Right */}
          <div className="absolute top-8 right-8 z-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFullPagePreview(false)}
              className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50"
              data-testid="button-close-preview"
            >
              ← Back to Canvas
            </Button>
          </div>

          {/* Main Title - Centered at Top */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 text-center">
            <h1 className="text-5xl font-normal text-gray-900 mb-2" style={{ fontWeight: '500' }}>
              {selectedAsset.type === 'video' ? 'TikTok' : 
               selectedAsset.type === 'landing' ? 'Landing Page' : 
               selectedAsset.type === 'linkedin' ? 'LinkedIn' : 
               selectedAsset.type === 'banner' ? 'Ad Banner' : selectedAsset.title}
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

          {/* Share Button - Bottom Center */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
            <Button 
              variant="outline" 
              className="px-8 py-3 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50"
            >
              Share
            </Button>
          </div>

          {/* Preview Content with Transition */}
          <div className={`w-full h-full flex items-center justify-center pt-40 pb-24 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {selectedAsset.type === 'landing' && (
              <div className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Landing Page Hero Simulation */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-16 text-center">
                  <h1 className="text-6xl font-bold mb-8 leading-tight">
                    Transform Your Business
                  </h1>
                  <p className="text-2xl mb-12 opacity-90 max-w-4xl mx-auto">
                    {editContent || "Discover how our AI-powered platform can revolutionize your marketing strategies and drive unprecedented growth."}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-xl font-semibold"
                  >
                    Get Started Now
                  </Button>
                </div>
                <div className="h-24 bg-gray-50"></div>
              </div>
            )}

            {selectedAsset.type === 'linkedin' && (
              <div className="w-full max-w-2xl mx-auto">
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
                    <div className="bg-gray-100 rounded-xl p-6 mb-6">
                      <div className="text-center text-gray-500">
                        📊 Campaign Performance Dashboard
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
              <div className="w-full max-w-lg mx-auto">
                {/* Vertical Video Player Simulation */}
                <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600 to-pink-600 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 mx-auto">
                        <div className="w-0 h-0 border-l-[24px] border-l-white border-y-[12px] border-y-transparent ml-2"></div>
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Vertical Video</h2>
                      <p className="text-lg opacity-90 mb-8 leading-relaxed">
                        {editContent || "Transform your content strategy with AI-powered video creation"}
                      </p>
                      <div className="text-sm opacity-75">
                        Perfect for TikTok, Instagram Reels & YouTube Shorts
                      </div>
                    </div>
                  </div>
                  {/* Video Controls */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-4">
                        <button>❤️ 12.5K</button>
                        <button>💬 234</button>
                        <button>🔄 89</button>
                        <button>📤</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedAsset.type === 'banner' && (
              <div className="w-full max-w-5xl mx-auto">
                {/* Ad Banner Simulation */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="flex items-center h-64">
                    <div className="flex-1 p-12">
                      <h2 className="text-4xl font-bold mb-4">
                        Special Limited Offer!
                      </h2>
                      <p className="text-xl mb-6 opacity-90">
                        {editContent || "Get 50% off your first month - Transform your marketing with AI-powered campaigns"}
                      </p>
                      <Button 
                        size="lg" 
                        className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold"
                      >
                        Claim Offer Now →
                      </Button>
                    </div>
                    <div className="w-64 h-full bg-white/10 flex items-center justify-center">
                      <div className="text-center opacity-75">
                        <div className="text-6xl mb-4">🎯</div>
                        <div className="text-lg">Marketing AI</div>
                      </div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit {selectedAsset?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            {selectedAsset && (
              <>
                {/* Asset Preview */}
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <img 
                    src={selectedAsset.previewImage} 
                    alt={selectedAsset.title}
                    className="w-full max-w-md mx-auto h-64 object-cover rounded-lg"
                  />
                </div>
                
                {/* Content Editor */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Content</h3>
                  <div className="relative">
                    <Textarea
                      value={editContent}
                      onChange={(e) => {
                        setEditContent(e.target.value);
                        setCursorPosition(e.target.selectionStart || 0);
                      }}
                      onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart || 0)}
                      placeholder="Edit your content here..."
                      className="min-h-32 text-lg"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Canvas</DialogTitle>
          </DialogHeader>
          <div className="mt-6 text-center space-y-4">
            <p className="text-gray-600">
              Scan this QR code to access the canvas on your device
            </p>
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode 
                value={window.location.href} 
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-sm text-gray-500">
              Anyone with this link can view the canvas
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Asset Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Add New Asset</DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            <p className="text-gray-600 mb-8">Choose the type of marketing asset you'd like to create:</p>
            <div className="grid grid-cols-2 gap-6">
              {CARD_TEMPLATES.map((template) => (
                <div
                  key={template.type}
                  className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-[#4285F4] transition-all duration-200"
                  onClick={() => handleAddNewCard(template.type)}
                  data-testid={`template-${template.type}`}
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">{template.label}</h3>
                    <p className="text-gray-600">{template.description}</p>
                    <Button
                      className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white"
                      size="lg"
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