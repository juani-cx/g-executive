import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import campaignImage from "@assets/campaign_1758138693441.png";
import catalogImage from "@assets/catalog_1758138693441.png";
import Logo from "@/components/Logo";

export default function Landing() {
  const [, navigate] = useLocation();

  const handleOptionSelect = (optionType: 'marketing' | 'catalog') => {
    // Store the selected type
    localStorage.setItem('selectedAppType', optionType);
    
    if (optionType === 'marketing') {
      // Navigate to the upload flow for marketing campaigns
      navigate('/upload');
    } else {
      // Navigate to the existing prompt input screen for catalog
      navigate('/prompt-input');
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '48px 112px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '104px'
    }}>
      {/* Header */}
      <div className="w-full flex justify-between items-center" style={{
        borderBottom: '1px solid #e5e8eb',
        borderRadius: '24px',
        padding: '12px 0'
      }}>
        {/* Google Logo */}
        <div className="relative">
          <Logo />
        </div>
        
        {/* Right side - How it works button and settings */}
        <div className="flex items-center gap-20">
          <Button 
            variant="outline"
            className="rounded-full border-4 text-[30px] font-medium leading-[36px] text-[#1f2937]"
            style={{
              borderColor: '#bec6d1b3',
              padding: '32px 115.702px'
            }}
            onClick={() => console.log('How it works clicked')}
            data-testid="button-how-it-works"
          >
            How it works
          </Button>
          <Settings className="w-20 h-20 text-gray-600" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center gap-[136px] max-w-screen-2xl mx-auto" style={{ padding: '16px 0 24px' }}>
        {/* Title Section */}
        <div className="flex flex-col justify-center items-center gap-8 w-full">
          <h1 
            className="text-center font-bold leading-[72px]" 
            style={{
              color: '#000',
              fontSize: '96px',
              fontWeight: '700'
            }}
            data-testid="text-main-title"
          >
            Promote your product now
          </h1>
          <p className="text-center" style={{
            color: '#5c5c5c',
            fontSize: '48px',
            fontWeight: '400',
            lineHeight: '56px'
          }}>
            Executive campaign AI builder for executive people
          </p>
        </div>

        {/* Cards Container */}
        <div className="flex items-start gap-[104px] w-full">
          {/* Marketing Campaign Card */}
          <div 
            className="flex-1 cursor-pointer group"
            style={{
              background: '#ffffff',
              borderRadius: '48px',
              boxShadow: '0 2px 40px #00000029',
              padding: '80px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '48px'
            }}
            onClick={() => handleOptionSelect('marketing')}
            data-testid="card-marketing-option"
          >
            {/* Card Title */}
            <div className="w-full flex justify-center items-center gap-2" style={{
              borderBottom: '3px solid #000',
              paddingBottom: '48px'
            }}>
              <h2 className="flex-1 text-center" style={{
                color: '#000',
                fontSize: '56px',
                fontWeight: '500',
                lineHeight: '55px'
              }}>
                Marketing
                Campaign
              </h2>
            </div>

            {/* Card Content */}
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Image Container */}
              <div className="w-full" style={{
                background: '#ffffff',
                borderRadius: '24px',
                height: '599px',
                paddingBottom: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={campaignImage} 
                  alt="Marketing Campaign"
                  className="object-contain"
                  style={{
                    width: '702px',
                    height: '591px'
                  }}
                />
              </div>
              
              {/* Description */}
              <p style={{
                color: '#000',
                width: '816px',
                fontSize: '48px',
                fontWeight: '400',
                lineHeight: '56px'
              }}>
                AI transforms your inspiration into complete multi-channel campaigns.
              </p>
            </div>
          </div>

          {/* Catalog Enrichment Card */}
          <div 
            className="flex-1 cursor-pointer group"
            style={{
              background: '#ffffff',
              borderRadius: '48px',
              boxShadow: '0 2px 40px #00000029',
              padding: '80px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '48px'
            }}
            onClick={() => handleOptionSelect('catalog')}
            data-testid="card-catalog-option"
          >
            {/* Card Title */}
            <div className="w-full flex justify-center items-center gap-2" style={{
              borderBottom: '3px solid #000',
              paddingBottom: '48px'
            }}>
              <h2 className="flex-1 text-center" style={{
                color: '#000',
                fontSize: '56px',
                fontWeight: '500',
                lineHeight: '55px'
              }}>
                Catalog
                Enrichment
              </h2>
            </div>

            {/* Card Content */}
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Image Container */}
              <div className="w-full" style={{
                background: '#ffffff',
                borderRadius: '24px',
                height: '599px',
                paddingBottom: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={catalogImage} 
                  alt="Catalog Enrichment"
                  className="object-contain"
                  style={{
                    height: '621.419px'
                  }}
                />
              </div>
              
              {/* Description */}
              <p style={{
                color: '#000',
                width: '681px',
                fontSize: '48px',
                fontWeight: '400',
                lineHeight: '56px'
              }}>
                AI generates high-quality SEO metadata instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex justify-center items-center" style={{
        background: '#fff3',
        borderBottom: '1px solid #e5e8eb',
        borderRadius: '24px',
        padding: '12px 40px'
      }}>
        <p 
          style={{
            color: '#5c5c5c',
            fontSize: '48px',
            fontWeight: '400',
            lineHeight: '56px'
          }}
          data-testid="text-footer-cta"
        >
          Choose an experience to get started
        </p>
      </div>
    </div>
  );
}