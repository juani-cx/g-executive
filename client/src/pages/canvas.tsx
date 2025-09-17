import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

const DEFAULT_CARDS: AssetCard[] = [
  {
    id: "1",
    type: "video",
    title: "Vertical Video",
    summary: "Engaging vertical video content with meta description for social media platforms",
    status: "ready",
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
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="text-center py-8 bg-black bg-opacity-80">
          <h2 className="text-2xl font-medium text-white mb-4">Are you still there?</h2>
          <p className="text-lg text-gray-300 mb-6">
            Your experience will time out in{' '}
            <span className="inline-block bg-white text-black px-3 py-1 rounded-full font-mono">
              0:{timeLeft.toString().padStart(2, '0')}
            </span>
          </p>
          <Button
            onClick={onExtend}
            className="bg-white text-black border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-full text-lg"
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
    setSelectedAsset(asset);
    setEditContent(asset.content?.text || "");
    setShowAssetModal(true);
    setShowVirtualKeyboard(true);
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

      <div className="absolute top-8 right-8 z-10">
        <Button 
          variant="outline" 
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={() => setLocation('/')}
          data-testid="button-back-to-home"
        >
          Back to home
        </Button>
      </div>

      {/* Static Centered Grid Layout */}
      <div className="min-h-screen flex flex-col">
        {/* Main Content Area - Centered Grid */}
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-4 gap-8">
              {project.assets.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                  onClick={() => handleAssetClick(card)}
                  data-testid={`card-asset-${card.id}`}
                >
                  {/* Preview Image */}
                  <div className="w-full h-40 mb-4 bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                      src={card.previewImage} 
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 capitalize">{card.type}</div>
                    <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.summary}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      data-testid={`button-learn-more-${card.id}`}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Toolbar - Add and Share buttons */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                className="w-12 h-12 p-0 rounded-xl bg-white hover:bg-gray-50 border border-gray-200"
                data-testid="button-add-new"
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </Button>
              
              <Button
                size="sm"
                onClick={handleShareClick}
                className="w-12 h-12 p-0 rounded-xl bg-white hover:bg-gray-50 border border-gray-200"
                data-testid="button-share"
              >
                <Share className="w-6 h-6 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

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
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your content here..."
                    className="min-h-32"
                    data-testid="textarea-content-edit"
                  />
                </div>

                {/* Virtual Keyboard Space */}
                {showVirtualKeyboard && (
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="text-center text-gray-500 text-sm">
                      Virtual keyboard interface would appear here for touchscreen editing
                    </div>
                  </div>
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