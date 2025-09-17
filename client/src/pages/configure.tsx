import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shuffle } from "lucide-react";

// Virtual Keyboard Component
function VirtualKeyboard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in keyboard after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const keyboardKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
    ['↑', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '⌫'],
    ['123?', '◀', '▶', '⎵', '-', '_', '🔍']
  ];

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out z-50 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="p-6" style={{ width: '900px' }}>
        <div className="space-y-3">
          {keyboardKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3">
              {row.map((key, keyIndex) => (
                <div
                  key={keyIndex}
                  className={`
                    bg-white rounded-lg flex items-center justify-center text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200
                    ${key === '⎵' ? 'px-20 py-4' : key === '123?' || key === '🔍' ? 'px-6 py-4' : 'w-14 h-14'}
                    ${key === '↑' || key === '⌫' ? 'text-xl' : 'text-lg'}
                  `}
                  data-testid={`key-${key}`}
                >
                  {key}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Configure() {
  const [, navigate] = useLocation();
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  
  // Form state
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // Dropdown options
  const targetAudienceOptions = ["Millennials", "Gen Z", "Professionals", "Parents", "Seniors", "Students"];
  const campaignTypeOptions = ["Product Launch", "Brand Awareness", "Lead Generation", "Sales Promotion", "Content Marketing", "Social Media"];
  const toneOfVoiceOptions = ["Professional", "Casual", "Friendly", "Authoritative", "Playful", "Luxury"];

  useEffect(() => {
    // Get uploaded image from localStorage
    const imageData = localStorage.getItem('uploadedImage');
    const storedFileName = localStorage.getItem('uploadedFileName');
    
    if (imageData) {
      setUploadedImage(imageData);
      setFileName(storedFileName || 'uploaded-image');
      
      // Simulate AI analysis of the image
      setTimeout(() => {
        setProductDescription(`The image depicts the interior of a car with a focus on the panoramic roof showing a starry night sky.
The text "NOW WITH UFO ROOF" is shown, implying an enhanced or futuristic feature. The branding indicates this is a Honda Passport vehicle`);
        setTargetAudience("Car enthusiasts");
        setCampaignType("Product Launch");
        setToneOfVoice("Playful");
      }, 1500);
    } else {
      // No image uploaded, redirect back
      navigate('/upload');
    }
  }, [navigate]);

  const handleRandomizeAll = () => {
    // Randomly select options from dropdowns
    const randomTargetAudience = targetAudienceOptions[Math.floor(Math.random() * targetAudienceOptions.length)];
    const randomCampaignType = campaignTypeOptions[Math.floor(Math.random() * campaignTypeOptions.length)];
    const randomToneOfVoice = toneOfVoiceOptions[Math.floor(Math.random() * toneOfVoiceOptions.length)];
    
    // Generate random description variations
    const descriptions = [
      "Experience innovation like never before with cutting-edge technology that transforms your daily journey into something extraordinary.",
      "Discover the perfect blend of style, performance, and advanced features designed for the modern lifestyle.",
      "Revolutionary design meets unparalleled functionality in this groundbreaking product that redefines industry standards.",
      "Premium quality and exceptional craftsmanship come together to create an unforgettable experience for discerning customers."
    ];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    setTargetAudience(randomTargetAudience);
    setCampaignType(randomCampaignType);
    setToneOfVoice(randomToneOfVoice);
    setProductDescription(randomDescription);
  };

  const handleCreateCampaign = () => {
    // Store configuration data
    localStorage.setItem('campaignConfig', JSON.stringify({
      targetAudience,
      campaignType,
      toneOfVoice,
      productDescription,
      uploadedImage,
      fileName
    }));
    
    // Navigate to preview page
    navigate('/preview');
  };

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
          onClick={() => navigate('/upload')}
          data-testid="button-back-to-upload"
        >
          Back to home
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-start justify-center p-8 pt-24 pb-80">
        <div className="w-full max-w-none px-16">
          <div className="text-center mb-12">
            <h1 className="text-7xl text-gray-800 mb-6 tracking-tight" style={{ fontWeight: '475' }}>
              Configure
            </h1>
            
            <p className="text-3xl text-gray-600" style={{ fontWeight: '400' }}>
              Executive campaign AI builder for executive people
            </p>
          </div>

          {/* White card container */}
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Image */}
              <div className="flex justify-center">
                {uploadedImage && (
                  <div className="w-full h-80 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded product" 
                      className="w-full h-full object-cover"
                      data-testid="img-uploaded-preview"
                    />
                  </div>
                )}
              </div>

            {/* Right Column - Configuration */}
            <div className="space-y-8">
              {/* Form Fields Row */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="target-audience" className="text-lg text-gray-600 mb-3 block">
                    Target audience
                  </Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger className="text-lg h-14 bg-gray-50" data-testid="select-target-audience">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudienceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="campaign-type" className="text-lg text-gray-600 mb-3 block">
                    Campaign Type
                  </Label>
                  <Select value={campaignType} onValueChange={setCampaignType}>
                    <SelectTrigger className="text-lg h-14 bg-gray-50" data-testid="select-campaign-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tone-of-voice" className="text-lg text-gray-600 mb-3 block">
                    Tone of voice
                  </Label>
                  <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
                    <SelectTrigger className="text-lg h-14 bg-gray-50" data-testid="select-tone-of-voice">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOfVoiceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="product-description" className="text-lg text-gray-600 mb-3 block">
                  Description of your product
                </Label>
                <Textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="AI is analyzing your image..."
                  className="text-lg min-h-24 resize-none bg-gray-50"
                  rows={4}
                  data-testid="textarea-product-description"
                />
              </div>
            </div>
            </div>
            
            {/* Buttons Row - Outside the grid, centered */}
            <div className="mt-12 flex gap-6 justify-center">
              <Button
                onClick={handleCreateCampaign}
                disabled={!targetAudience || !campaignType || !toneOfVoice || !productDescription}
                className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold px-12 py-4 text-xl rounded-full transition-all duration-200"
                data-testid="button-create-preview"
              >
                Create preview
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleRandomizeAll}
                className="text-gray-600 border-gray-300 hover:bg-gray-50 gap-2 px-8 py-4 text-xl rounded-full"
                data-testid="button-randomize-all"
              >
                Randomize all
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Virtual Keyboard */}
      <VirtualKeyboard />
    </div>
  );
}