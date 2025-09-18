import { useLocation } from "wouter";
import campaignImage from "@assets/campaign_1758139095122.png";
import catalogImage from "@assets/catalog_1758139095122.png";
import TopNavigation from "@/components/TopNavigation";

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
    <div className="dotted-background overflow-hidden" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh'
    }}>
      {/* Top Navigation */}
      <TopNavigation isLandingPage={true} />

      {/* Main Content Container */}
      <div className="flex items-start justify-center p-4 sm:p-8 overflow-y-auto pt-16" style={{ height: 'calc(100vh - 120px)', minHeight: 'auto' }}>
        <div className="w-full max-w-6xl text-center">
          {/* Title Section */}
          <div className="mb-8">
            <h1 
              className="text-6xl text-gray-800 mb-4 tracking-tight"
              style={{ fontWeight: '475' }}
              data-testid="text-main-title"
            >
              Promote your product now
            </h1>
            <p 
              className="text-2xl text-gray-600 mb-16"
              style={{ fontWeight: '400' }}
            >
              Executive campaign AI builder for executive people
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Marketing Campaign Card */}
          <div 
            className="flex-1 cursor-pointer group"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 2px 20px #00000015',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
              maxWidth: '420px',
              margin: '0 auto'
            }}
            onClick={() => handleOptionSelect('marketing')}
            data-testid="card-marketing-option"
          >
            {/* Card Title */}
            <div className="w-full flex justify-center items-center gap-2" style={{
              borderBottom: '2px solid #000',
              paddingBottom: '16px'
            }}>
              <h2 className="flex-1 text-left text-2xl font-medium text-black">
                Marketing<br/>Campaign
              </h2>
            </div>

            {/* Card Content */}
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Image Container */}
              <div className="w-full" style={{
                background: '#e6ebf2',
                borderRadius: '12px',
                height: '240px',
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
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              </div>
              
              {/* Description */}
              <p className="text-lg text-black leading-normal text-left">
                AI transforms your inspiration into complete multi-channel campaigns.
              </p>
            </div>
          </div>

          {/* Catalog Enrichment Card */}
          <div 
            className="flex-1 cursor-pointer group"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 2px 20px #00000015',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
              maxWidth: '420px',
              margin: '0 auto'
            }}
            onClick={() => handleOptionSelect('catalog')}
            data-testid="card-catalog-option"
          >
            {/* Card Title */}
            <div className="w-full flex justify-center items-center gap-2" style={{
              borderBottom: '2px solid #000',
              paddingBottom: '16px'
            }}>
              <h2 className="flex-1 text-left text-2xl font-medium text-black">
                Catalog<br/>Enrichment
              </h2>
            </div>

            {/* Card Content */}
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Image Container */}
              <div className="w-full" style={{
                background: '#e6ebf2',
                borderRadius: '12px',
                height: '240px',
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
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              </div>
              
              {/* Description */}
              <p className="text-lg text-black leading-normal text-left">
                AI generates high-quality SEO metadata instantly.
              </p>
            </div>
          </div>
          </div>
          
          {/* Footer CTA */}
          <p 
            className="text-xl text-gray-600"
            style={{ fontWeight: '400' }}
            data-testid="text-footer-cta"
          >
            Choose an experience to get started
          </p>
        </div>
      </div>
    </div>
  );
}