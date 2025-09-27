import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/PageShell";
import { PageTitle } from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/ui/form-input";
import { FormLabel } from "@/components/ui/form-label";
import { FormComboInput } from "@/components/ui/form-combo-input";
import { Label } from "@/components/ui/label";
import { Shuffle, ChevronDown } from "lucide-react";


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
    <div className={`virtual-keyboard fixed left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out z-[50] ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`} style={{ bottom: 'calc(2rem - 35px)' }}>
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

export default function ConfigureCatalog() {
  const [, navigate] = useLocation();
  
  // State for catalog-specific fields
  const [targetProduct, setTargetProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [catalogType, setCatalogType] = useState("");
  
  // Get uploaded image and data from localStorage
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage');
    const storedFileName = localStorage.getItem('uploadedFileName') || 'uploaded-image.jpg';
    
    // Ensure workflowType is set for loading page routing
    localStorage.setItem('workflowType', 'catalog');
    
    if (storedImage) {
      setUploadedImage(storedImage);
      setFileName(storedFileName);
      
      // Simulate AI analysis of the image and auto-prefill fields
      setTimeout(() => {
        setTargetProduct("Fashion & Apparel");
        setTargetAudience("Millennials");
        setToneOfVoice("Professional");
        setCatalogType("Product Photography");
      }, 1500);
    }
    // Allow proceeding without image for card selection and AI generate paths
  }, [navigate]);

  // Catalog-specific options from attached images
  const targetProductOptions = [
    "Consumer Electronics", "Fashion & Apparel", "Home & Garden", "Sports & Outdoor", "Health & Beauty"
  ];

  const targetAudienceOptions = [
    "Millennials", "Gen Z", "Professionals", "Parents", "Seniors", "Students"
  ];

  const toneOfVoiceOptions = [
    "Professional", "Casual", "Friendly", "Authoritative", "Playful", "Luxury"
  ];

  const catalogTypeOptions = [
    "Product Photography", "Portrait Photography", "Lifestyle Photography", "Commercial Photography", "Fashion Photography", "Food Photography", "Event Photography", "Architectural Photography"
  ];

  const handleRandomizeAll = () => {
    // Randomly select options from dropdowns
    const randomTargetProduct = targetProductOptions[Math.floor(Math.random() * targetProductOptions.length)];
    const randomTargetAudience = targetAudienceOptions[Math.floor(Math.random() * targetAudienceOptions.length)];
    const randomToneOfVoice = toneOfVoiceOptions[Math.floor(Math.random() * toneOfVoiceOptions.length)];
    const randomCatalogType = catalogTypeOptions[Math.floor(Math.random() * catalogTypeOptions.length)];
    
    setTargetProduct(randomTargetProduct);
    setTargetAudience(randomTargetAudience);
    setToneOfVoice(randomToneOfVoice);
    setCatalogType(randomCatalogType);
  };

  const handleCreateCampaign = () => {
    // Store configuration data for catalog workflow
    const configData = {
      workflowType: 'catalog',
      targetProduct,
      targetAudience,
      toneOfVoice,
      catalogType,
      uploadedImage,
      fileName
    };
    
    localStorage.setItem('catalogConfig', JSON.stringify(configData));
    
    // Navigate to loading page which will then go to catalog-canvas
    navigate('/loading');
  };

  return (
    <PageShell>
      
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 56px',
        paddingTop: '0',
        boxSizing: 'border-box'
      }}>
        <div className="hidden">
          <Button 
            variant="outline" 
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
            onClick={() => navigate('/upload-catalog')}
            data-testid="button-back-to-upload"
          >
            Back to home
          </Button>
        </div>

        {/* Main Content - Responsive Centered */}
        <div style={{
          width: '100%',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0',
          boxSizing: 'border-box',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '100%',
            textAlign: 'center'
          }}>
          {/* Header - Using PageTitle component */}
          <PageTitle
            title="Configure Catalog"
            subtitle="Define your catalog targets"
            className="flex flex-col justify-center items-center gap-4 w-full max-w-7xl"
          />

          {/* Content Area */}
          <div className="max-w-6xl mx-auto">
            {/* White card container */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - Image */}
              <div className="flex justify-center">
                <div className="w-full bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center" style={{ height: '380px' }}>
                  {uploadedImage ? (
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded product" 
                      className="w-full h-full object-cover"
                      data-testid="img-uploaded-preview"
                    />
                  ) : (
                    <div className="text-gray-500 text-center p-4" data-testid="text-no-image">
                      <div className="text-4xl mb-2">📋</div>
                      <div>Ready to configure catalog</div>
                    </div>
                  )}
                </div>
              </div>

            {/* Right Column - Configuration */}
            <div className="space-y-2">
              {/* Form Fields - Inline Layout */}
              <div>
                <FormComboInput
                  label="Target product"
                  value={targetProduct}
                  onChange={setTargetProduct}
                  options={targetProductOptions}
                  testId="combo-target-product"
                />
                
                <FormComboInput
                  label="Target audience"
                  value={targetAudience}
                  onChange={setTargetAudience}
                  options={targetAudienceOptions}
                  testId="combo-target-audience"
                />
                
                <FormComboInput
                  label="Tone of voice"
                  value={toneOfVoice}
                  onChange={setToneOfVoice}
                  options={toneOfVoiceOptions}
                  testId="combo-tone-of-voice"
                />
                
                <FormComboInput
                  label="Photography type"
                  value={catalogType}
                  onChange={setCatalogType}
                  options={catalogTypeOptions}
                  testId="combo-catalog-type"
                />
              </div>
              
              {/* Buttons Row - Left aligned with more space above */}
              <div className="mt-12 flex gap-4 justify-start">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/upload-catalog')}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-full"
                  data-testid="button-back"
                >
                  Back
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomizeAll}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-full"
                  data-testid="button-randomize-all"
                >
                  Randomize
                </Button>
                
                <Button
                  onClick={handleCreateCampaign}
                  disabled={!targetProduct || !targetAudience || !toneOfVoice || !catalogType}
                  className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold px-8 py-2 rounded-full transition-all duration-200"
                  data-testid="button-create-campaign"
                >
                  Create Campaign
                </Button>
              </div>
            </div>
          </div>
          </div>
          </div>
          </div>
        </div>
        </div>
        
        {/* Virtual Keyboard */}
        <VirtualKeyboard />
    </PageShell>
  );
}