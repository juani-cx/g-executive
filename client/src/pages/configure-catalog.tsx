import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FormComboInput } from "@/components/ui/form-combo-input";
import { ConfigurePageLayout } from "@/components/ConfigurePageLayout";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { useKeyboard } from "@/contexts/KeyboardContext";

export default function ConfigureCatalog() {
  const [, navigate] = useLocation();
  const { keyboardEnabled } = useKeyboard();
  
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
    <>
    <ConfigurePageLayout
      title="Configure Catalog"
      subtitle="Define your catalog targets"
      uploadedImage={uploadedImage || undefined}
      onBack={() => navigate('/upload-catalog')}
      onRandomize={handleRandomizeAll}
      onCreate={handleCreateCampaign}
      isCreateDisabled={!targetProduct || !targetAudience || !toneOfVoice || !catalogType}
      backRoute="/upload-catalog"
      createButtonText="Create Campaign"
    >
      {/* Form Fields */}
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
    </ConfigurePageLayout>

    {/* Virtual Keyboard */}
    {keyboardEnabled && (
      <VirtualKeyboard
        autoShow={true}
        autoShowDelay={800}
        bottom="2rem"
      />
    )}
    </>
  );
}