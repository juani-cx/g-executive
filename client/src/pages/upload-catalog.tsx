import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// Type for card data
interface CardData {
  title: string;
  description: string;
  icon: string;
}

export default function UploadCatalog() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai' | 'predefined'>('computer');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Predefined mood images
  const moodImages = [
    { id: 1, src: '/img-refs/mood01.png', alt: 'Mood 1' },
    { id: 2, src: '/img-refs/mood02.png', alt: 'Mood 2' },
    { id: 3, src: '/img-refs/mood03.png', alt: 'Mood 3' },
    { id: 4, src: '/img-refs/mood04.png', alt: 'Mood 4' },
  ];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Catalog workflow - fixed to catalog
  const workflowType = 'catalog';
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<'retail' | 'technology' | 'construction' | 'tools'>('retail');
  
  const selectedCategory = selectedCatalogCategory;

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
    <div className="dotted-background overflow-hidden" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh'
    }}>
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content */}
      <div className="flex items-start justify-center p-4 sm:p-8 overflow-y-auto pt-16" style={{ height: 'calc(100vh - 120px)', minHeight: 'auto', marginTop: '0' }}>
        <div className="w-full max-w-6xl text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-6xl text-gray-800 mb-4 tracking-tight"
              style={{ fontWeight: '475' }}
              data-testid="text-main-title"
            >
              Select an image
            </h1>
            <p 
              className="text-2xl text-gray-600 mb-16"
              style={{ fontWeight: '400' }}
            >
              Choose the product type you want to promote
            </p>
          </div>

          {/* Category Tabs - Only show when in predefined tab */}
          {activeTab === 'predefined' && (
            <div className="flex justify-center mb-12">
              <div className="flex items-center bg-white rounded-full px-1 py-1 shadow-lg">
                {catalogCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setSelectedCatalogCategory(category.id as any)}
                    data-testid={`tab-${category.id}`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Tabs */}
          <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg border">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  activeTab === 'computer'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('computer')}
                data-testid="tab-upload"
              >
                <Upload className="w-4 h-4" />
                Upload your images
              </Button>
              <div className="w-px h-4 bg-gray-200 mx-2"></div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  activeTab === 'ai'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('ai')}
                data-testid="tab-ai"
              >
                <Camera className="w-4 h-4" />
                Take a photo
              </Button>
              <div className="w-px h-4 bg-gray-200 mx-2"></div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  activeTab === 'predefined'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('predefined')}
                data-testid="tab-preselected"
              >
                I don't want to use my photos
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'computer' && (
              <div className="text-center">
                <div className="bg-white rounded-3xl p-16 shadow-lg inline-block">
                  <div className="bg-gray-100 p-8 rounded-2xl">
                    <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center">
                      {/* Actual QR Code */}
                      <img
                        src="/images/QR_code.svg"
                        alt="QR Code for uploading"
                        className="w-32 h-32"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan this QR code</h3>
                    <p className="text-gray-600">to upload your image</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="text-center">
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
            )}

            {activeTab === 'predefined' && (
              <div>
                {/* Predefined Images Grid */}
                <div className="relative mb-12">
                  <div className="grid grid-cols-4 gap-4">
                    {moodImages.map((image) => (
                      <div
                        key={image.id}
                        className={`h-40 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
                          selectedImage === image.src
                            ? 'ring-4 ring-blue-500 shadow-2xl transform scale-105'
                            : 'hover:transform hover:scale-105 hover:shadow-xl'
                        }`}
                        onClick={() => handleImageSelect(image.id, image.src)}
                        data-testid={`image-${image.id}`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Button - Always visible */}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}