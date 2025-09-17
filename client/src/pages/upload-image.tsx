import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2 } from "lucide-react";

export default function UploadImage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai'>('qr');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="h-screen max-h-screen dotted-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-4">
          <img src="/Google_logo.svg" alt="Google" className="h-10" />
        </div>
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
              {/* QR Code Area */}
              <div className="w-80 h-80 mx-auto bg-[#4285F4] rounded-3xl flex items-center justify-center mb-8">
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
              
              <p className="text-lg text-gray-600" style={{ fontWeight: '400' }}>
                Scan the QR code to visit our<br />upload service
              </p>
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
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block bg-[#4285F4] hover:bg-[#3367D6] text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
                data-testid="button-choose-file"
              >
                Choose File
              </label>
            </div>
          ) : (
            <div className="mb-12">
              {/* AI Generation Area */}
              <div className="w-80 h-80 mx-auto border-2 border-dashed border-[#4285F4] rounded-3xl flex items-center justify-center mb-8">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-[#4285F4] mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Describe your image and AI will create it</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Input
                  placeholder="Describe your image (e.g., 'A modern office space with natural lighting')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleAIGeneration()}
                  className="max-w-md mx-auto"
                  data-testid="input-ai-prompt"
                />
                <Button
                  onClick={handleAIGeneration}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-8 py-3 rounded-full text-lg font-semibold"
                  data-testid="button-generate-ai"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Bottom buttons */}
          <div className="flex items-center justify-center gap-12">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setActiveTab(activeTab === 'qr' ? 'computer' : 'qr')}
              className={`w-24 h-24 rounded-full p-0 transition-all ${
                activeTab === 'qr' || activeTab === 'computer'
                  ? 'bg-[#4285F4] hover:bg-[#3367D6] shadow-lg scale-110' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              data-testid="button-toggle-upload"
            >
              <Upload className={`w-12 h-12 ${
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
              <Camera className={`w-12 h-12 text-gray-600`} />
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
              <Sparkles className={`w-12 h-12 ${
                activeTab === 'ai' ? 'text-white' : 'text-gray-600'
              }`} />
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}