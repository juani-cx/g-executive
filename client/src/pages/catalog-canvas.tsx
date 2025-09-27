import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TopNavigation from "@/components/TopNavigation";
import { ChevronLeft, Settings, Download, ZoomIn } from "lucide-react";
import { ExportQRModal } from "@/components/ExportQRModal";
import { PageShell } from "@/components/PageShell";
import { PageTitle } from "@/components/PageTitle";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";


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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Auto-fill form fields when component mounts (simulating AI analysis)
  useEffect(() => {
    // Simulate AI analysis delay and automatically fill the form fields
    setTimeout(() => {
      setProductTitle('Premium Wireless Bluetooth Headphones');
      setProductDescription('Experience superior sound quality with these premium wireless headphones featuring advanced noise cancellation technology, 30-hour battery life, and comfortable over-ear design perfect for music lovers and professionals.');
      setSeoMetadata('wireless headphones, bluetooth, noise cancelling, premium audio, music, professional');
      setAltText('Premium wireless bluetooth headphones with over-ear design and noise cancellation');
      setTags('wireless, bluetooth, headphones, noise-cancelling, premium, black, over-ear, 30hr-battery');
    }, 1500);
  }, []);

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

  // Keyboard stays visible once shown - no blur handling
  const handleInputBlur = () => {
    // Do nothing - keep keyboard visible
  };

  return (
    <PageShell 
      title="Export your assets"
      subtitle="Review, edit and download your assets"
      centerContent={true}
      pageBodyClassName="flex flex-col items-center"
      showFooter={false}
    >
        <div style={{
          width: '100%',
          textAlign: 'center'
        }}>
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
                    fontFamily: 'Google Sans',
                    textAlign: 'left'
                  }}>
                    SEO Attributes
                  </h2>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    margin: 0,
                    textAlign: 'left'
                  }}>
                    Optimize your product for search engines and better discoverability
                  </p>
                </div>

                {/* Product Image/Video Display */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  <img
                    src="/img-refs-catalog/product01.png"
                    alt="Product preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    data-testid="img-product-preview"
                  />
                  {/* Magnify button */}
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: 'none',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    }}
                    data-testid="button-magnify"
                  >
                    <ZoomIn size={16} color="#374151" />
                  </button>
                </div>

                {/* Ad Preview */}
                <div
                  style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  className="text-left">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    gap: '6px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#fff',
                      backgroundColor: '#4285F4',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Ad
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      example.com
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#4285F4',
                    marginBottom: '4px',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}>
                    {productTitle || 'Product Title'}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {productDescription || 'Product description will appear here...'}
                  </p>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Product Title - Moved to right column */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px',
                      textAlign: 'left'
                    }}>
                      Product title
                    </label>
                    <Input
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      onFocus={handleInputFocus}
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
                      marginBottom: '4px',
                      textAlign: 'left'
                    }}>
                      Description
                    </label>
                    <Textarea
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="Enter product description"
                      rows={2}
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
                      marginBottom: '4px',
                      textAlign: 'left'
                    }}>
                      SEO metadata
                    </label>
                    <Input
                      value={seoMetadata}
                      onChange={(e) => setSeoMetadata(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="keywords, tags, categories"
                      className="w-full"
                      data-testid="input-seo-metadata"
                    />
                  </div>

                  {/* Alt Image Text - Moved from left column */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px',
                      textAlign: 'left'
                    }}>
                      Alt image text
                    </label>
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="Describe the image for accessibility"
                      className="w-full"
                      data-testid="input-alt-text"
                    />
                  </div>

                  {/* Attributes */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '4px',
                      textAlign: 'left'
                    }}>
                      Attributes
                    </label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="color, size, material, brand"
                      className="w-full"
                      data-testid="input-attributes"
                    />
                  </div>

                  {/* Action Buttons - Moved to right column */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    paddingTop: '16px',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}>
                    <Button
                      variant="outline"
                      onClick={handleRandomize}
                      className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full"
                      data-testid="button-randomize"
                    >
                      <Settings size={16} />
                      Randomize
                    </Button>
                    
                    <Button
                      onClick={handleExport}
                      className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2 rounded-full flex items-center gap-2"
                      data-testid="button-export-all"
                    >
                      Export assets
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      {/* Virtual Keyboard */}
      <VirtualKeyboard isVisible={showKeyboard} usePortal={true} />
      {/* Export Modal */}
      <ExportQRModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        qrUrl="https://example.com/download-catalog-assets"
        description="Scan to download your catalog assets"
      />
      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl bg-white p-4" style={{ zIndex: 10001 }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '24px', lineHeight: 1, fontWeight: 500, margin: '16px 0 8px', fontFamily: 'Google Sans', textAlign: 'center' }}>
              Product Image
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center">
            <img
              src="/img-refs-catalog/product01.png"
              alt="Product preview - full size"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
              data-testid="img-product-fullsize"
            />
            
            <Button
              onClick={() => setIsImageModalOpen(false)}
              className="mt-6 bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-2 rounded-full"
              data-testid="button-close-image-modal"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}