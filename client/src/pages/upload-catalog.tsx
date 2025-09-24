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
const CATALOG_IMAGE_DATA: Record<string, Array<{ id: number; src: string; alt: string }>> = {
  retail: [
    { id: 1, src: '/img-refs-catalog/retail/retail01.png', alt: 'Retail Product 1' },
    { id: 2, src: '/img-refs-catalog/retail/retail02.png', alt: 'Retail Product 2' },
    { id: 3, src: '/img-refs-catalog/retail/retail03.png', alt: 'Retail Product 3' },
    { id: 4, src: '/img-refs-catalog/retail/retail04.png', alt: 'Retail Product 4' },
  ],
  technology: [
    { id: 1, src: '/img-refs-catalog/tech/tech01.png', alt: 'Technology Product 1' },
    { id: 2, src: '/img-refs-catalog/tech/tech02.png', alt: 'Technology Product 2' },
    { id: 3, src: '/img-refs-catalog/tech/tech03.png', alt: 'Technology Product 3' },
    { id: 4, src: '/img-refs-catalog/tech/tech04.png', alt: 'Technology Product 4' },
  ],
  construction: [
    { id: 1, src: '/img-refs-catalog/construction/construction01.png', alt: 'Construction Product 1' },
    { id: 2, src: '/img-refs-catalog/construction/construction02.png', alt: 'Construction Product 2' },
    { id: 3, src: '/img-refs-catalog/construction/construction03.png', alt: 'Construction Product 3' },
    { id: 4, src: '/img-refs-catalog/construction/construction04.png', alt: 'Construction Product 4' },
  ],
  tools: [
    { id: 1, src: '/img-refs-catalog/others/others01.png', alt: 'Tools Product 1' },
    { id: 2, src: '/img-refs-catalog/others/others02.png', alt: 'Tools Product 2' },
    { id: 3, src: '/img-refs-catalog/others/others03.png', alt: 'Tools Product 3' },
    { id: 4, src: '/img-refs-catalog/others/others04.png', alt: 'Tools Product 4' },
  ]
};

// Preload catalog images for instant switching with proper caching
const preloadCatalogImages = () => {
  Object.values(CATALOG_IMAGE_DATA).flat().forEach(({ src }) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
};

export default function UploadCatalog() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai' | 'predefined'>('computer');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Preload all catalog images on component mount for instant tab switching
  useEffect(() => {
    preloadCatalogImages();
  }, []);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Catalog workflow - fixed to catalog
  const workflowType = 'catalog';
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<'retail' | 'technology' | 'construction' | 'tools'>('retail');
  
  const selectedCategory = selectedCatalogCategory;

  // Get current category images (reactive) - now uses stable reference
  const moodImages = useMemo(() => CATALOG_IMAGE_DATA[selectedCatalogCategory] || CATALOG_IMAGE_DATA.retail, [selectedCatalogCategory]);

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
        navigate('/configure-catalog');
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
      navigate('/configure-catalog');
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
      // Navigate to configure-catalog page first
      navigate('/configure-catalog');
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
        navigate('/configure-catalog');
      } catch (error) {
        console.error('Error generating AI image:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Catalog categories
  const catalogCategories = [
    { id: 'retail', label: 'Retail', icon: '🛍️' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'construction', label: 'Construction', icon: '🏗️' },
    { id: 'tools', label: 'Tools', icon: '🔧' }
  ];

  // Sample card data for catalog workflow
  const getCardsForCategory = (category: string): CardData[] => {
    const baseCards: Record<string, CardData[]> = {
      retail: [
        { title: "Fashion Boutique", description: "Clothing and accessories", icon: "👗" },
        { title: "Home Goods", description: "Furniture and decor", icon: "🏠" },
        { title: "Beauty Products", description: "Cosmetics and skincare", icon: "💄" },
        { title: "Sporting Goods", description: "Athletic equipment", icon: "⚽" }
      ],
      technology: [
        { title: "Smartphones", description: "Mobile devices", icon: "📱" },
        { title: "Laptops", description: "Computing devices", icon: "💻" },
        { title: "Smart Home", description: "IoT devices", icon: "🏡" },
        { title: "Audio Equipment", description: "Headphones and speakers", icon: "🎧" }
      ],
      construction: [
        { title: "Building Materials", description: "Concrete and steel", icon: "🧱" },
        { title: "Heavy Machinery", description: "Construction equipment", icon: "🚜" },
        { title: "Safety Equipment", description: "Protective gear", icon: "🦺" },
        { title: "Electrical Systems", description: "Wiring and components", icon: "⚡" }
      ],
      tools: [
        { title: "Power Tools", description: "Electric equipment", icon: "🔨" },
        { title: "Hand Tools", description: "Manual equipment", icon: "🛠️" },
        { title: "Measuring Tools", description: "Precision instruments", icon: "📏" },
        { title: "Workshop Equipment", description: "Garage and shop tools", icon: "🔧" }
      ]
    };
    return baseCards[category] || baseCards.retail;
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
          <div className="flex flex-col justify-center items-center gap-4 w-full max-w-7xl mb-8 mx-auto">
            <h1 className="text-black text-center text-5xl font-medium leading-9 m-0" data-testid="text-main-title">
              Select an image
            </h1>
            <p className="text-gray-600 text-center text-2xl font-normal leading-7 m-0">
              Choose the product type you want to promote
            </p>
          </div>

          {/* Category Tabs - Always reserve consistent space */}
          <div className="flex justify-center mb-8 h-16">
            <div className={`flex items-center bg-white rounded-full shadow-lg px-2 py-1 relative z-20 ${activeTab === 'predefined' ? 'block' : 'hidden'}`}>
              {catalogCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className={`rounded-full text-sm font-medium transition-colors px-6 py-1 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => {
                    setSelectedCatalogCategory(category.id as any);
                    setSelectedImage(null);
                    setSelectedCard(null);
                  }}
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
              <span className="text-blue-900 text-center text-xl font-medium mt-10 block w-56">
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
                <div className="grid grid-cols-4 gap-6">
                  {moodImages.map((image) => (
                    <div
                      key={image.id}
                      className={`h-72 rounded-2xl cursor-pointer transition-transform duration-200 overflow-hidden ${
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
                        style={{ imageRendering: 'optimizeSpeed' }}
                      />
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