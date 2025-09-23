import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TopNavigation from "@/components/TopNavigation";
import { ChevronLeft, Settings, Download } from "lucide-react";

export default function CatalogCanvas() {
  const [, navigate] = useLocation();
  
  // SEO form fields
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [seoMetadata, setSeoMetadata] = useState('');
  const [altText, setAltText] = useState('');
  const [tags, setTags] = useState('');

  const handleBack = () => {
    navigate('/upload-catalog');
  };

  const handleExport = () => {
    // Export functionality for catalog
    console.log("Exporting catalog assets...");
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
        padding: '24px 56px',
        boxSizing: 'border-box',
        paddingTop: '0'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          width: '100%'
        }}>
          <h1 style={{
            color: '#000',
            fontFamily: 'Google Sans',
            fontSize: '48px',
            fontWeight: '500',
            lineHeight: '36px',
            margin: 0
          }} data-testid="text-main-title">
            Export assets
          </h1>
          <p style={{
            color: '#5c5c5c',
            fontFamily: 'Google Sans',
            fontSize: '18px',
            fontWeight: '400',
            margin: 0
          }}>
            Review, edit and download your assets
          </p>
        </div>

        {/* Main Canvas Area */}
        <div style={{
          display: 'flex',
          gap: '32px',
          flex: 1,
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Left Side - Video/Image Preview */}
          <div style={{
            flex: '1',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px'
          }}>
            {/* Product Image/Video Display */}
            <div style={{
              width: '100%',
              height: '400px',
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
              textAlign: 'center',
              margin: 0
            }}>
              Product image preview
            </p>
          </div>

          {/* Right Side - SEO Attributes Form */}
          <div style={{
            flex: '1',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '32px',
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
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Optimize your product for search engines and better discoverability
              </p>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Product Title */}
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
                  placeholder="Enter product description"
                  rows={4}
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
                  placeholder="keywords, tags, categories"
                  className="w-full"
                  data-testid="input-seo-metadata"
                />
              </div>

              {/* Alt Text */}
              <div>
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
                  placeholder="Describe the image for accessibility"
                  className="w-full"
                  data-testid="input-alt-text"
                />
              </div>

              {/* Tags */}
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
                  placeholder="color, size, material, brand"
                  className="w-full"
                  data-testid="input-attributes"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
            data-testid="button-back"
          >
            <ChevronLeft size={16} />
            Back
          </Button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              onClick={handleRandomize}
              className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              data-testid="button-randomize"
            >
              <Settings size={16} />
              Randomize
            </Button>
            
            <Button
              onClick={handleExport}
              className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white"
              data-testid="button-export-assets"
            >
              <Download size={16} />
              Export assets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}