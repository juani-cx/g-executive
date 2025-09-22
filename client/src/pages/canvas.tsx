import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TopNavigation from "@/components/TopNavigation";
import { useLocation } from "wouter";

// Virtual Keyboard Component
function VirtualKeyboard({ isVisible }: { isVisible: boolean }) {
  const keyboardKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
    ['↑', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '⌫'],
    ['123?', '◀', '▶', '⎵', '-', '_', '🔍']
  ];

  return (
    <div className={`virtual-keyboard fixed left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out z-[100] ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`} style={{ bottom: '2rem' }}>
      <div className="p-6" style={{ width: '900px' }}>
        <div className="space-y-3">
          {keyboardKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3">
              {row.map((key, keyIndex) => (
                <div
                  key={keyIndex}
                  className={`
                    bg-white rounded-lg flex items-center justify-center text-gray-700 font-medium cursor-pointer transition-colors border border-gray-200
                    ${key === '⎵' ? 'px-20 py-4' : key === '123?' || key === '🔍' ? 'px-6 py-4' : 'w-14 h-14'}
                    ${key === '↑' || key === '⌫' ? 'text-xl' : 'text-lg'}
                  `}
                  data-testid={`key-${key}`}
                >
                  {key}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Asset Card Component
interface AssetCard {
  id: string;
  type: string;
  title: string;
  description: string;
  cta?: string;
  image?: string;
  isVideo?: boolean;
}

function AssetCardComponent({ card, onClick }: { card: AssetCard; onClick: () => void }) {
  return (
    <div 
      className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 cursor-pointer transition-all duration-200 relative group"
      onClick={onClick}
      data-testid={`card-${card.type.toLowerCase().replace(' ', '-')}`}
    >
      {/* Edit Button - Removed hover state for touchscreen */}

      <div className="p-6">
        {/* Image or Video */}
        <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
          {card.image ? (
            card.isVideo ? (
              <video 
                src={card.image}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                data-testid={`video-${card.type.toLowerCase().replace(' ', '-')}`}
              />
            ) : (
              <img 
                src={card.image}
                alt={`${card.type} preview`}
                className="w-full h-full object-cover"
                data-testid={`img-${card.type.toLowerCase().replace(' ', '-')}`}
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-4xl">🎨</div>
            </div>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-xl text-gray-800 mb-3 text-left" style={{ fontWeight: '500' }}>
          {card.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 text-left line-clamp-2" style={{ fontWeight: '400' }}>
          {card.description}
        </p>
      </div>
    </div>
  );
}

// Edit Modal Component
function EditModal({ 
  isOpen, 
  onClose, 
  card, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  card: AssetCard | null; 
  onSave: (updatedCard: AssetCard) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cta, setCta] = useState("");

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setCta(card.cta || "");
    }
  }, [card]);

  const handleSave = () => {
    if (card) {
      onSave({
        ...card,
        title,
        description,
        cta
      });
      onClose();
    }
  };

  const handleRandomize = () => {
    // Randomize the content
    const randomTitles = [
      "Campaign Launch 50% OFF",
      "Professional Campaign Platform",
      "Discover Our Solutions",
      "Transform Your Business"
    ];
    const randomDescriptions = [
      "Eye-catching advertising banner with meta description for great conversions.",
      "High-converting campaign content designed for maximum engagement.",
      "Professional marketing content with compelling call-to-action.",
      "Engaging content optimized for your target audience."
    ];
    const randomCTAs = [
      "Discover",
      "Learn More", 
      "Get Started",
      "Shop Now"
    ];

    setTitle(randomTitles[Math.floor(Math.random() * randomTitles.length)]);
    setDescription(randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)]);
    setCta(randomCTAs[Math.floor(Math.random() * randomCTAs.length)]);
  };

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[350px] p-0 overflow-hidden" style={{ position: 'fixed', top: '15%', transform: 'translateX(-50%)', left: '50%' }}>
        <div className="flex h-full">
          {/* Left Side - Image Preview */}
          <div className="w-1/2 bg-gray-50 flex flex-col">
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                {card.image ? (
                  card.isVideo ? (
                    <video 
                      src={card.image}
                      className="w-full h-full object-cover max-w-[300px] max-h-[200px]"
                      autoPlay
                      muted
                      loop
                      playsInline
                      data-testid="video-modal-preview"
                    />
                  ) : (
                    <img 
                      src={card.image}
                      alt={card.type}
                      className="w-full h-full object-cover max-w-[300px] max-h-[200px]"
                      data-testid="img-modal-preview"
                    />
                  )
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-xl">
                    <div className="text-4xl">🎨</div>
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-center">
                <h4 className="text-base font-semibold text-gray-800 mb-1">{card.type} Title</h4>
                <p className="text-sm text-gray-600 mb-1">{title || card.title}</p>
                <p className="text-xs text-gray-500 mb-2">{description || card.description}</p>
                {(cta || card.cta) && (
                  <Button 
                    size="sm" 
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white"
                    data-testid="button-preview-cta"
                  >
                    {cta || card.cta}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Edit Form */}
          <div className="w-1/2 p-4 flex flex-col">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-lg font-semibold">{card.type}</DialogTitle>
              <p className="text-sm text-gray-600">AI content generated for your campaign</p>
            </DialogHeader>

            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  data-testid="input-title"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 resize-none"
                  data-testid="textarea-description"
                />
              </div>

              <div>
                <Label htmlFor="cta" className="text-sm font-medium text-gray-700">
                  CTA
                </Label>
                <Input
                  id="cta"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="mt-1"
                  data-testid="input-cta"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-gray-600 border-gray-300 text-sm py-2"
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleRandomize}
                className="text-gray-600 border-gray-300 text-sm py-2"
                data-testid="button-randomize"
              >
                Randomize
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#4285F4] hover:bg-[#3367D6] text-white flex-1 text-sm py-2"
                data-testid="button-export-assets"
              >
                Export assets
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Canvas() {
  const [, navigate] = useLocation();
  const [selectedCard, setSelectedCard] = useState<AssetCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  // Initialize cards with content from reference images
  const [cards, setCards] = useState<AssetCard[]>([
    {
      id: "1",
      type: "Landing Page",
      title: "Landing Page",
      description: "High-converting landing page hero section with meta description",
      cta: "Discover",
      image: "/landing-page.png"
    },
    {
      id: "2", 
      type: "Ad Banner",
      title: "Ad Banner",
      description: "Eye-catching advertising banner with meta description",
      cta: "Campaign Launch 50% OFF",
      image: "/ad-banner.png"
    },
    {
      id: "3",
      type: "Social Post", 
      title: "Social Post",
      description: "Professional social media post with meta description",
      cta: "Learn More",
      image: "/instagram-post.png"
    },
    {
      id: "4",
      type: "Vertical Video",
      title: "Vertical Video", 
      description: "Engaging vertical video content with meta description",
      cta: "Learn More",
      image: "/mood-video.mp4",
      isVideo: true
    }
  ]);

  const handleCardClick = (card: AssetCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
    // Show keyboard after modal opens
    setTimeout(() => setShowKeyboard(true), 300);
  };

  const handleSaveCard = (updatedCard: AssetCard) => {
    setCards(cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const handleExportAll = () => {
    // Export functionality
    console.log("Exporting all assets...");
  };

  return (
    <div className="dotted-background overflow-hidden" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh'
    }}>
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 56px',
        boxSizing: 'border-box',
        paddingTop: '0'
      }}>
        <div style={{
          width: '100%',
          textAlign: 'center'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '1808px',
            padding: '0',
            marginBottom: '32px'
          }}>
            <h1 style={{
              color: '#000',
              textAlign: 'center',
              fontFamily: 'Google Sans',
              fontSize: '48px',
              fontWeight: '500',
              lineHeight: '36px',
              margin: 0
            }} data-testid="text-main-title">
              Canvas
            </h1>
            <p style={{
              color: '#5c5c5c',
              textAlign: 'center',
              fontFamily: 'Google Sans',
              fontSize: '24px',
              fontWeight: '400',
              lineHeight: '28px',
              margin: 0
            }}>
              Review, edit and download your assets
            </p>
          </div>

          {/* Export Button */}
          <div className="mb-8">
            <Button
              onClick={handleExportAll}
              className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2 rounded-full"
              data-testid="button-export-all"
            >
              Export assets
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {cards.map((card) => (
                <AssetCardComponent
                  key={card.id}
                  card={card}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowKeyboard(false);
        }}
        card={selectedCard}
        onSave={handleSaveCard}
      />
      
      {/* Virtual Keyboard */}
      <VirtualKeyboard isVisible={showKeyboard} />
    </div>
  );
}