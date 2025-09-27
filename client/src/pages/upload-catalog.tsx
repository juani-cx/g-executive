import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { UploadPageLayout } from "@/components/UploadPageLayout";

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
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preload all catalog images on component mount for instant tab switching
  useEffect(() => {
    preloadCatalogImages();
  }, []);

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

  const handleImageSelect = (imageId: number, imageSrc: string) => {
    setSelectedImage(imageSrc);
    setSelectedCard(imageId);
  };

  const handlePredefinedContinue = () => {
    if (selectedImage) {
      localStorage.setItem('uploadedImage', selectedImage);
      localStorage.setItem('selectedCategory', 'catalog');
      localStorage.setItem('workflowType', workflowType);
      navigate('/configure-catalog');
    }
  };

  return (
    <UploadPageLayout
      title="Select an image"
      subtitle="Choose the product type you want to promote"
      showCategoryTabs={false}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showContinueButton={activeTab === "predefined"}
      continueDisabled={!selectedImage}
      onContinue={handlePredefinedContinue}
      continueText="Continue with this selection"
      contentHeight="620px"
      contentMarginTop="-28px"
    >
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
          <div className="grid grid-cols-4 gap-6 max-w-7xl">
            {moodImages.map((image) => (
              <div
                key={image.id}
                className={`h-72 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  selectedImage === image.src
                    ? 'ring-4 ring-blue-500 shadow-2xl transform scale-105'
                    : 'hover:scale-102 hover:shadow-lg'
                }`}
                style={{ maxWidth: '380px' }}
                onClick={() => handleImageSelect(image.id, image.src)}
                data-testid={`image-${image.id}`}
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        data-testid="input-file-upload"
      />
    </UploadPageLayout>
  );
}