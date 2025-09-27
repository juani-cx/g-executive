import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Sparkles, Loader2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { PageTitle } from "@/components/PageTitle";
import { PageShell } from "@/components/PageShell";

// Type for card data
interface CardData {
  title: string;
  description: string;
  icon: string;
}

// Catalog image data - 8 product images in single array
const CATALOG_IMAGES: Array<{ id: number; src: string; alt: string }> = [
  { id: 1, src: '/img-refs-catalog/product01.png', alt: 'Product 1' },
  { id: 2, src: '/img-refs-catalog/product02.png', alt: 'Product 2' },
  { id: 3, src: '/img-refs-catalog/product03.png', alt: 'Product 3' },
  { id: 4, src: '/img-refs-catalog/product04.png', alt: 'Product 4' },
  { id: 5, src: '/img-refs-catalog/product05.png', alt: 'Product 5' },
  { id: 6, src: '/img-refs-catalog/product06.png', alt: 'Product 6' },
  { id: 7, src: '/img-refs-catalog/product07.png', alt: 'Product 7' },
  { id: 8, src: '/img-refs-catalog/product08.png', alt: 'Product 8' },
];

// Preload catalog images for instant switching with proper caching
const preloadCatalogImages = () => {
  CATALOG_IMAGES.forEach(({ src }) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
};

export default function UploadCatalog() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'qr' | 'computer' | 'ai' | 'predefined'>('predefined');
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
  
  // Use all 8 catalog images directly
  const moodImages = CATALOG_IMAGES;

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
        localStorage.setItem('selectedCategory', 'catalog');
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
      localStorage.setItem('selectedCategory', 'catalog');
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
      localStorage.setItem('selectedCategory', 'catalog');
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
        localStorage.setItem('selectedCategory', 'catalog');
        localStorage.setItem('workflowType', workflowType);
        navigate('/configure-catalog');
      } catch (error) {
        console.error('Error generating AI image:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };


  return (
    <PageShell 
      title="Select an image"
      subtitle="Choose the product type you want to promote"
      centerContent={false}
      pageBodyClassName="flex flex-col items-center"
      pageBodyStyle={{
        minHeight: 'calc(100vh - 120px)',
        padding: '24px 56px',
        paddingTop: '0'
      }}
    >
      {/* Main Content */}
      <div className="w-full text-center flex flex-col items-center">
          {/* Content Area - Fade transitions with image preloading */}
          <div className="relative w-full flex justify-center" style={{ height: '620px', marginTop: '-28px' }}>
            
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
                <div className="grid grid-cols-4 gap-8 max-w-5xl">
                  {moodImages.map((image) => (
                    <div
                      key={image.id}
                      className={`h-44 rounded-2xl cursor-pointer transition-transform duration-200 overflow-hidden ${
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
                        style={{ imageRendering: 'auto' }}
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
          <div className="relative flex justify-center items-center gap-6" style={{ height: 'auto', marginTop: '24px', marginBottom: '98px', padding: '22px' }}>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-2 px-6 py-4 font-medium transition-colors w-48 ${
                activeTab === 'computer'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
              style={{
                fontSize: '32px',
                lineHeight: '2'
              }}
              onClick={() => setActiveTab('computer')}
              data-testid="tab-upload"
            >
              <Upload className="w-12 h-12" style={{ width: '36px', height: '36px' }} />
              Upload your images
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-2 px-6 py-4 font-medium transition-colors w-48 ${
                activeTab === 'ai'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
              style={{
                fontSize: '32px',
                lineHeight: '2'
              }}
              onClick={() => setActiveTab('ai')}
              data-testid="tab-ai"
            >
              <Camera className="w-12 h-12" style={{ width: '36px', height: '36px' }} />
              Take a photo
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-2 px-6 py-4 font-medium transition-colors w-48 ${
                activeTab === 'predefined'
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
              style={{
                fontSize: '32px',
                lineHeight: '2'
              }}
              onClick={() => setActiveTab('predefined')}
              data-testid="tab-preselected"
            >
              <XCircle className="w-12 h-12" style={{ width: '36px', height: '36px' }} />
              I don't want to use my photos
            </Button>
          </div>
        </div>
    </PageShell>
  );
}