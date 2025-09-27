import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/PageShell";
import { PageTitle } from "@/components/PageTitle";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/ui/form-input";
import { FormLabel } from "@/components/ui/form-label";
import { FormComboInput } from "@/components/ui/form-combo-input";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
// Textarea removed - no longer needed
import { Label } from "@/components/ui/label";
// Note: Select imports removed as we now use InlineComboInput
import { Shuffle, ChevronDown } from "lucide-react";

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
  // Product description removed per new design

  // Dropdown options from attached images
  const targetAudienceOptions = ["Millennials", "Gen Z", "Professionals", "Parents", "Seniors", "Students"];
  const productCategoryOptions = ["Consumer Electronics", "Fashion & Apparel", "Home & Garden", "Sports & Outdoor", "Health & Beauty"];
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
        setTargetAudience("Millennials");
        setCampaignType("Consumer Electronics");
        setCampaignKind(workflowType === 'campaign' ? "Product Launch" : "Technology");
        setToneOfVoice("Professional");
      }, 1500);
    } else {
      // No image uploaded, redirect back
      navigate(`/upload-${workflowType}`);
    }
  }, [navigate]);

  const handleRandomizeAll = () => {
    // Randomly select options from dropdowns
    const randomTargetAudience = targetAudienceOptions[Math.floor(Math.random() * targetAudienceOptions.length)];
    const randomToneOfVoice = toneOfVoiceOptions[Math.floor(Math.random() * toneOfVoiceOptions.length)];
    
    setTargetAudience(randomTargetAudience);
    setToneOfVoice(randomToneOfVoice);
    
    // Set product category for both workflows
    const randomCampaignType = productCategoryOptions[Math.floor(Math.random() * productCategoryOptions.length)];
    setCampaignType(randomCampaignType);
    
    // Set campaign kind based on workflow
    const campaignKindOptions = workflowType === 'campaign' ? ['Product Launch', 'Brand Awareness', 'Lead Generation', 'Sales Promotion', 'Content Marketing', 'Social Media'] : ['Retail', 'Technology', 'Construction', 'Tools'];
    const randomCampaignKind = campaignKindOptions[Math.floor(Math.random() * campaignKindOptions.length)];
    setCampaignKind(randomCampaignKind);
  };

  const handleCreateCampaign = () => {
    // Store configuration data with workflow-specific fields
    const configData = {
      workflowType,
      targetAudience,
      toneOfVoice,
      uploadedImage,
      fileName,
      productCategory: campaignType,
      campaignType: campaignKind
    };
    
    localStorage.setItem('campaignConfig', JSON.stringify(configData));
    
    // Navigate to appropriate destination based on workflow type
    if (workflowType === 'catalog') {
      navigate('/catalog-canvas');
    } else {
      // Campaign workflow goes through loading page
      navigate('/loading');
    }
  };

  return (
    <PageShell
      title="Configure"
      subtitle="Set up your campaign details"
    >
      
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
        <div style={{
          width: '100%',
          textAlign: 'center'
        }}>
          {/* Content Area */}
          <div className="mx-auto" style={{ width: '2000px', maxWidth: '80%' }}>
            {/* White card container */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mx-auto w-full" style={{ height: '840px' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - Image */}
              <div className="flex justify-center">
                {uploadedImage && (
                  <div className="w-full bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center" style={{ height: '380px' }}>
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
            <div className="space-y-2">
              {/* Form Fields - Inline Layout */}
              <div>
                <div className="flex flex-col mb-4">
                  <FormLabel>
                    Product
                  </FormLabel>
                  <FormInput
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    placeholder="Enter product name"
                    data-testid="input-product"
                  />
                </div>
                
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
                  label="Campaign Type"
                  value={campaignKind}
                  onChange={setCampaignKind}
                  options={workflowType === 'campaign' ? ['Product Launch', 'Brand Awareness', 'Lead Generation', 'Sales Promotion', 'Content Marketing', 'Social Media'] : ['Retail', 'Technology', 'Construction', 'Tools']}
                  testId="combo-campaign-type"
                />
              </div>
              
              {/* Buttons Row - Left aligned with more space above */}
              <div className="mt-12 flex gap-4 justify-start">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/upload-' + workflowType)}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full"
                  style={{
                    fontSize: '28px',
                    fontWeight: '500',
                    padding: '16px 36px',
                    height: 'auto',
                    lineHeight: '1.2'
                  }}
                  data-testid="button-back"
                >
                  Back
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomizeAll}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full"
                  style={{
                    fontSize: '28px',
                    fontWeight: '500',
                    padding: '16px 36px',
                    height: 'auto',
                    lineHeight: '1.2'
                  }}
                  data-testid="button-randomize-all"
                >
                  Randomize
                </Button>
                
                <Button
                  onClick={handleCreateCampaign}
                  disabled={!targetAudience || !campaignType || !campaignKind || !toneOfVoice}
                  className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full transition-all duration-200"
                  style={{
                    fontSize: '28px',
                    fontWeight: '500',
                    padding: '16px 36px',
                    height: 'auto',
                    lineHeight: '1.2'
                  }}
                  data-testid="button-create-campaign"
                >
                  Create campaign
                </Button>
              </div>
            </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      
      {/* Virtual Keyboard */}
      <VirtualKeyboard autoShow={true} autoShowDelay={800} bottom="calc(2rem - 35px)" />
    </PageShell>
  );
}