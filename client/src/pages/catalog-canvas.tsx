import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TopNavigation from "@/components/TopNavigation";
import { ChevronLeft, Settings, Download } from "lucide-react";
import QRCode from "react-qr-code";

// Virtual Keyboard Component
function VirtualKeyboard({ isVisible }: { isVisible: boolean }) {
  const keyboardKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
    ['↑', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '⌫'],
    ['123?', '◀', '▶', '⎵', '-', '_', '🔍']
  ];

  return (
    <div className={`virtual-keyboard fixed left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out z-50 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`} style={{ bottom: 'calc(2rem - 35px)' }}>
      <div className="p-6" style={{ width: '900px' }}>
        <div className="space-y-3">
          {keyboardKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3">
              {row.map((key, keyIndex) => (
                <div
                  key={keyIndex}
                  className={`
                    flex items-center justify-center h-12 bg-white border border-gray-300 rounded-lg
                    text-lg font-medium text-gray-800 shadow-sm hover:bg-gray-50 cursor-pointer
                    transition-colors
                    ${key === '⎵' ? 'w-32' : key === '123?' ? 'w-16' : 'w-12'}
                  `}
                >
                  {key === '⎵' ? 'space' : key}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CatalogCanvas() {
  const [, navigate] = useLocation();
  
  // SEO form fields
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [seoMetadata, setSeoMetadata] = useState('');
  const [altText, setAltText] = useState('');
  const [tags, setTags] = useState('');
  
  // Modal and keyboard states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleBack = () => {
    navigate('/upload-catalog');
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleRandomize = () => {
    // Randomize SEO content
    const randomTitles = [
      'Premium Quality Product',
      'Professional Grade Item',
      'High-Performance Solution',
      'Advanced Technology Product'
    ];
    const randomDescriptions = [
      'Experience superior quality and performance with this premium product designed for professionals.',
      'Innovative solution that delivers exceptional results and reliability for demanding applications.',
      'High-quality product engineered for durability and optimal performance in any environment.',
      'Advanced technology meets practical design in this professional-grade solution.'
    ];
    
    setProductTitle(randomTitles[Math.floor(Math.random() * randomTitles.length)]);
    setProductDescription(randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)]);
    setSeoMetadata('premium, quality, professional, durable, reliable');
    setAltText('High-quality product image showcasing professional design and features');
  };

  const handleInputFocus = () => {
    setShowKeyboard(true);
  };

  const handleInputBlur = () => {
    // Delay hiding keyboard to allow for interactions
    setTimeout(() => setShowKeyboard(false), 300);
  };

  return (
    <div className="dotted-background overflow-hidden" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh'
    }}>
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content */}
      <div style={{
        width: '100%',
        height: '100%',
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
          {/* Header - Exact match to canvas.tsx */}
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
              Canvas
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
              Review, edit and download your assets
            </p>
          </div>

          {/* Main Canvas Area - More compact layout */}
          <div className="max-w-7xl mx-auto">
            <div style={{
              display: 'flex',
              gap: '32px',
              flex: 1,
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%'
            }}>
              {/* Left Side - SEO Attributes with Image and some fields */}
              <div style={{
                flex: '1',
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px',
                    fontFamily: 'Google Sans'
                  }}>
                    SEO Attributes
                  </h2>
                </div>

                {/* Product Image/Video Display */}
                <div style={{
                  width: '100%',
                  height: '240px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #d1d5db',
                  marginBottom: '16px'
                }}>
                  <img
                    src="/img-refs/mood01.png"
                    alt="Product preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                    data-testid="img-product-preview"
                  />
                </div>

                <p style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  marginBottom: '20px',
                  margin: 0
                }}>
                  Optimize your product for search engines and better discoverability
                </p>

                {/* Alt Image Text - Moved to left column */}
                <div style={{ marginTop: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Alt image text
                  </label>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="Describe the image for accessibility"
                    className="w-full"
                    data-testid="input-alt-text"
                  />
                </div>
              </div>

              {/* Right Side - Form Fields and Actions */}
              <div style={{
                flex: '1',
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e5e7eb'
              }}>
                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Product Title - Moved to right column */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Product title
                    </label>
                    <Input
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Enter product title"
                      className="w-full"
                      data-testid="input-product-title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Description
                    </label>
                    <Textarea
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Enter product description"
                      rows={3}
                      className="w-full"
                      data-testid="textarea-description"
                    />
                  </div>

                  {/* SEO Metadata */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      SEO metadata
                    </label>
                    <Input
                      value={seoMetadata}
                      onChange={(e) => setSeoMetadata(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="keywords, tags, categories"
                      className="w-full"
                      data-testid="input-seo-metadata"
                    />
                  </div>

                  {/* Attributes */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Attributes
                    </label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="color, size, material, brand"
                      className="w-full"
                      data-testid="input-attributes"
                    />
                  </div>

                  {/* Action Buttons - Moved to right column */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    paddingTop: '20px',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}>
                    <Button
                      onClick={handleExport}
                      className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2 rounded-full flex items-center gap-2"
                      data-testid="button-export-all"
                    >
                      Export assets
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleRandomize}
                      className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
                      data-testid="button-randomize"
                    >
                      <Settings size={16} />
                      Randomize
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard isVisible={showKeyboard} />
      
      {/* Export Modal - Same as canvas.tsx */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="max-w-lg bg-white p-8 z-[80]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center mb-4" style={{ fontFamily: 'Google Sans' }}>
              Download Your Assets
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center text-center">
            {/* QR Component - Same styling as upload page */}
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
              margin: '24px 0'
            }}>
              <QRCode
                value="https://example.com/download-catalog-assets"
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            </div>

            <p style={{
              color: '#5c5c5c',
              fontSize: '16px',
              marginBottom: '24px',
              fontFamily: 'Google Sans'
            }}>
              Scan to download your catalog assets
            </p>

            <Button
              onClick={() => setIsExportModalOpen(false)}
              className="mt-8 bg-[#4285F4] hover:bg-[#3367D6] text-white px-8 py-2 rounded-full"
              data-testid="button-close-export-modal"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}