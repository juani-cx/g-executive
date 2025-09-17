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
        <div className="flex items-center gap-4">
          <img src="/Google_logo.svg" alt="Google" className="h-10" />
        </div>
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