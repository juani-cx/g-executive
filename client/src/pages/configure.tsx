import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FormInput } from "@/components/ui/form-input";
import { FormLabel } from "@/components/ui/form-label";
import { FormComboInput } from "@/components/ui/form-combo-input";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { ConfigurePageLayout } from "@/components/ConfigurePageLayout";

export default function Configure() {
  const [, navigate] = useLocation();
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  // Get workflow type from localStorage
  const workflowType =
    (localStorage.getItem("workflowType") as "campaign" | "catalog") ||
    "campaign";

  // Form state
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignType, setCampaignType] = useState(""); // Product Category
  const [campaignKind, setCampaignKind] = useState(""); // Campaign Type (Digital/Physical/Service or Retail/Technology/etc)
  const [toneOfVoice, setToneOfVoice] = useState("");
  // Product description removed per new design

  // Dropdown options from attached images
  const targetAudienceOptions = [
    "Millennials",
    "Gen Z",
    "Professionals",
    "Parents",
    "Seniors",
    "Students",
  ];
  const productCategoryOptions = [
    "Consumer Electronics",
    "Fashion & Apparel",
    "Home & Garden",
    "Sports & Outdoor",
    "Health & Beauty",
  ];
  const toneOfVoiceOptions = [
    "Professional",
    "Casual",
    "Friendly",
    "Authoritative",
    "Playful",
    "Luxury",
  ];

  useEffect(() => {
    // Get uploaded image from localStorage
    const imageData = localStorage.getItem("uploadedImage");
    const storedFileName = localStorage.getItem("uploadedFileName");

    if (imageData) {
      setUploadedImage(imageData);
      setFileName(storedFileName || "uploaded-image");

      // Simulate AI analysis of the image
      setTimeout(() => {
        setTargetAudience("Millennials");
        setCampaignType("Consumer Electronics");
        setCampaignKind(
          workflowType === "campaign" ? "Product Launch" : "Technology",
        );
        setToneOfVoice("Professional");
      }, 1500);
    } else {
      // No image uploaded, redirect back
      navigate(`/upload-${workflowType}`);
    }
  }, [navigate]);

  const handleRandomizeAll = () => {
    // Randomly select options from dropdowns
    const randomTargetAudience =
      targetAudienceOptions[
        Math.floor(Math.random() * targetAudienceOptions.length)
      ];
    const randomToneOfVoice =
      toneOfVoiceOptions[Math.floor(Math.random() * toneOfVoiceOptions.length)];

    setTargetAudience(randomTargetAudience);
    setToneOfVoice(randomToneOfVoice);

    // Set product category for both workflows
    const randomCampaignType =
      productCategoryOptions[
        Math.floor(Math.random() * productCategoryOptions.length)
      ];
    setCampaignType(randomCampaignType);

    // Set campaign kind based on workflow
    const campaignKindOptions =
      workflowType === "campaign"
        ? [
            "Product Launch",
            "Brand Awareness",
            "Lead Generation",
            "Sales Promotion",
            "Content Marketing",
            "Social Media",
          ]
        : ["Retail", "Technology", "Construction", "Tools"];
    const randomCampaignKind =
      campaignKindOptions[
        Math.floor(Math.random() * campaignKindOptions.length)
      ];
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
      campaignType: campaignKind,
    };

    localStorage.setItem("campaignConfig", JSON.stringify(configData));

    // Navigate to appropriate destination based on workflow type
    if (workflowType === "catalog") {
      navigate("/catalog-canvas");
    } else {
      // Campaign workflow goes through loading page
      navigate("/loading");
    }
  };

  return (
    <>
    <ConfigurePageLayout
      title="Configure"
      subtitle="Set up your campaign details"
      uploadedImage={uploadedImage}
      onBack={() => navigate(`/upload-${workflowType}`)}
      onRandomize={handleRandomizeAll}
      onCreate={handleCreateCampaign}
      isCreateDisabled={
        !targetAudience ||
        !campaignType ||
        !campaignKind ||
        !toneOfVoice
      }
      backRoute={`/upload-${workflowType}`}
      createButtonText="Create campaign"
    >
      {/* Form Fields */}
      <div className="flex flex-col mb-4">
        <FormLabel>Product</FormLabel>
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
        options={
          workflowType === "campaign"
            ? [
                "Product Launch",
                "Brand Awareness",
                "Lead Generation",
                "Sales Promotion",
                "Content Marketing",
                "Social Media",
              ]
            : ["Retail", "Technology", "Construction", "Tools"]
        }
        testId="combo-campaign-type"
      />
    </ConfigurePageLayout>

    {/* Virtual Keyboard */}
    <VirtualKeyboard
      autoShow={true}
      autoShowDelay={800}
      bottom="calc(2rem - 35px)"
    />
    </>
  );
}
