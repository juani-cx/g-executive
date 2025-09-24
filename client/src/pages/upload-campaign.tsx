import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";

// Type for card data
interface CardData {
  title: string;
  description: string;
  icon: string;
}

// Stable image data - moved outside component to prevent re-creation
const IMAGE_DATA: Record<string, Array<{ id: number; src: string; alt: string }>> = {
  digital: [
    { id: 1, src: '/img-refs/digital/digital1.png', alt: 'Digital 1' },
    { id: 2, src: '/img-refs/digital/digital2.png', alt: 'Digital 2' },
    { id: 3, src: '/img-refs/digital/digital3.png', alt: 'Digital 3' },
    { id: 4, src: '/img-refs/digital/digital4.png', alt: 'Digital 4' },
  ],
  physical: [
    { id: 1, src: '/img-refs/physical/physical_1.png', alt: 'Physical 1' },
    { id: 2, src: '/img-refs/physical/physical_2.png', alt: 'Physical 2' },
    { id: 3, src: '/img-refs/physical/physical_3.png', alt: 'Physical 3' },
    { id: 4, src: '/img-refs/physical/physical_4.png', alt: 'Physical 4' },
  ],
  service: [
    { id: 1, src: '/img-refs/service/service1.png', alt: 'Service 1' },
    { id: 2, src: '/img-refs/service/service2.png', alt: 'Service 2' },
    { id: 3, src: '/img-refs/service/service3.png', alt: 'Service 3' },
    { id: 4, src: '/img-refs/service/service4.png', alt: 'Service 4' },
  ]
};

// Preload images for instant switching with proper caching
const preloadImages = () => {
  Object.values(IMAGE_DATA).flat().forEach(({ src }) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
};

export default function UploadCampaign() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai' | 'predefined'>('computer');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Preload all images on component mount for instant tab switching
  useEffect(() => {
    preloadImages();
  }, []);

  // Function to get images based on selected category - now uses stable data
  const getMoodImages = (category: string) => {
    return IMAGE_DATA[category] || IMAGE_DATA.digital;
  };
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Campaign workflow - fixed to campaign
  const workflowType = 'campaign';
  const [selectedCampaignCategory, setSelectedCampaignCategory] = useState<'digital' | 'physical' | 'service'>('physical');
  
  const selectedCategory = selectedCampaignCategory;
  
  // Get mood images for the currently selected category (reactive) - now uses stable reference
  const moodImages = useMemo(() => IMAGE_DATA[selectedCategory] || IMAGE_DATA.digital, [selectedCategory]);

  // Function to compress image before storing
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800x600 to keep under localStorage limit)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        localStorage.setItem('uploadedImage', compressedImage);
        localStorage.setItem('selectedCategory', selectedCategory);
        localStorage.setItem('workflowType', workflowType);
        navigate('/configure');
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleContinue = async () => {
    if (selectedCard !== null) {
      // Store card selection for configuration page
      localStorage.setItem('selectedCardIndex', selectedCard.toString());
      localStorage.setItem('selectedCategory', selectedCategory);
      localStorage.setItem('workflowType', workflowType);
      navigate('/configure');
    }
  };

  const handleImageSelect = (imageId: number, imageSrc: string) => {
    setSelectedImage(imageSrc);
    setSelectedCard(imageId);
  };

  const handlePredefinedContinue = () => {
    if (selectedImage) {
      localStorage.setItem('uploadedImage', selectedImage);
      localStorage.setItem('selectedCategory', selectedCategory);
      localStorage.setItem('workflowType', workflowType);
      navigate('/configure');
    }
  };

  const handleAIGenerate = async () => {
    if (aiPrompt.trim()) {
      setIsGenerating(true);
      try {
        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        localStorage.setItem('aiPrompt', aiPrompt);
        localStorage.setItem('selectedCategory', selectedCategory);
        localStorage.setItem('workflowType', workflowType);
        navigate('/configure');
      } catch (error) {
        console.error('Error generating AI image:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Campaign categories
  const campaignCategories = [
    { id: 'physical', label: 'Physical', icon: '📦' },
    { id: 'digital', label: 'Digital', icon: '💻' },
    { id: 'service', label: 'Service', icon: '🛠️' }
  ];

  // Sample card data for campaign workflow
  const getCardsForCategory = (category: string): CardData[] => {
    const baseCards: Record<string, CardData[]> = {
      digital: [
        { title: "Software Launch", description: "Tech product announcement", icon: "💻" },
        { title: "App Promotion", description: "Mobile app marketing", icon: "📱" },
        { title: "Digital Service", description: "Online platform promotion", icon: "🌐" },
        { title: "E-commerce", description: "Online store campaign", icon: "🛒" }
      ],
      physical: [
        { title: "Product Launch", description: "Physical product reveal", icon: "📦" },
        { title: "Retail Campaign", description: "Store promotion", icon: "🏪" },
        { title: "Fashion Line", description: "Clothing brand campaign", icon: "👕" },
        { title: "Electronics", description: "Tech gadget promotion", icon: "🔌" }
      ],
      service: [
        { title: "Consulting", description: "Professional services", icon: "💼" },
        { title: "Healthcare", description: "Medical services", icon: "🏥" },
        { title: "Education", description: "Learning platform", icon: "🎓" },
        { title: "Financial", description: "Banking services", icon: "🏦" }
      ]
    };
    return baseCards[category] || baseCards.digital;
  };

  const currentCards = getCardsForCategory(selectedCategory);

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % Math.ceil(currentCards.length / 4));
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + Math.ceil(currentCards.length / 4)) % Math.ceil(currentCards.length / 4));
  };

  const startIndex = currentCardIndex * 4;
  const visibleCards = currentCards.slice(startIndex, startIndex + 4);

  return (
    <div className="dotted-background" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh'
    }}>
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content */}
      <div style={{
        width: '100%',
        minHeight: 'calc(100vh - 120px)',
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
              Select an image
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
              Choose the mood of your campaign for AI inspiration
            </p>
          </div>

          {/* Category Tabs - Always reserve consistent space */}
          <div className="flex justify-center mb-8 h-16">
            <div className={`flex items-center bg-white rounded-full shadow-lg px-2 py-1 relative z-20 ${activeTab === 'predefined' ? 'block' : 'hidden'}`}>
              {campaignCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className={`rounded-full text-sm font-medium transition-colors px-6 py-1 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setSelectedCampaignCategory(category.id as any)}
                  data-testid={`tab-${category.id}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Content Area - All tabs pre-rendered, shown/hidden via CSS */}
          <div className="flex flex-col items-center justify-center relative" style={{ height: '620px', marginTop: '-70px' }}>
            
            {/* QR Tab Content */}
            <div className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'computer' ? 'block' : 'hidden'}`}>
              <div className="bg-gray-100 border-white border-8 rounded-2xl flex justify-center items-center shadow-xl" style={{ width: '460px', height: '474px', padding: '24px' }}>
                <div className="w-full h-full bg-gray-300 rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/QR_code.svg)' }} />
              </div>
              <span className="text-blue-900 text-center text-xl font-medium mt-10 block w-56">
                Scan this QR code to upload your image
              </span>
            </div>

            {/* Camera Tab Content */}
            <div className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'ai' ? 'block' : 'hidden'}`}>
              <div className="bg-white rounded-3xl p-12 shadow-lg">
                <div className="mb-6">
                  <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Take a photo</h3>
                  <p className="text-gray-600 mb-6">Camera functionality coming soon</p>
                </div>
                
                <Button
                  size="lg"
                  disabled={true}
                  className="bg-gray-400 text-white px-8 py-3 rounded-full text-lg font-semibold cursor-not-allowed"
                  data-testid="button-camera-disabled"
                >
                  Camera not available
                </Button>
              </div>
            </div>

            {/* Predefined Images Tab Content */}
            <div className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'predefined' ? 'block' : 'hidden'}`}>
              <div className="relative my-15">
                <div className="grid grid-cols-4 gap-6">
                  {moodImages.map((image) => (
                    <div
                      key={image.id}
                      className={`h-72 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
                        selectedImage === image.src
                          ? 'ring-4 ring-blue-500 shadow-2xl transform scale-105'
                          : ''
                      }`}
                      onClick={() => handleImageSelect(image.id, image.src)}
                      data-testid={`image-${image.id}`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handlePredefinedContinue}
                  disabled={!selectedImage}
                  className={`px-8 py-3 rounded-full text-base font-medium shadow-lg transition-all ${
                    selectedImage 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  data-testid="button-continue-predefined"
                >
                  Continue with this selection
                </Button>
              </div>
            </div>

          </div>
          
          {/* Bottom Action Tabs - Fixed to bottom */}
          <div className="relative flex justify-center items-center gap-6 pb-5 mt-5">
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-2 px-6 py-4 text-lg font-medium transition-colors w-48 ${
                activeTab === 'computer'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('computer')}
              data-testid="tab-upload"
            >
              <Upload className="w-7 h-7" />
              Upload your images
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-2 px-6 py-4 text-lg font-medium transition-colors w-48 ${
                activeTab === 'ai'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('ai')}
              data-testid="tab-ai"
            >
              <Camera className="w-7 h-7" />
              Take a photo
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-2 px-6 py-4 text-lg font-medium transition-colors w-48 ${
                activeTab === 'predefined'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('predefined')}
              data-testid="tab-preselected"
            >
              <XCircle className="w-7 h-7" />
              I don't want to use my photos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}