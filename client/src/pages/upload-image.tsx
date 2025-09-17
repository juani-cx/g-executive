import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function UploadImage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai'>('qr');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'digital' | 'physical' | 'service'>('digital');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

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

  // Video cards data for different categories
  const getCardsForCategory = (category: 'digital' | 'physical' | 'service') => {
    const cardData = {
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
    return cardData[category];
  };

  const handleCardSelect = (index: number) => {
    setSelectedCard(index);
  };

  const handleContinue = () => {
    if (selectedCard !== null) {
      const cards = getCardsForCategory(selectedCategory);
      const selectedCardData = cards[selectedCard];
      // Store selected card data for next step
      localStorage.setItem('selectedVideoCard', JSON.stringify({
        category: selectedCategory,
        cardIndex: selectedCard,
        cardData: selectedCardData
      }));
      navigate('/configure');
    }
  };

  return (
    <div className="h-screen max-h-screen dotted-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <svg width="150" height="88" viewBox="0 0 249 147" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M106.675 75.4022C106.675 87.1756 97.465 95.8513 86.1618 95.8513C74.8586 95.8513 65.6482 87.1756 65.6482 75.4022C65.6482 63.5458 74.8586 54.9531 86.1618 54.9531C97.465 54.9531 106.675 63.5458 106.675 75.4022ZM97.6955 75.4022C97.6955 68.045 92.3574 63.0111 86.1618 63.0111C79.9662 63.0111 74.6281 68.045 74.6281 75.4022C74.6281 82.6857 79.9662 87.7933 86.1618 87.7933C92.3574 87.7933 97.6955 82.6765 97.6955 75.4022Z" fill="#1E1E1E"/>
          <path d="M150.929 75.4022C150.929 87.1756 141.719 95.8513 130.415 95.8513C119.112 95.8513 109.902 87.1756 109.902 75.4022C109.902 63.555 119.112 54.9531 130.415 54.9531C141.719 54.9531 150.929 63.5458 150.929 75.4022ZM141.949 75.4022C141.949 68.045 136.611 63.0111 130.415 63.0111C124.22 63.0111 118.882 68.045 118.882 75.4022C118.882 82.6857 124.22 87.7933 130.415 87.7933C136.611 87.7933 141.949 82.6765 141.949 75.4022Z" fill="#1E1E1E"/>
          <path d="M193.337 56.1886V92.901C193.337 108.003 184.431 114.171 173.903 114.171C163.991 114.171 158.026 107.542 155.777 102.121L163.595 98.8661C164.987 102.194 168.398 106.122 173.893 106.122C180.633 106.122 184.809 101.964 184.809 94.1364V91.1954H184.496C182.486 93.6754 178.614 95.842 173.727 95.842C163.503 95.842 154.136 86.9359 154.136 75.476C154.136 63.933 163.503 54.9531 173.727 54.9531C178.605 54.9531 182.477 57.1197 184.496 59.526H184.809V56.1978H193.337V56.1886ZM185.446 75.476C185.446 68.2754 180.642 63.0111 174.53 63.0111C168.334 63.0111 163.143 68.2754 163.143 75.476C163.143 82.6027 168.334 87.7933 174.53 87.7933C180.642 87.7933 185.446 82.6027 185.446 75.476Z" fill="#1E1E1E"/>
          <path d="M207.4 34.6689V94.5963H198.641V34.6689H207.4Z" fill="#1E1E1E"/>
          <path d="M241.528 82.131L248.498 86.7777C246.249 90.1059 240.828 95.8405 231.461 95.8405C219.844 95.8405 211.168 86.8606 211.168 75.3915C211.168 63.2308 219.918 54.9424 230.456 54.9424C241.067 54.9424 246.258 63.3875 247.955 67.9512L248.886 70.2746L221.55 81.5962C223.642 85.699 226.897 87.7918 231.461 87.7918C236.034 87.7918 239.205 85.5422 241.528 82.131ZM220.074 74.7737L238.348 67.186C237.343 64.6322 234.319 62.8528 230.76 62.8528C226.196 62.8528 219.844 66.8818 220.074 74.7737Z" fill="#1E1E1E"/>
          <path d="M32.495 70.08V61.4044H61.7303C62.0161 62.9164 62.1636 64.705 62.1636 66.6411C62.1636 73.1501 60.3842 81.1988 54.6497 86.9334C49.0718 92.7418 41.945 95.8396 32.5042 95.8396C15.0054 95.8396 0.290894 81.5861 0.290894 64.0873C0.290894 46.5885 15.0054 32.335 32.5042 32.335C42.1848 32.335 49.081 36.1334 54.2624 41.0844L48.1406 47.2062C44.4251 43.7212 39.3912 41.0106 32.495 41.0106C19.7166 41.0106 9.72254 51.3089 9.72254 64.0873C9.72254 76.8656 19.7166 87.1639 32.495 87.1639C40.7834 87.1639 45.5038 83.8356 48.5278 80.8116C50.9803 78.3592 52.5937 74.8558 53.2298 70.0708L32.495 70.08Z" fill="#1E1E1E"/>
        </svg>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <Button 
          variant="outline" 
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={() => navigate('/homepage')}
          data-testid="button-back-to-home"
        >
          Back to home
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-screen max-h-screen p-8">
        <div className="text-center w-full max-w-2xl">
          <h1 className="text-6xl text-gray-800 mb-4 tracking-tight" style={{ fontWeight: '475' }}>
            Upload your image
          </h1>
          
          <p className="text-2xl text-gray-600 mb-16" style={{ fontWeight: '400' }}>
            Executive campaign AI builder for executive people
          </p>

          {activeTab === 'qr' ? (
            <div className="mb-12">
              {/* QR Code Area - Clickable to upload */}
              <div 
                className="w-80 h-80 mx-auto bg-[#4285F4] rounded-3xl flex items-center justify-center mb-8 cursor-pointer hover:bg-[#3367D6] transition-colors"
                onClick={() => document.getElementById('qr-file-upload')?.click()}
                data-testid="qr-code-upload"
              >
                {/* QR Code Pattern */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="text-white">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor"/>
                  <rect x="10" y="10" width="10" height="10" fill="transparent"/>
                  <rect x="170" y="0" width="30" height="30" fill="currentColor"/>
                  <rect x="180" y="10" width="10" height="10" fill="transparent"/>
                  <rect x="0" y="170" width="30" height="30" fill="currentColor"/>
                  <rect x="10" y="180" width="10" height="10" fill="transparent"/>
                  
                  {/* QR Pattern squares */}
                  <rect x="40" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="0" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="0" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="0" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="20" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="40" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="40" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="20" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="60" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="60" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="40" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="80" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="80" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="0" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="100" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="100" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="20" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="120" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="120" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="0" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="40" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="120" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="160" y="140" width="10" height="10" fill="currentColor"/>
                  <rect x="190" y="140" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="40" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="60" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="160" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="160" width="10" height="10" fill="currentColor"/>
                  
                  <rect x="40" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="80" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="100" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="140" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="180" y="180" width="10" height="10" fill="currentColor"/>
                  <rect x="190" y="180" width="10" height="10" fill="currentColor"/>
                </svg>
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
            <div className="mb-12 w-full max-w-6xl mx-auto">
              {/* Category Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 rounded-full p-2 flex gap-2">
                  <Button
                    variant={selectedCategory === 'digital' ? 'default' : 'ghost'}
                    onClick={() => {
                      setSelectedCategory('digital');
                      setSelectedCard(null);
                      setCurrentCardIndex(0);
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === 'digital'
                        ? 'bg-[#4285F4] text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    data-testid="button-category-digital"
                  >
                    Digital Product
                  </Button>
                  <Button
                    variant={selectedCategory === 'physical' ? 'default' : 'ghost'}
                    onClick={() => {
                      setSelectedCategory('physical');
                      setSelectedCard(null);
                      setCurrentCardIndex(0);
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === 'physical'
                        ? 'bg-[#4285F4] text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    data-testid="button-category-physical"
                  >
                    Physical Product
                  </Button>
                  <Button
                    variant={selectedCategory === 'service' ? 'default' : 'ghost'}
                    onClick={() => {
                      setSelectedCategory('service');
                      setSelectedCard(null);
                      setCurrentCardIndex(0);
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === 'service'
                        ? 'bg-[#4285F4] text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    data-testid="button-category-service"
                  >
                    Service
                  </Button>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {getCardsForCategory(selectedCategory)
                    .slice(currentCardIndex, currentCardIndex + 4)
                    .map((card, index) => (
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
                      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                        {/* Video Area */}
                        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {/* Animated gradient background similar to attached image */}
                            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-600 to-purple-600 relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              {/* Animated orb similar to the image */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-24 h-24 bg-blue-400 rounded-full opacity-80 animate-pulse" />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 text-lg font-bold">{card.icon}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-6">
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

    </div>
  );
}