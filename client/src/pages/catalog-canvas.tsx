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
import { InternalButton } from "@/components/ui/internal-button";


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
      centerContent={false}
      pageBodyClassName="flex flex-col items-start"
      showFooter={false}
    >
        <div style={{
          width: '100%',
          textAlign: 'center'
        }}>
          {/* Export Button */}
          <div className="mb-8">
            <InternalButton
              onClick={handleExport}
              data-testid="button-export-assets"
            >
              Export assets
            </InternalButton>
          </div>

          {/* Content Area - Matching campaign card layout */}
          <div className="mx-auto" style={{ width: "2000px", maxWidth: "80%" }}>
            {/* White card container */}
            <div
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mx-auto w-full"
              style={{ height: "840px" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-full overflow-hidden">
              {/* Left Column - SEO Attributes with Image */}
              <div className="flex justify-center">
                <div className="w-full bg-gray-100 rounded-2xl overflow-hidden flex flex-col p-6" style={{ height: "100%" }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{
                    fontSize: '48px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px',
                    fontFamily: 'Google Sans',
                    textAlign: 'left'
                  }}>
                    SEO Attributes
                  </h2>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '28px',
                    margin: 0,
                    textAlign: 'left',
                    lineHeight: '1.4'
                  }}>
                    Optimize your product for search engines and better discoverability
                  </p>
                </div>

                {/* Product Image/Video Display */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  borderRadius: '8px',
                  marginBottom: '20px',
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
                      fontSize: '24px',
                      fontWeight: '500',
                      color: '#fff',
                      backgroundColor: '#4285F4',
                      padding: '4px 12px',
                      borderRadius: '8px'
                    }}>
                      Ad
                    </span>
                    <span style={{
                      fontSize: '24px',
                      color: '#6b7280'
                    }}>
                      example.com
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '32px',
                    fontWeight: '500',
                    color: '#4285F4',
                    marginBottom: '8px',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}>
                    {productTitle || 'Product Title'}
                  </h3>
                  <p style={{
                    fontSize: '28px',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {productDescription || 'Product description will appear here...'}
                  </p>
                </div>
                </div>
              </div>

              {/* Right Column - Configuration */}
              <div className="space-y-2 overflow-y-auto max-h-full pr-2">
                {/* Form Fields - Passed as children */}
                <div>
                  {/* Product Title - Moved to right column */}
                  <div>
                    <label className="text-gray-600 mb-2 text-left block" style={{
                      fontSize: '26px',
                      lineHeight: '2',
                      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: '400'
                    }}>
                      Product title
                    </label>
                    <Input
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="Enter product title"
                      className="w-full"
                      style={{
                        fontSize: '26px',
                        lineHeight: '2',
                        fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: '400',
                        height: '60px'
                      }}
                      data-testid="input-product-title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-gray-600 mb-2 text-left block" style={{
                      fontSize: '26px',
                      lineHeight: '2',
                      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: '400'
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
                      style={{
                        fontSize: '26px',
                        lineHeight: '2',
                        fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: '400',
                        minHeight: '60px'
                      }}
                      data-testid="textarea-description"
                    />
                  </div>

                  {/* SEO Metadata */}
                  <div>
                    <label className="text-gray-600 mb-2 text-left block" style={{
                      fontSize: '26px',
                      lineHeight: '2',
                      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: '400'
                    }}>
                      SEO metadata
                    </label>
                    <Input
                      value={seoMetadata}
                      onChange={(e) => setSeoMetadata(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="keywords, tags, categories"
                      className="w-full"
                      style={{
                        fontSize: '26px',
                        lineHeight: '2',
                        fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: '400',
                        height: '60px'
                      }}
                      data-testid="input-seo-metadata"
                    />
                  </div>

                  {/* Alt Image Text - Moved from left column */}
                  <div>
                    <label className="text-gray-600 mb-2 text-left block" style={{
                      fontSize: '26px',
                      lineHeight: '2',
                      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: '400'
                    }}>
                      Alt image text
                    </label>
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="Describe the image for accessibility"
                      className="w-full"
                      style={{
                        fontSize: '26px',
                        lineHeight: '2',
                        fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: '400',
                        height: '60px'
                      }}
                      data-testid="input-alt-text"
                    />
                  </div>

                  {/* Attributes */}
                  <div>
                    <label className="text-gray-600 mb-2 text-left block" style={{
                      fontSize: '26px',
                      lineHeight: '2',
                      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: '400'
                    }}>
                      Attributes
                    </label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="color, size, material, brand"
                      className="w-full"
                      style={{
                        fontSize: '26px',
                        lineHeight: '2',
                        fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: '400',
                        height: '60px'
                      }}
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
                      style={{
                        fontSize: "28px",
                        fontWeight: "500",
                        padding: "16px 36px",
                        height: "auto",
                        lineHeight: "1.2",
                      }}
                      data-testid="button-randomize"
                    >
                      <Settings size={16} />
                      Randomize
                    </Button>
                    
                    <Button
                      onClick={handleExport}
                      className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full flex items-center gap-2 transition-all duration-200"
                      style={{
                        fontSize: "28px",
                        fontWeight: "500",
                        padding: "16px 36px",
                        height: "auto",
                        lineHeight: "1.2",
                      }}
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
        </div>
      
      {/* Virtual Keyboard */}
      <VirtualKeyboard isVisible={showKeyboard} usePortal={true} bottom="2rem" />
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
              className="mt-6 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full transition-all duration-200"
              style={{
                fontSize: "28px",
                fontWeight: "500",
                padding: "16px 36px",
                height: "auto",
                lineHeight: "1.2",
              }}
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