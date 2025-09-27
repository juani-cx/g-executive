import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { AppShell, PageHeader, PageBody, PageFooter } from "@/components/layout";
import { PageTitle } from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import QRCode from "react-qr-code";

// Type for card data
interface CardData {
  title: string;
  description: string;
  icon: string;
}

export default function UploadImage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai'>('qr');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Get workflow type from localStorage
  const workflowType = localStorage.getItem('workflowType') as 'campaign' | 'catalog' || 'campaign';
  
  // Dynamic category state based on workflow type
  const [selectedCampaignCategory, setSelectedCampaignCategory] = useState<'digital' | 'physical' | 'service'>('digital');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<'retail' | 'technology' | 'construction' | 'tools'>('retail');
  
  const selectedCategory = workflowType === 'campaign' ? selectedCampaignCategory : selectedCatalogCategory;

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
        // Compress image before storing
        const compressedImage = await compressImage(file);
        localStorage.setItem('uploadedImage', compressedImage);
        localStorage.setItem('uploadedFileName', file.name);
        navigate('/configure');
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback: try storing original if compression fails
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imageData = e.target?.result as string;
            localStorage.setItem('uploadedImage', imageData);
            localStorage.setItem('uploadedFileName', file.name);
            navigate('/configure');
          } catch (storageError) {
            alert('Image too large. Please select a smaller image.');
            console.error('Storage error:', storageError);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCameraCapture = () => {
    // For demo purposes, simulate camera capture
    console.log('Camera capture would be implemented here');
    // In real implementation, this would open camera modal
  };

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/openai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          size: "1024x1024",
          quality: "standard"
        })
      });
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        
        // Convert the generated image URL to base64 for storage
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result as string;
          localStorage.setItem('uploadedImage', imageData);
          localStorage.setItem('uploadedFileName', 'ai-generated.png');
          localStorage.setItem('aiGeneratedPrompt', aiPrompt);
          navigate('/configure');
        };
        reader.readAsDataURL(imageBlob);
      } else {
        alert('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Video cards data for different categories based on workflow type
  const getCardsForCategory = (category: string) => {
    if (workflowType === 'campaign') {
      const campaignCardData = {
        digital: [
          { title: 'Mobile App', description: 'Promote your mobile application with engaging visuals', icon: '📱' },
          { title: 'Software Platform', description: 'Showcase your SaaS or software solution', icon: '💻' },
          { title: 'Web Service', description: 'Market your online service or platform', icon: '🌐' },
          { title: 'Digital Tool', description: 'Highlight your productivity or utility tool', icon: '🔧' },
          { title: 'Gaming App', description: 'Create excitement around your mobile game', icon: '🎮' },
          { title: 'E-learning Course', description: 'Promote your educational content', icon: '📚' },
          { title: 'Digital Media', description: 'Showcase your streaming or media service', icon: '🎬' },
          { title: 'Fintech App', description: 'Market your financial technology solution', icon: '💳' },
        ],
        physical: [
          { title: 'Electronics', description: 'Showcase innovative electronic products', icon: '⚡' },
          { title: 'Fashion Item', description: 'Highlight clothing and accessories', icon: '👗' },
          { title: 'Home & Garden', description: 'Present household and garden products', icon: '🏠' },
          { title: 'Sports Equipment', description: 'Promote fitness and sports gear', icon: '⚽' },
          { title: 'Food & Beverage', description: 'Market culinary products and drinks', icon: '🍽️' },
          { title: 'Health & Beauty', description: 'Showcase wellness and cosmetic products', icon: '💄' },
          { title: 'Automotive', description: 'Present vehicle parts and accessories', icon: '🚗' },
          { title: 'Books & Media', description: 'Promote physical books and media', icon: '📖' },
        ],
        service: [
          { title: 'Consulting', description: 'Professional advisory and consulting services', icon: '💼' },
          { title: 'Education', description: 'Training and educational service offerings', icon: '🎓' },
          { title: 'Healthcare', description: 'Medical and wellness service solutions', icon: '🏥' },
          { title: 'Legal Services', description: 'Law and legal consultation services', icon: '⚖️' },
          { title: 'Finance', description: 'Financial planning and advisory services', icon: '📊' },
          { title: 'Marketing', description: 'Advertising and marketing service solutions', icon: '📈' },
          { title: 'Real Estate', description: 'Property and real estate services', icon: '🏢' },
          { title: 'Travel', description: 'Tourism and travel service offerings', icon: '✈️' },
        ]
      };
      return (campaignCardData as any)[category] || [];
    } else {
      const catalogCardData = {
        retail: [
          { title: 'Fashion & Apparel', description: 'Clothing, shoes, and fashion accessories', icon: '👗' },
          { title: 'Electronics Store', description: 'Consumer electronics and gadgets', icon: '📱' },
          { title: 'Home & Furniture', description: 'Home decor and furniture items', icon: '🏠' },
          { title: 'Sports & Fitness', description: 'Athletic wear and fitness equipment', icon: '⚽' },
          { title: 'Beauty & Personal Care', description: 'Cosmetics and personal care products', icon: '💄' },
          { title: 'Books & Media', description: 'Books, magazines, and entertainment', icon: '📚' },
          { title: 'Food & Grocery', description: 'Food items and grocery products', icon: '🍽️' },
          { title: 'Toys & Games', description: 'Toys, games, and hobby items', icon: '🎮' },
        ],
        technology: [
          { title: 'Software Solutions', description: 'Enterprise and consumer software', icon: '💻' },
          { title: 'Mobile Applications', description: 'iOS and Android applications', icon: '📱' },
          { title: 'Cloud Services', description: 'Cloud computing and storage solutions', icon: '☁️' },
          { title: 'AI & Machine Learning', description: 'Artificial intelligence platforms', icon: '🤖' },
          { title: 'Cybersecurity', description: 'Security software and services', icon: '🔒' },
          { title: 'IoT Devices', description: 'Internet of Things products', icon: '📡' },
          { title: 'Development Tools', description: 'Programming and development platforms', icon: '🔧' },
          { title: 'Data Analytics', description: 'Business intelligence and analytics', icon: '📊' },
        ],
        construction: [
          { title: 'Building Materials', description: 'Concrete, steel, and construction supplies', icon: '🏗️' },
          { title: 'Heavy Machinery', description: 'Construction equipment and vehicles', icon: '🚜' },
          { title: 'Safety Equipment', description: 'PPE and safety gear for construction', icon: '⛑️' },
          { title: 'Electrical Systems', description: 'Wiring and electrical components', icon: '⚡' },
          { title: 'Plumbing Supplies', description: 'Pipes, fixtures, and plumbing tools', icon: '🔧' },
          { title: 'Roofing Materials', description: 'Shingles, tiles, and roofing systems', icon: '🏠' },
          { title: 'Insulation Products', description: 'Thermal and acoustic insulation', icon: '🧱' },
          { title: 'Concrete Solutions', description: 'Concrete mixes and additives', icon: '⚒️' },
        ],
        tools: [
          { title: 'Power Tools', description: 'Electric drills, saws, and power equipment', icon: '🔌' },
          { title: 'Hand Tools', description: 'Hammers, screwdrivers, and manual tools', icon: '🔨' },
          { title: 'Measuring Instruments', description: 'Rulers, levels, and measuring devices', icon: '📏' },
          { title: 'Workshop Equipment', description: 'Workbenches and shop accessories', icon: '🔧' },
          { title: 'Garden Tools', description: 'Lawn mowers, pruners, and garden equipment', icon: '🌱' },
          { title: 'Automotive Tools', description: 'Car repair and maintenance tools', icon: '🚗' },
          { title: 'Precision Instruments', description: 'Calipers, micrometers, and precision tools', icon: '📐' },
          { title: 'Safety Tools', description: 'Safety equipment and protective gear', icon: '🦺' },
        ]
      };
      return (catalogCardData as any)[category] || [];
    }
  };

  const handleCardSelect = (index: number) => {
    setSelectedCard(index);
  };

  const handleContinue = () => {
    if (selectedCard !== null) {
      const cards = getCardsForCategory(selectedCategory);
      const selectedCardData = cards[selectedCard];
      // Store selected card data and workflow type for next step
      localStorage.setItem('selectedVideoCard', JSON.stringify({
        category: selectedCategory,
        cardIndex: selectedCard,
        cardData: selectedCardData,
        workflowType: workflowType
      }));
      navigate('/configure');
    }
  };

  return (
    <AppShell
      className="dotted-background"
      style={{
        fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      header={
        <PageHeader>
          <TopNavigation />
        </PageHeader>
      }
      footer={
        <PageFooter>
          <p className="footer-text text-gray-600">
            Create multi-channel assets in an instant
          </p>
        </PageFooter>
      }
    >
      <PageBody>

      {/* Main Content */}
      <div className="flex items-center justify-center">
        <div className="text-center w-full">
          <PageTitle
            title="Select an image"
            subtitle="Choose the mood of your campaign for AI inspiration"
            className="mb-16"
          />

          {activeTab === 'qr' ? (
            <div className="mb-12">
              {/* Image Upload Area - Clickable to upload */}
              <div 
                className="w-96 mx-auto bg-gradient-to-br from-[#4285F4] to-[#3367D6] rounded-3xl mb-8 cursor-pointer hover:from-[#3367D6] hover:to-[#2C5CC5] transition-all duration-200 flex items-center justify-center"
                style={{ height: '400px' }}
                onClick={() => document.getElementById('qr-file-upload')?.click()}
                data-testid="qr-code-upload"
              >
                <div className="bg-white p-6 rounded-2xl">
                  <QRCode 
                    value={window.location.href} 
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>
              
              <h2 className="text-3xl text-gray-800 mb-4" style={{ fontWeight: '475' }}>
                Scan this code<br />to upload your image
              </h2>
              
              
              {/* Hidden file input for QR code upload */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-file-upload"
                data-testid="input-qr-file-upload"
              />
            </div>
          ) : activeTab === 'computer' ? (
            <div className="mb-12">
              <div className="w-80 h-80 mx-auto border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center mb-8">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Click to upload or drag and drop</p>
                </div>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                data-testid="input-file-upload"
              />
              <div className="inline-block bg-gray-300 text-gray-500 px-8 py-3 rounded-full text-lg font-semibold cursor-not-allowed">
                Choose File
              </div>
            </div>
          ) : (
            <div className="mb-12 w-full mx-auto" style={{ maxWidth: '72rem' }}>
              {/* Category Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 rounded-full p-2 flex gap-2">
                  {workflowType === 'campaign' ? (
                    <>
                      <Button
                        variant={selectedCampaignCategory === 'digital' ? 'default' : 'ghost'}
                        onClick={() => {
                          setSelectedCampaignCategory('digital');
                          setSelectedCard(null);
                          setCurrentCardIndex(0);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium ${
                          selectedCampaignCategory === 'digital'
                            ? 'bg-[#4285F4] text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        data-testid="button-category-digital"
                      >
                        Digital Product
                      </Button>
                      <Button
                        variant={selectedCampaignCategory === 'physical' ? 'default' : 'ghost'}
                        onClick={() => {
                          setSelectedCampaignCategory('physical');
                          setSelectedCard(null);
                          setCurrentCardIndex(0);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium ${
                          selectedCampaignCategory === 'physical'
                            ? 'bg-[#4285F4] text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        data-testid="button-category-physical"
                      >
                        Physical Product
                      </Button>
                      <Button
                        variant={selectedCampaignCategory === 'service' ? 'default' : 'ghost'}
                        onClick={() => {
                          setSelectedCampaignCategory('service');
                          setSelectedCard(null);
                          setCurrentCardIndex(0);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium ${
                          selectedCampaignCategory === 'service'
                            ? 'bg-[#4285F4] text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        data-testid="button-category-service"
                      >
                        Service
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant={selectedCatalogCategory === 'retail' ? 'default' : 'ghost'}
                        onClick={() => {
                          setSelectedCatalogCategory('retail');
                          setSelectedCard(null);
                          setCurrentCardIndex(0);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium ${
                          selectedCatalogCategory === 'retail'
                            ? 'bg-[#4285F4] text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        data-testid="button-category-retail"
                      >
                        Retail
                      </Button>
                      <Button
                        variant={selectedCatalogCategory === 'technology' ? 'default' : 'ghost'}
                        onClick={() => {
                          setSelectedCatalogCategory('technology');
                          setSelectedCard(null);
                          setCurrentCardIndex(0);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium ${
                          selectedCatalogCategory === 'technology'
                            ? 'bg-[#4285F4] text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        data-testid="button-category-technology"
                      >
                        Technology
                      </Button>
                      <Button
                        variant={selectedCatalogCategory === 'construction' ? 'default' : 'ghost'}
                        onClick={() => {
                          setSelectedCatalogCategory('construction');
                          setSelectedCard(null);
                          setCurrentCardIndex(0);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium ${
                          selectedCatalogCategory === 'construction'
                            ? 'bg-[#4285F4] text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        data-testid="button-category-construction"
                      >
                        Construction
                      </Button>
                      <Button
                        variant={selectedCatalogCategory === 'tools' ? 'default' : 'ghost'}
                        onClick={() => {
                          setSelectedCatalogCategory('tools');
                          setSelectedCard(null);
                          setCurrentCardIndex(0);
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-medium ${
                          selectedCatalogCategory === 'tools'
                            ? 'bg-[#4285F4] text-white'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        data-testid="button-category-tools"
                      >
                        Tools
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Video Cards Grid */}
              <div className="relative">
                {/* Navigation Arrows */}
                {currentCardIndex > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 4))}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-gray-300 hover:shadow-xl"
                    data-testid="button-cards-previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                )}
                
                {currentCardIndex + 4 < getCardsForCategory(selectedCategory).length && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentCardIndex(currentCardIndex + 4)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-gray-300 hover:shadow-xl"
                    data-testid="button-cards-next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {getCardsForCategory(selectedCategory)
                    .slice(currentCardIndex, currentCardIndex + 4)
                    .map((card: CardData, index: number) => (
                    <div
                      key={`${selectedCategory}-${currentCardIndex + index}`}
                      onClick={() => handleCardSelect(currentCardIndex + index)}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedCard === currentCardIndex + index
                          ? 'ring-4 ring-[#4285F4] ring-opacity-50 scale-105'
                          : 'hover:scale-105 hover:shadow-lg'
                      }`}
                      data-testid={`card-video-${currentCardIndex + index}`}
                    >
                      <div className="bg-white rounded-3xl shadow-lg overflow-hidden" style={{ height: '400px' }}>
                        {/* Video Area */}
                        <div className="w-full bg-gradient-to-br from-blue-900 via-blue-600 to-purple-600 relative overflow-hidden" style={{ height: '280px' }}>
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-4 flex flex-col justify-center" style={{ height: '120px' }}>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontWeight: '475' }}>
                            {card.title}
                          </h3>
                          <p className="text-gray-600 text-sm" style={{ fontWeight: '400' }}>
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              {selectedCard !== null && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleContinue}
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-12 py-4 rounded-full text-lg font-semibold"
                    data-testid="button-continue-with-selection"
                  >
                    Continue with Selection
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Bottom buttons */}
          <div className="flex items-center justify-center gap-12">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setActiveTab('qr')}
              className={`w-24 h-24 rounded-full p-0 transition-all ${
                activeTab === 'qr'
                  ? 'bg-[#4285F4] hover:bg-[#3367D6] shadow-lg scale-110' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              data-testid="button-toggle-upload"
            >
              <Upload className={`w-16 h-16 ${
                activeTab === 'qr' || activeTab === 'computer' ? 'text-white' : 'text-gray-600'
              }`} />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={handleCameraCapture}
              className={`w-24 h-24 rounded-full p-0 transition-all ${
                false // Camera capture is not implemented yet
                  ? 'bg-[#4285F4] hover:bg-[#3367D6] shadow-lg scale-110' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              data-testid="button-camera-capture"
            >
              <Camera className={`w-16 h-16 text-gray-600`} />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setActiveTab('ai')}
              className={`w-24 h-24 rounded-full p-0 transition-all ${
                activeTab === 'ai' 
                  ? 'bg-[#4285F4] hover:bg-[#3367D6] shadow-lg scale-110' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              data-testid="button-ai-generate"
            >
              <Sparkles className={`w-16 h-16 ${
                activeTab === 'ai' ? 'text-white' : 'text-gray-600'
              }`} />
            </Button>
          </div>
        </div>
      </div>
      </PageBody>
    </AppShell>
  );
}