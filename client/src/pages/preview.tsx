import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Card, CardContent } from "@/components/ui/card";

interface CampaignConfig {
  targetAudience: string;
  campaignType: string;
  toneOfVoice: string;
  productDescription: string;
  uploadedImage: string;
  fileName: string;
}

interface CampaignOption {
  id: string;
  title: string;
  description: string;
  style: string;
}

export default function Preview() {
  const [, navigate] = useLocation();
  const [config, setConfig] = useState<CampaignConfig | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  
  const [campaignOptions] = useState<CampaignOption[]>([
    {
      id: "option1",
      title: "Revolutionize Your Marketing with AI",
      description: "Discover how our AI-powered platform can transform your marketing strategies and drive unprecedented growth.",
      style: "Description"
    },
    {
      id: "option2", 
      title: "Drive Vision",
      description: "Discover how our AI-powered platform can transform your marketing strategies and drive unprecedented growth.",
      style: "Brand vision"
    }
  ]);

  useEffect(() => {
    // Get configuration from localStorage
    const configData = localStorage.getItem('campaignConfig');
    
    if (configData) {
      const parsedConfig = JSON.parse(configData);
      setConfig(parsedConfig);
    } else {
      // No configuration found, redirect back
      navigate('/configure');
    }
  }, [navigate]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleGenerateCampaign = () => {
    if (!selectedOption || !config) return;
    
    const selectedCampaignOption = campaignOptions.find(opt => opt.id === selectedOption);
    
    // Store the final campaign data
    localStorage.setItem('finalCampaign', JSON.stringify({
      ...config,
      selectedOption: selectedCampaignOption
    }));
    
    // Navigate to canvas or final generation page
    navigate('/canvas');
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen max-h-screen dotted-background overflow-hidden">

      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Content */}
      <div className="flex items-start justify-center h-screen max-h-screen p-8 pt-32 overflow-y-auto">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-6xl text-gray-800 mb-4 tracking-tight" style={{ fontWeight: '475' }}>
              Preview
            </h1>
            
            <p className="text-2xl text-gray-600" style={{ fontWeight: '400' }}>
              Discover how our AI-powered platform can transform your marketing strategies and drive<br />
              unprecedented growth.
            </p>
          </div>

          {/* Campaign Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {campaignOptions.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedOption === option.id 
                    ? 'ring-2 ring-[#4285F4] shadow-lg' 
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => handleOptionSelect(option.id)}
                data-testid={`card-option-${option.id}`}
              >
                <CardContent className="p-8">
                  {/* Image - Use different generated images for each option */}
                  <div className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
                    <img 
                      src={option.id === 'option1' ? config.uploadedImage : config.uploadedImage} 
                      alt={`Generated campaign preview ${option.id}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        filter: option.id === 'option1' ? 'sepia(0.3) hue-rotate(200deg)' : 'sepia(0.2) hue-rotate(90deg)'
                      }}
                      data-testid={`img-preview-${option.id}`}
                    />
                  </div>
                  
                  {/* Style Badge */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {option.style}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl text-gray-800 mb-4" style={{ fontWeight: '475' }}>
                    {option.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-base text-gray-600 mb-6" style={{ fontWeight: '400' }}>
                    {option.description}
                  </p>
                  
                  {/* Learn More Button */}
                  <Button 
                    variant="outline" 
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    data-testid={`button-learn-more-${option.id}`}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generate Campaign Button */}
          <div className="text-center">
            <Button
              onClick={handleGenerateCampaign}
              disabled={!selectedOption}
              className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold py-4 px-12 text-xl rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-generate-campaign"
            >
              Generate Campaign
            </Button>
            
            {selectedOption && (
              <p className="text-sm text-gray-600 mt-4" style={{ fontWeight: '400' }}>
                Selected: {campaignOptions.find(opt => opt.id === selectedOption)?.title}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}