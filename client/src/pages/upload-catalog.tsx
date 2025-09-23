import { useState } from "react";
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
      // Navigate to loading page first, which will redirect to catalog canvas
      navigate('/loading');
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
              Choose the product type you want to promote
            </p>
          </div>

          {/* Category Tabs - Always reserve consistent space */}
          <div className="flex justify-center mb-8" style={{ height: '64px' }}>
            {activeTab === 'predefined' && (
              <div className="flex items-center bg-white rounded-full shadow-lg" style={{ padding: '0.25rem 0.5rem' }}>
                {catalogCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600"
                    }`}
                    style={{ padding: '0.25rem 1.5rem' }}
                    onClick={() => setSelectedCatalogCategory(category.id as any)}
                    data-testid={`tab-${category.id}`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            minHeight: '600px',
            justifyContent: 'center',
            marginTop: '-50px'
          }}>
            {activeTab === 'computer' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}>
                {/* QR Component - Scaled for 1080px viewport */}
                <div style={{
                  boxSizing: 'border-box',
                  background: '#e6ebf2',
                  border: '27px solid #fff',
                  borderRadius: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  width: '400px',
                  height: '340px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 24px #0000001a'
                }}>
                  <div style={{
                    aspectRatio: '1',
                    background: '#d3d3d3 url(/images/QR_code.svg) 50% / cover no-repeat',
                    flexShrink: '0',
                    width: '214px',
                    height: '214px'
                  }} />
                </div>
                {/* Text below QR - Scaled proportionally */}
                <span style={{
                  color: '#1f3251',
                  textAlign: 'center',
                  width: '220px',
                  fontFamily: 'Google Sans',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: 'normal',
                  display: 'inline-block'
                }}>
                  Scan this QR code&#x2028;to upload your image
                </span>
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
                        className={`h-56 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
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
                          loading="lazy"
                          decoding="async"
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

            {/* Bottom Action Tabs - Fixed to bottom */}
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              paddingBottom: '20px',
              marginTop: '20px'
            }}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-2 px-6 py-4 text-lg font-medium transition-all ${
                  activeTab === 'computer'
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('computer')}
                data-testid="tab-upload"
              >
                <Upload style={{ width: '1.8rem', height: '1.8rem' }} />
                Upload your images
              </Button>
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-2 px-6 py-4 text-lg font-medium transition-all ${
                  activeTab === 'ai'
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('ai')}
                data-testid="tab-ai"
              >
                <Camera style={{ width: '1.8rem', height: '1.8rem' }} />
                Take a photo
              </Button>
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-2 px-6 py-4 text-lg font-medium transition-all ${
                  activeTab === 'predefined'
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('predefined')}
                data-testid="tab-preselected"
              >
                <XCircle style={{ width: '1.8rem', height: '1.8rem' }} />
                I don't want to use my photos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}