import { useLocation } from "wouter";
import campaignImage from "@assets/campaign_1758139095122.png";
import catalogImage from "@assets/catalog_1758139095122.png";
import TopNavigation from "@/components/TopNavigation";

export default function Landing() {
  const [, navigate] = useLocation();

  const handleOptionSelect = (optionType: 'marketing' | 'catalog') => {
    // Store the selected type
    localStorage.setItem('selectedAppType', optionType);
    localStorage.setItem('workflowType', optionType === 'marketing' ? 'campaign' : 'catalog');
    
    if (optionType === 'marketing') {
      // Navigate to the campaign upload page
      navigate('/upload-campaign');
    } else {
      // Navigate to the catalog upload page
      navigate('/upload-catalog');
    }
  };

  return (
    <div className="dotted-background" style={{ 
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Navigation */}
      <TopNavigation isLandingPage={true} />

      {/* Main Container - Fixed dimensions based on Figma */}
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
        
        {/* Title Section - Reduced spacing */}
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
            Promote your product now
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
            Executive campaign AI builder for executive people
          </p>
        </div>

        {/* Content Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '52px',
          width: '100%',
          maxWidth: '1006px',
          flex: 1
        }}>
          
          {/* Cards Container */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '52px',
            width: '100%',
            justifyContent: 'center'
          }}>
            
            {/* Marketing Campaign Card */}
            <div 
              style={{
                background: '#fff',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                flex: '1 0 0',
                alignItems: 'flex-start',
                gap: '24px',
                width: '100%',
                minHeight: '74px',
                padding: '40px 24px',
                boxShadow: '0 1px 20px #00000029',
                cursor: 'pointer',
                maxWidth: '477px'
              }}
              onClick={() => handleOptionSelect('marketing')}
              data-testid="card-marketing-option"
            >
              {/* Card Header */}
              <div style={{
                borderBottom: '1.5px solid #000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                width: '100%',
                paddingBottom: '24px',
                boxSizing: 'border-box'
              }}>
                <span style={{
                  color: '#000',
                  flex: '1 0 0',
                  fontFamily: 'Google Sans',
                  fontSize: '28px',
                  fontWeight: '500',
                  lineHeight: '27.5px'
                }}>Marketing<br/>Campaign</span>
              </div>

              {/* Card Content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '16px',
                width: '100%'
              }}>
                {/* Image Container */}
                <div style={{
                  background: '#e6ebf2',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '200px', // Reduced height
                  paddingBottom: '4px',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}>
                  <img 
                    src={campaignImage} 
                    alt="Marketing Campaign"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      maxHeight: '100%'
                    }}
                  />
                </div>
                
                {/* Description */}
                <span style={{
                  color: '#000',
                  fontFamily: 'Google Sans',
                  fontSize: '24px',
                  fontWeight: '400',
                  lineHeight: '28px'
                }}>
                  AI transforms your inspiration into complete multi-channel campaigns.
                </span>
              </div>
            </div>

            {/* Catalog Enrichment Card */}
            <div 
              style={{
                background: '#fff',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                flex: '1 0 0',
                alignItems: 'flex-start',
                gap: '24px',
                width: '100%',
                minHeight: '74px',
                padding: '40px 24px',
                boxShadow: '0 1px 20px #00000029',
                cursor: 'pointer',
                maxWidth: '477px'
              }}
              onClick={() => handleOptionSelect('catalog')}
              data-testid="card-catalog-option"
            >
              {/* Card Header */}
              <div style={{
                borderBottom: '1.5px solid #000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                width: '100%',
                paddingBottom: '24px',
                boxSizing: 'border-box'
              }}>
                <span style={{
                  color: '#000',
                  flex: '1 0 0',
                  fontFamily: 'Google Sans',
                  fontSize: '28px',
                  fontWeight: '500',
                  lineHeight: '27.5px'
                }}>Catalog<br/>Enrichment</span>
              </div>

              {/* Card Content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '16px',
                width: '100%'
              }}>
                {/* Image Container */}
                <div style={{
                  background: '#e6ebf2',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '200px', // Reduced height
                  paddingBottom: '4px',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}>
                  <img 
                    src={catalogImage} 
                    alt="Catalog Enrichment"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      maxHeight: '100%'
                    }}
                  />
                </div>
                
                {/* Description */}
                <span style={{
                  color: '#000',
                  fontFamily: 'Google Sans',
                  fontSize: '24px',
                  fontWeight: '400',
                  lineHeight: '28px'
                }}>
                  AI generates high-quality SEO metadata instantly.
                </span>
              </div>
            </div>
          </div>
          
          {/* Footer CTA */}
          <div style={{
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '6px 20px',
            boxSizing: 'border-box'
          }}>
            <span style={{
              color: '#5c5c5c',
              fontFamily: 'Google Sans',
              fontSize: '24px',
              fontWeight: '400',
              lineHeight: '28px'
            }} data-testid="text-footer-cta">
              Choose an experience to get started
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}