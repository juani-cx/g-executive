import { useState, useMemo, useEffect, useCallback, useRef, startTransition } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { PageTitle } from "@/components/PageTitle";

// Type for card data
interface CardData {
  title: string;
  description: string;
  icon: string;
}

// Stable image data - moved outside component to prevent re-creation
const IMAGE_DATA: Record<string, Array<{ id: number; src: string; alt: string }>> = {
  digital: [
    { id: 1, src: '/img-refs/digital/digital1.jpg', alt: 'Digital 1' },
    { id: 2, src: '/img-refs/digital/digital2.jpg', alt: 'Digital 2' },
    { id: 3, src: '/img-refs/digital/digital3.jpg', alt: 'Digital 3' },
    { id: 4, src: '/img-refs/digital/digital4.jpg', alt: 'Digital 4' },
  ],
  physical: [
    { id: 1, src: '/img-refs/physical/physical01.jpg', alt: 'Physical 1' },
    { id: 2, src: '/img-refs/physical/physical02.jpg', alt: 'Physical 2' },
    { id: 3, src: '/img-refs/physical/physical03.jpg', alt: 'Physical 3' },
    { id: 4, src: '/img-refs/physical/physical04.jpg', alt: 'Physical 4' },
  ],
  service: [
    { id: 1, src: '/img-refs/service/service01.jpg', alt: 'Service 1' },
    { id: 2, src: '/img-refs/service/service02.jpg', alt: 'Service 2' },
    { id: 3, src: '/img-refs/service/service03.jpg', alt: 'Service 3' },
    { id: 4, src: '/img-refs/service/service04.jpg', alt: 'Service 4' },
  ]
};

// Advanced image preloader with decode awareness
const useImagePreloader = () => {
  const [readyCategories, setReadyCategories] = useState<Set<string>>(new Set());
  const cacheRef = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());
  
  const preloadAndDecodeImages = useCallback(async (category: string) => {
    if (readyCategories.has(category)) return;
    
    const images = IMAGE_DATA[category] || [];
    const decodePromises = images.map(({ src }) => {
      if (!cacheRef.current.has(src)) {
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = async () => {
            try {
              // Use decode() for proper paint timing
              await img.decode();
              resolve(img);
            } catch (e) {
              // Fallback for older browsers
              resolve(img);
            }
          };
          img.onerror = reject;
          img.src = src;
        });
        cacheRef.current.set(src, promise);
      }
      return cacheRef.current.get(src)!;
    });
    
    try {
      await Promise.all(decodePromises);
      setReadyCategories(prev => new Set([...Array.from(prev), category]));
    } catch (error) {
      console.warn(`Failed to preload images for category: ${category}`, error);
    }
  }, [readyCategories]);
  
  const isCategoryReady = useCallback((category: string) => {
    return readyCategories.has(category);
  }, [readyCategories]);
  
  return { preloadAndDecodeImages, isCategoryReady };
};

export default function UploadCampaign() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai' | 'predefined'>('computer');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use the advanced image preloader
  const { preloadAndDecodeImages, isCategoryReady } = useImagePreloader();

  // Preload all categories on mount
  useEffect(() => {
    Object.keys(IMAGE_DATA).forEach(category => {
      preloadAndDecodeImages(category);
    });
  }, [preloadAndDecodeImages]);

  // Function to get images based on selected category - now uses stable data
  const getMoodImages = (category: string) => {
    return IMAGE_DATA[category] || IMAGE_DATA.digital;
  };
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Campaign workflow - fixed to campaign
  const workflowType = 'campaign';
  const [selectedCampaignCategory, setSelectedCampaignCategory] = useState<'digital' | 'physical' | 'service'>('physical');
  const [previousCategory, setPreviousCategory] = useState<'digital' | 'physical' | 'service'>('physical');
  
  const selectedCategory = selectedCampaignCategory;
  
  // Smart category switching with decode awareness
  const handleCategorySwitch = useCallback(async (newCategory: 'digital' | 'physical' | 'service') => {
    if (newCategory === selectedCampaignCategory || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Ensure images are decoded before switching
    if (!isCategoryReady(newCategory)) {
      await preloadAndDecodeImages(newCategory);
    }
    
    startTransition(() => {
      setPreviousCategory(selectedCampaignCategory);
      setSelectedCampaignCategory(newCategory);
      setIsTransitioning(false);
    });
  }, [selectedCampaignCategory, isTransitioning, isCategoryReady, preloadAndDecodeImages]);
  
  // Get mood images for the currently selected category (reactive) - now uses stable reference
  const moodImages = useMemo(() => IMAGE_DATA[selectedCategory] || IMAGE_DATA.digital, [selectedCategory]);
  const previousMoodImages = useMemo(() => IMAGE_DATA[previousCategory] || IMAGE_DATA.digital, [previousCategory]);
  
  // Show current images if ready, otherwise show previous to prevent flash
  const displayImages = isCategoryReady(selectedCategory) ? moodImages : previousMoodImages;
  const showCurrentImages = isCategoryReady(selectedCategory);
  const showPreviousImages = !showCurrentImages && isTransitioning;

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
        <div className="w-full text-center flex flex-col items-center">
          {/* Header */}
          <PageTitle
            title="Select an image"
            subtitle="Choose the mood of your campaign for AI inspiration"
            className="flex flex-col justify-center items-center gap-4 w-full max-w-7xl mb-8"
          />

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
                  onClick={() => handleCategorySwitch(category.id as 'digital' | 'physical' | 'service')}
                  disabled={isTransitioning}
                  data-testid={`tab-${category.id}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Content Area - Fade transitions with image preloading */}
          <div className="relative w-full flex justify-center" style={{ height: '620px', marginTop: '-70px' }}>
            
            {/* QR Tab Content */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${activeTab === 'computer' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="bg-gray-100 border-white border-8 rounded-2xl flex justify-center items-center shadow-xl" style={{ width: '460px', height: '474px', padding: '24px' }}>
                <div className="w-full h-full bg-gray-300 rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/QR_code.svg)' }} />
              </div>
              <span className="text-gray-700 text-center text-xl font-medium mt-10 block w-56">
                Scan this QR code to upload your image
              </span>
            </div>

            {/* Camera Tab Content */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${activeTab === 'ai' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
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
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${activeTab === 'predefined' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="relative mb-8">
                {/* Loading indicator when transitioning */}
                {isTransitioning && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-sm font-medium">Loading images...</span>
                    </div>
                  </div>
                )}
                
                {/* Current category images */}
                <div className={`grid grid-cols-4 gap-6 transition-opacity duration-300 ${
                  showCurrentImages ? 'opacity-100' : 'opacity-50'
                }`}>
                  {displayImages.map((image) => (
                    <div
                      key={`${selectedCategory}-${image.id}`}
                      className={`h-72 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                        selectedImage === image.src
                          ? 'ring-4 ring-blue-500 shadow-2xl transform scale-105'
                          : 'hover:scale-102 hover:shadow-lg'
                      } ${
                        isTransitioning ? 'pointer-events-none' : ''
                      }`}
                      onClick={() => !isTransitioning && handleImageSelect(image.id, image.src)}
                      data-testid={`image-${selectedCategory}-${image.id}`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        loading="eager"
                        decoding="async"
                        style={{ imageRendering: 'auto' }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Hidden preloader containers for all categories to force cache */}
                <div className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none">
                  {Object.entries(IMAGE_DATA).map(([category, images]) => (
                    <div key={category}>
                      {images.map((image) => (
                        <img
                          key={image.src}
                          src={image.src}
                          alt={image.alt}
                          width="1"
                          height="1"
                          loading="eager"
                          decoding="async"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <Button
                  size="lg"
                  onClick={handlePredefinedContinue}
                  disabled={!selectedImage}
                  className={`px-8 py-3 rounded-full text-base font-medium shadow-lg transition-colors ${
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

            {/* Hidden preload container for images */}
            <div className="absolute top-0 left-0 opacity-0 pointer-events-none" style={{ zIndex: -1 }}>
              {moodImages.map((image) => (
                <img
                  key={`preload-${image.id}`}
                  src={image.src}
                  alt=""
                  loading="eager"
                  decoding="async"
                  style={{ width: '1px', height: '1px' }}
                />
              ))}
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
              <Upload className="w-12 h-12" style={{ width: '36px', height: '36px' }} />
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
              <Camera className="w-12 h-12" style={{ width: '36px', height: '36px' }} />
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
              <XCircle className="w-12 h-12" style={{ width: '36px', height: '36px' }} />
              I don't want to use my photos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}