import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/ui/form-input";
import { FormLabel } from "@/components/ui/form-label";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TopNavigation from "@/components/TopNavigation";
import { useLocation } from "wouter";
import { ZoomIn, Wand2 } from "lucide-react";
import { ExportQRModal } from "@/components/ExportQRModal";
import { AppShell, PageHeader, PageBody } from "@/components/layout";
import { PageShell } from "@/components/PageShell";
import { PageTitle } from "@/components/PageTitle";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { InternalButton } from "@/components/ui/internal-button";

// Asset Card Component
interface AssetCard {
  id: string;
  type: string;
  onScreenText: string;
  audio: string;
  caption: string;
  hashtags: string;
  image?: string;
  isVideo?: boolean;
}

function AssetCardComponent({ card, onClick }: { card: AssetCard; onClick: () => void }) {
  return (
    <div 
      className="bg-white shadow-lg border border-gray-200 cursor-pointer transition-all duration-200 relative group w-full"
      style={{ borderRadius: '2rem' }}
      onClick={onClick}
      data-testid={`card-${card.type.toLowerCase().replace(' ', '-')}`}
    >
      {/* Edit Button - Removed hover state for touchscreen */}

      <div className="p-8">
        {/* Image or Video */}
        <div className="w-full bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center" style={{ height: 'calc(var(--space-2xl) * 6)' }}>
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
                className="w-full h-full object-cover object-top"
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
        <h3 className="text-3xl text-gray-800 mb-4 text-left" style={{ fontWeight: '500' }}>
          {card.onScreenText}
        </h3>
        
        {/* Description */}
        <p className="text-xl text-gray-600 text-left line-clamp-2" style={{ fontWeight: '400' }}>
          {card.caption}
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
  onSave,
  cards,
  currentIndex,
  onNavigate,
  setShowKeyboard
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  card: AssetCard | null; 
  onSave: (updatedCard: AssetCard) => void;
  cards: AssetCard[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  setShowKeyboard: (show: boolean) => void;
}) {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [field4, setField4] = useState("");

  useEffect(() => {
    if (card) {
      setField1(card.onScreenText);
      setField2(card.audio);
      setField3(card.caption);
      setField4(card.hashtags);
    }
  }, [card]);

  // Get field configuration based on asset type
  const getFieldConfig = (type: string) => {
    switch (type) {
      case 'Landing Page':
        return {
          field1: { label: 'Title', placeholder: 'Enter page title...' },
          field2: { label: 'Description', placeholder: 'Enter page description...' },
          field3: { label: 'CTA', placeholder: 'Enter call-to-action...' },
          field4: { label: 'Meta tags', placeholder: 'Enter meta tags...' }
        };
      case 'Ad Banner':
        return {
          field1: { label: 'Headline', placeholder: 'Enter ad headline...' },
          field2: { label: 'Description', placeholder: 'Enter ad description...' },
          field3: { label: 'CTA', placeholder: 'Enter call-to-action...' },
          field4: { label: 'Keywords', placeholder: 'Enter keywords...' }
        };
      case 'Social Post':
        return {
          field1: { label: 'Caption body', placeholder: 'Enter caption text...' },
          field2: { label: 'Engagement prompt', placeholder: 'Enter engagement prompt...' },
          field3: { label: 'Additional content', placeholder: 'Enter additional content...' },
          field4: { label: 'Tags', placeholder: 'Enter tags...' }
        };
      case 'Vertical Video':
      default:
        return {
          field1: { label: 'On screen text', placeholder: 'Enter on-screen text...' },
          field2: { label: 'Audio', placeholder: 'Describe the audio content...' },
          field3: { label: 'Caption', placeholder: 'Enter caption text...' },
          field4: { label: 'Hashtags', placeholder: '#example #hashtags #here' }
        };
    }
  };

  const fieldConfig = card ? getFieldConfig(card.type) : getFieldConfig('Vertical Video');

  const handleSave = () => {
    if (card) {
      onSave({
        ...card,
        onScreenText: field1,
        audio: field2,
        caption: field3,
        hashtags: field4
      });
      onClose();
    }
  };

  const handleRandomize = () => {
    // Randomize the content based on asset type
    if (!card) return;
    
    switch (card.type) {
      case 'Landing Page':
        const landingTitles = ["Revolutionary Product Launch", "Transform Your Business", "Innovative Solutions", "Premium Experience"];
        const landingDescriptions = ["Discover cutting-edge features that will revolutionize your workflow", "Experience unprecedented quality and performance", "Join thousands of satisfied customers worldwide", "Unlock your potential with our premium platform"];
        const landingCTAs = ["Start Free Trial", "Get Started Today", "Learn More", "Join Now"];
        const landingTags = ["innovation, technology, business", "premium, quality, success", "transformation, growth, results", "efficiency, productivity, solutions"];
        
        setField1(landingTitles[Math.floor(Math.random() * landingTitles.length)]);
        setField2(landingDescriptions[Math.floor(Math.random() * landingDescriptions.length)]);
        setField3(landingCTAs[Math.floor(Math.random() * landingCTAs.length)]);
        setField4(landingTags[Math.floor(Math.random() * landingTags.length)]);
        break;
        
      case 'Ad Banner':
        const adHeadlines = ["50% OFF Everything!", "Limited Time Offer", "New Arrivals", "Exclusive Deal"];
        const adDescriptions = ["Don't miss this incredible savings opportunity", "Premium products at unbeatable prices", "Discover our latest collection", "Special pricing for valued customers"];
        const adCTAs = ["Shop Now", "Save Today", "Explore Collection", "Claim Offer"];
        const adKeywords = ["sale, discount, savings", "premium, quality, value", "new, trending, collection", "exclusive, limited, special"];
        
        setField1(adHeadlines[Math.floor(Math.random() * adHeadlines.length)]);
        setField2(adDescriptions[Math.floor(Math.random() * adDescriptions.length)]);
        setField3(adCTAs[Math.floor(Math.random() * adCTAs.length)]);
        setField4(adKeywords[Math.floor(Math.random() * adKeywords.length)]);
        break;
        
      case 'Social Post':
        const socialCaptions = ["Excited to share our latest innovation with you!", "Behind the scenes of our creative process", "Customer success stories that inspire us daily", "Breaking: Something amazing is coming soon"];
        const socialPrompts = ["What's your experience with this?", "Tag someone who needs to see this!", "Share your thoughts in the comments", "Which option do you prefer?"];
        const socialContent = ["Swipe to see more details →", "Link in bio for full story", "Save this post for later", "Follow for daily updates"];
        const socialTags = ["#innovation #inspiration #community", "#behindthescenes #creative #process", "#customerlove #success #testimonials", "#comingsoon #exciting #announcement"];
        
        setField1(socialCaptions[Math.floor(Math.random() * socialCaptions.length)]);
        setField2(socialPrompts[Math.floor(Math.random() * socialPrompts.length)]);
        setField3(socialContent[Math.floor(Math.random() * socialContent.length)]);
        setField4(socialTags[Math.floor(Math.random() * socialTags.length)]);
        break;
        
      case 'Vertical Video':
      default:
        const videoTexts = ["Campaign Launch 50% OFF", "New Product Alert!", "Limited Time Offer", "Breaking News Update"];
        const videoAudios = ["Upbeat music with voiceover", "Ambient background audio", "Professional narration", "Energetic soundtrack"];
        const videoCaptions = ["Don't miss out on this incredible opportunity to save big!", "Join thousands of satisfied customers who have already discovered the benefits.", "Transform your lifestyle with our premium quality products.", "Experience the difference that quality makes in your daily routine."];
        const videoHashtags = ["#sale #discount #shopping #deals", "#newproduct #innovation #lifestyle #trending", "#limitedtime #exclusive #premium #quality", "#breaking #news #update #important"];
        
        setField1(videoTexts[Math.floor(Math.random() * videoTexts.length)]);
        setField2(videoAudios[Math.floor(Math.random() * videoAudios.length)]);
        setField3(videoCaptions[Math.floor(Math.random() * videoCaptions.length)]);
        setField4(videoHashtags[Math.floor(Math.random() * videoHashtags.length)]);
        break;
    }
  };

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[50vh] p-0 overflow-visible top-[50%] translate-y-[-50%] mx-auto" style={{ width: '1800px', maxWidth: 'none', marginTop: '-100px', zIndex: 10001 }}>
        {/* Navigation Arrows - positioned outside dialog content but within viewport */}
        {cards && currentIndex > 0 && (
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-[-70px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-[60] focus:outline-none focus:ring-0 focus-visible:ring-0"
            data-testid="button-prev-asset"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L1 7L7 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {cards && currentIndex < cards.length - 1 && (
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-[-70px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-[60] focus:outline-none focus:ring-0 focus-visible:ring-0"
            data-testid="button-next-asset"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div className="flex h-full bg-white rounded-lg overflow-hidden">
          {/* Left Side - Image Preview */}
          <div className="w-1/2 bg-gray-50 flex flex-col">
            <div className="p-3 h-full flex flex-col overflow-hidden">
              {card.type === 'Social Post' ? (
                /* Instagram Style Preview for Social Post */
                <div className="bg-white rounded-lg mx-auto w-full h-full flex flex-col instagram-post-preview" style={{ maxWidth: '560px' }}>
                  {/* Instagram Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full p-0.5">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        </div>
                      </div>
                      <span className="font-semibold text-xl">Your Company</span>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer">
                      <circle cx="12" cy="12" r="1" fill="black"/>
                      <circle cx="19" cy="12" r="1" fill="black"/>
                      <circle cx="5" cy="12" r="1" fill="black"/>
                    </svg>
                  </div>

                  {/* Instagram Image */}
                  {card.image ? (
                    <div className="flex-1 bg-white overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      {card.isVideo ? (
                        <video 
                          src={card.image}
                          className="w-full h-full object-cover"
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
                          className="w-full h-full object-cover"
                          data-testid="img-modal-preview"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                      <div className="text-6xl">🎨</div>
                    </div>
                  )}

                  {/* Instagram Interaction Icons */}
                  <div className="p-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer">
                          <path d="M4 12v8a2 2 0 0 0 2 2h8m0-10v8l8-8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Instagram Caption */}
                    <div className="text-left mt-3">
                      <div className="text-xl mb-3">
                        <span className="font-semibold text-black">Your Company</span>
                        <span className="text-gray-800 ml-2">{field1 || card.onScreenText}</span>
                        {field3 && (
                          <span className="text-gray-800 ml-2">{field3}</span>
                        )}
                      </div>
                      
                      {/* Hashtags in blue */}
                      {(field4 || card.hashtags) && (
                        <div className="text-xl">
                          <span className="text-blue-600">{field4 || card.hashtags}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Simple Preview for Other Assets */
                <div className="bg-white rounded-lg shadow-sm p-4 max-w-md mx-auto w-full">
                  {card.image ? (
                    <div className="bg-white overflow-hidden rounded-lg flex-1 mb-4">
                      {card.isVideo ? (
                        <video 
                          src={card.image}
                          className="w-full h-full object-cover"
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
                          className="w-full h-full object-cover object-top"
                          data-testid="img-modal-preview"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-1 mb-4">
                      <div className="text-4xl">🎨</div>
                    </div>
                  )}
                  
                  {/* Simple Content Preview */}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-2 text-2xl">{field1 || card.onScreenText}</h3>
                    {field3 && (
                      <p className="text-gray-600 text-lg mb-2">{field3}</p>
                    )}
                    {(field4 || card.hashtags) && (
                      <p className="text-blue-600 text-lg font-medium">{field4 || card.hashtags}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Edit Form */}
          <div className="w-1/2 p-4 flex flex-col h-full">
            <DialogHeader className="mb-4">
              <DialogTitle style={{ fontSize: '32px', lineHeight: 1, fontWeight: 500, margin: '16px 0 8px' }}>{card.type}</DialogTitle>
            </DialogHeader>

            <div className="flex-1 space-y-4 py-2 min-h-0">
              <div>
                <FormLabel htmlFor="field1">
                  {fieldConfig.field1.label}
                </FormLabel>
                <FormInput
                  id="field1"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder={fieldConfig.field1.placeholder}
                  data-testid="input-field1"
                />
              </div>

              <div>
                <FormLabel htmlFor="field2">
                  {fieldConfig.field2.label}
                </FormLabel>
                <FormInput
                  id="field2"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  placeholder={fieldConfig.field2.placeholder}
                  data-testid="input-field2"
                />
              </div>

              <div>
                <FormLabel htmlFor="field3">
                  {fieldConfig.field3.label}
                </FormLabel>
                <FormTextarea
                  id="field3"
                  value={field3}
                  onChange={(e) => setField3(e.target.value)}
                  rows={2}
                  placeholder={fieldConfig.field3.placeholder}
                  data-testid="textarea-field3"
                />
              </div>

              <div>
                <FormLabel htmlFor="field4">
                  {fieldConfig.field4.label}
                </FormLabel>
                <FormInput
                  id="field4"
                  value={field4}
                  onChange={(e) => setField4(e.target.value)}
                  placeholder={fieldConfig.field4.placeholder}
                  data-testid="input-field4"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 pt-3 border-t flex-shrink-0">
              <InternalButton
                onClick={onClose}
                className="text-gray-600 border-gray-300 border bg-white hover:bg-gray-50"
                data-testid="button-back"
              >
                Back
              </InternalButton>
              <InternalButton
                onClick={handleRandomize}
                className="text-gray-600 border-gray-300 border bg-white hover:bg-gray-50 flex items-center gap-2"
                data-testid="button-randomize"
              >
                <Wand2 className="w-6 h-6" strokeWidth={1.5} />
                Randomize
              </InternalButton>
              <InternalButton
                onClick={handleSave}
                className="bg-[#4285F4] hover:bg-[#3367D6] text-white flex-1"
                data-testid="button-export-assets"
              >
                Export assets
              </InternalButton>
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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  // Initialize cards with content from reference images
  const [cards, setCards] = useState<AssetCard[]>([
    {
      id: "1",
      type: "Landing Page",
      onScreenText: "Landing Page",
      audio: "Professional background music",
      caption: "High-converting landing page hero section with meta description",
      hashtags: "#landingpage, #conversion, #marketing, #business",
      image: "/landing-page.png"
    },
    {
      id: "2", 
      type: "Ad Banner",
      onScreenText: "Ad Banner",
      audio: "Upbeat promotional audio",
      caption: "Eye-catching advertising banner with meta description",
      hashtags: "#advertising, #banner, #promotion, #campaign",
      image: "/ad-banner.png"
    },
    {
      id: "3",
      type: "Social Post", 
      onScreenText: "Social Post",
      audio: "Ambient social media audio",
      caption: "Professional social media post with meta description",
      hashtags: "#socialmedia, #content, #engagement, #brand",
      image: "/social-post-updated.png"
    },
    {
      id: "4",
      type: "Vertical Video",
      onScreenText: "Vertical Video", 
      audio: "Dynamic video soundtrack",
      caption: "Engaging vertical video content with meta description",
      hashtags: "#video, #vertical, #content, #storytelling",
      image: "/mood-video.mp4",
      isVideo: true
    }
  ]);

  const handleCardClick = (card: AssetCard) => {
    const index = cards.findIndex(c => c.id === card.id);
    setCurrentCardIndex(index);
    setSelectedCard(card);
    setIsModalOpen(true);
    // Show keyboard after modal opens
    setTimeout(() => setShowKeyboard(true), 300);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentCardIndex - 1 : currentCardIndex + 1;
    if (newIndex >= 0 && newIndex < cards.length) {
      setCurrentCardIndex(newIndex);
      setSelectedCard(cards[newIndex]);
    }
  };

  const handleSaveCard = (updatedCard: AssetCard) => {
    setCards(cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const handleExportAll = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
      setShowKeyboard(false);
      setTimeout(() => setIsExportModalOpen(true), 200);
    } else {
      setIsExportModalOpen(true);
    }
  };

  return (
    <PageShell 
      title="Export your assets"
      subtitle="Review, edit and download your assets"
      centerContent={false}
      pageBodyClassName="flex flex-col items-start"
      showFooter={false}
    >
        <div style={{
          width: '100%',
          textAlign: 'center'
        }}>
          {/* Export Button */}
          <div className="mb-8">
            <InternalButton
              onClick={handleExportAll}
              data-testid="button-export-all"
            >
              Export assets
            </InternalButton>
          </div>

          {/* Cards Grid */}
          <div className="w-[70vw] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-start">
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

      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowKeyboard(false);
        }}
        card={selectedCard}
        onSave={handleSaveCard}
        cards={cards}
        currentIndex={currentCardIndex}
        onNavigate={handleNavigate}
        setShowKeyboard={setShowKeyboard}
      />
      
      {/* Virtual Keyboard */}
      {showKeyboard && <VirtualKeyboard isVisible={showKeyboard} usePortal={true} bottom="2rem" />}
      
      {/* Export Modal */}
      <ExportQRModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        qrUrl="https://example.com/download-campaign-assets"
        description="Scan to download your campaign assets"
      />
    </PageShell>
  );
}