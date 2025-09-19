import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import QRCode from "react-qr-code";

// Type for card data
interface CardData {
  title: string;
  description: string;
  icon: string;
}

export default function UploadCatalog() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai'>('qr');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content */}
      <div className="pt-24 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-normal text-gray-900 mb-4" style={{ fontWeight: '475' }}>
              Select an image
            </h1>
            <p className="text-xl text-gray-600" style={{ fontWeight: '400' }}>
              Choose the product type you want to promote
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-white rounded-full p-2 shadow-lg">
              {catalogCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className={`rounded-full px-6 py-3 text-base font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => setSelectedCatalogCategory(category.id as any)}
                  data-testid={`tab-${category.id}`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-full p-1">
              <Button
                variant={activeTab === 'qr' ? 'default' : 'ghost'}
                className={`rounded-full px-6 py-2 text-sm font-medium ${
                  activeTab === 'qr'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('qr')}
                data-testid="tab-preselected"
              >
                I don't have photos
              </Button>
              <Button
                variant={activeTab === 'computer' ? 'default' : 'ghost'}
                className={`rounded-full px-6 py-2 text-sm font-medium ${
                  activeTab === 'computer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('computer')}
                data-testid="tab-upload"
              >
                Upload your images
              </Button>
              <Button
                variant={activeTab === 'ai' ? 'default' : 'ghost'}
                className={`rounded-full px-6 py-2 text-sm font-medium ${
                  activeTab === 'ai'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('ai')}
                data-testid="tab-ai"
              >
                Take a photo
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'qr' && (
              <div>
                {/* Cards Grid */}
                <div className="relative">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {visibleCards.map((card, index) => {
                      const cardIndex = startIndex + index;
                      return (
                        <div
                          key={cardIndex}
                          className={`bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                            selectedCard === cardIndex
                              ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
                              : 'shadow-md hover:shadow-lg hover:transform hover:scale-102'
                          }`}
                          onClick={() => setSelectedCard(cardIndex)}
                          data-testid={`card-${cardIndex}`}
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-3">{card.icon}</div>
                            <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-600">{card.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Arrows */}
                  {currentCards.length > 4 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg"
                        onClick={prevCard}
                        data-testid="button-prev-cards"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg"
                        onClick={nextCard}
                        data-testid="button-next-cards"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Continue Button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    disabled={selectedCard === null}
                    onClick={handleContinue}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                    data-testid="button-continue"
                  >
                    Continue with this selection
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'computer' && (
              <div className="text-center">
                <div className="bg-white rounded-3xl p-12 shadow-lg">
                  <div className="mb-6">
                    <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload your images</h3>
                    <p className="text-gray-600">Drop your files here or click to browse</p>
                  </div>
                  
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    data-testid="input-file-upload"
                  />
                  
                  <Button
                    size="lg"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
                    data-testid="button-upload"
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="text-center">
                <div className="bg-white rounded-3xl p-12 shadow-lg">
                  <div className="mb-6">
                    <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Generate with AI</h3>
                    <p className="text-gray-600 mb-6">Describe what you want to create</p>
                  </div>
                  
                  <div className="max-w-md mx-auto mb-6">
                    <Input
                      type="text"
                      placeholder="Describe your image..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      data-testid="input-ai-prompt"
                    />
                  </div>
                  
                  <Button
                    size="lg"
                    disabled={!aiPrompt.trim() || isGenerating}
                    onClick={handleAIGenerate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold disabled:opacity-50"
                    data-testid="button-generate-ai"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Image
                      </>
                    )}
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