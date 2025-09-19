import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shuffle, ChevronDown } from "lucide-react";

// Combo Input Component - allows both dropdown selection and manual input
function ComboInput({ label, value, onChange, options, placeholder = "Select or type...", testId }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  testId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative">
      <Label className="text-sm text-gray-600 mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="text-sm h-12 bg-gray-50 pr-8"
          data-testid={testId}
        />
        <ChevronDown 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          data-testid={`chevron-${testId}`}
        />
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onMouseDown={() => handleOptionSelect(option)}
                data-testid={`option-${testId}-${index}`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
  
  // Get workflow type from localStorage
  const workflowType = localStorage.getItem('workflowType') as 'campaign' | 'catalog' || 'campaign';
  
  // Form state
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignType, setCampaignType] = useState(""); // Product Category
  const [campaignKind, setCampaignKind] = useState(""); // Campaign Type (Digital/Physical/Service or Retail/Technology/etc)
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // Dropdown options
  const targetAudienceOptions = ["Millennials", "Gen Z", "Professionals", "Parents", "Seniors", "Students"];
  const productCategoryOptions = ["Electronics", "Fashion", "Home & Garden", "Sports & Fitness", "Health & Beauty", "Automotive", "Food & Beverage", "Books & Media"];
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
        setCampaignType("Electronics");
        setCampaignKind(workflowType === 'campaign' ? "Digital" : "Technology");
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
    setToneOfVoice(randomToneOfVoice);
    setProductDescription(randomDescription);
    
    // Set product category for both workflows
    const randomCampaignType = productCategoryOptions[Math.floor(Math.random() * productCategoryOptions.length)];
    setCampaignType(randomCampaignType);
    
    // Set campaign kind based on workflow
    const campaignKindOptions = workflowType === 'campaign' ? ['Digital', 'Physical', 'Service'] : ['Retail', 'Technology', 'Construction', 'Tools'];
    const randomCampaignKind = campaignKindOptions[Math.floor(Math.random() * campaignKindOptions.length)];
    setCampaignKind(randomCampaignKind);
  };

  const handleCreateCampaign = () => {
    // Store configuration data with workflow-specific fields
    const configData = {
      workflowType,
      targetAudience,
      toneOfVoice,
      productDescription,
      uploadedImage,
      fileName,
      productCategory: campaignType,
      campaignType: campaignKind
    };
    
    localStorage.setItem('campaignConfig', JSON.stringify(configData));
    
    // Navigate directly to canvas page
    navigate('/canvas');
  };

  return (
    <div className="dotted-background overflow-hidden" style={{ height: '100vh' }}>
      {/* Header */}

      {/* Top Navigation */}
      <TopNavigation />
      
      <div className="hidden">
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
      <div className="flex items-start justify-center p-8 pt-8 overflow-y-auto" style={{ height: 'calc(100vh - 120px)', marginTop: '-80px' }}>
        <div className="w-full max-w-none px-16">
          <div className="text-center mb-6">
            <h1 className="text-4xl text-gray-800 mb-2 tracking-tight" style={{ fontWeight: '475' }}>
              Configure
            </h1>
          </div>

          {/* White card container */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - Image */}
              <div className="flex justify-center">
                {uploadedImage && (
                  <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
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
            <div className="space-y-6">
              {/* Form Fields - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-6">
                <ComboInput
                  label="Product Category"
                  value={campaignType}
                  onChange={setCampaignType}
                  options={productCategoryOptions}
                  placeholder="Select or type..."
                  testId="combo-product-category"
                />
                
                <ComboInput
                  label="Target audience"
                  value={targetAudience}
                  onChange={setTargetAudience}
                  options={targetAudienceOptions}
                  placeholder="Select or type..."
                  testId="combo-target-audience"
                />
                
                <ComboInput
                  label="Tone of voice"
                  value={toneOfVoice}
                  onChange={setToneOfVoice}
                  options={toneOfVoiceOptions}
                  placeholder="Select or type..."
                  testId="combo-tone-of-voice"
                />
                
                <ComboInput
                  label="Campaign Type"
                  value={campaignKind}
                  onChange={setCampaignKind}
                  options={workflowType === 'campaign' ? ['Digital', 'Physical', 'Service'] : ['Retail', 'Technology', 'Construction', 'Tools']}
                  placeholder="Select or type..."
                  testId="combo-campaign-type"
                />
              </div>

              {/* Description - Full Width Below */}
              <div>
                <Label htmlFor="product-description" className="text-sm text-gray-600 mb-2 block">
                  Description of your product
                </Label>
                <Textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="AI is analyzing your image..."
                  className="text-sm min-h-20 resize-none bg-gray-50"
                  rows={3}
                  data-testid="textarea-product-description"
                />
              </div>
              
              {/* Buttons Row - Below input */}
              <div className="mt-6 flex gap-4 justify-center">
                <Button
                  onClick={handleCreateCampaign}
                  disabled={!targetAudience || !campaignType || !campaignKind || !toneOfVoice}
                  className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold px-8 py-3 text-lg rounded-full transition-all duration-200"
                  data-testid="button-create-preview"
                >
                  Create campaign
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomizeAll}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50 gap-2 px-6 py-3 text-lg rounded-full"
                  data-testid="button-randomize-all"
                >
                  Randomize all
                </Button>
              </div>
            </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Virtual Keyboard */}
      <VirtualKeyboard />
    </div>
  );
}