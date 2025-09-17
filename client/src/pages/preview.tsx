import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
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
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <svg width="150" height="88" viewBox="0 0 249 147" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M106.675 75.4022C106.675 87.1756 97.465 95.8513 86.1618 95.8513C74.8586 95.8513 65.6482 87.1756 65.6482 75.4022C65.6482 63.5458 74.8586 54.9531 86.1618 54.9531C97.465 54.9531 106.675 63.5458 106.675 75.4022ZM97.6955 75.4022C97.6955 68.045 92.3574 63.0111 86.1618 63.0111C79.9662 63.0111 74.6281 68.045 74.6281 75.4022C74.6281 82.6857 79.9662 87.7933 86.1618 87.7933C92.3574 87.7933 97.6955 82.6765 97.6955 75.4022Z" fill="#1E1E1E"/>
          <path d="M150.929 75.4022C150.929 87.1756 141.719 95.8513 130.415 95.8513C119.112 95.8513 109.902 87.1756 109.902 75.4022C109.902 63.555 119.112 54.9531 130.415 54.9531C141.719 54.9531 150.929 63.5458 150.929 75.4022ZM141.949 75.4022C141.949 68.045 136.611 63.0111 130.415 63.0111C124.22 63.0111 118.882 68.045 118.882 75.4022C118.882 82.6857 124.22 87.7933 130.415 87.7933C136.611 87.7933 141.949 82.6765 141.949 75.4022Z" fill="#1E1E1E"/>
          <path d="M193.337 56.1886V92.901C193.337 108.003 184.431 114.171 173.903 114.171C163.991 114.171 158.026 107.542 155.777 102.121L163.595 98.8661C164.987 102.194 168.398 106.122 173.893 106.122C180.633 106.122 184.809 101.964 184.809 94.1364V91.1954H184.496C182.486 93.6754 178.614 95.842 173.727 95.842C163.503 95.842 154.136 86.9359 154.136 75.476C154.136 63.933 163.503 54.9531 173.727 54.9531C178.605 54.9531 182.477 57.1197 184.496 59.526H184.809V56.1978H193.337V56.1886ZM185.446 75.476C185.446 68.2754 180.642 63.0111 174.53 63.0111C168.334 63.0111 163.143 68.2754 163.143 75.476C163.143 82.6027 168.334 87.7933 174.53 87.7933C180.642 87.7933 185.446 82.6027 185.446 75.476Z" fill="#1E1E1E"/>
          <path d="M207.4 34.6689V94.5963H198.641V34.6689H207.4Z" fill="#1E1E1E"/>
          <path d="M241.528 82.131L248.498 86.7777C246.249 90.1059 240.828 95.8405 231.461 95.8405C219.844 95.8405 211.168 86.8606 211.168 75.3915C211.168 63.2308 219.918 54.9424 230.456 54.9424C241.067 54.9424 246.258 63.3875 247.955 67.9512L248.886 70.2746L221.55 81.5962C223.642 85.699 226.897 87.7918 231.461 87.7918C236.034 87.7918 239.205 85.5422 241.528 82.131ZM220.074 74.7737L238.348 67.186C237.343 64.6322 234.319 62.8528 230.76 62.8528C226.196 62.8528 219.844 66.8818 220.074 74.7737Z" fill="#1E1E1E"/>
          <path d="M32.495 70.08V61.4044H61.7303C62.0161 62.9164 62.1636 64.705 62.1636 66.6411C62.1636 73.1501 60.3842 81.1988 54.6497 86.9334C49.0718 92.7418 41.945 95.8396 32.5042 95.8396C15.0054 95.8396 0.290894 81.5861 0.290894 64.0873C0.290894 46.5885 15.0054 32.335 32.5042 32.335C42.1848 32.335 49.081 36.1334 54.2624 41.0844L48.1406 47.2062C44.4251 43.7212 39.3912 41.0106 32.495 41.0106C19.7166 41.0106 9.72254 51.3089 9.72254 64.0873C9.72254 76.8656 19.7166 87.1639 32.495 87.1639C40.7834 87.1639 45.5038 83.8356 48.5278 80.8116C50.9803 78.3592 52.5937 74.8558 53.2298 70.0708L32.495 70.08Z" fill="#1E1E1E"/>
        </svg>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <Button 
          variant="outline" 
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={() => navigate('/configure')}
          data-testid="button-back-to-configure"
        >
          Back to home
        </Button>
      </div>

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