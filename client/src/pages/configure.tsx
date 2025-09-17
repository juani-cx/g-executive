import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Configure() {
  const [, navigate] = useLocation();
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  
  // Form state
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [productDescription, setProductDescription] = useState("");

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
        setCampaignType("Product launch");
        setToneOfVoice("Futuristic");
      }, 1500);
    } else {
      // No image uploaded, redirect back
      navigate('/upload');
    }
  }, [navigate]);

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
      <div className="flex items-start justify-center h-screen max-h-screen p-8 pt-32 overflow-y-auto">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-6xl text-gray-800 mb-4 tracking-tight" style={{ fontWeight: '475' }}>
              Configure
            </h1>
            
            <p className="text-2xl text-gray-600" style={{ fontWeight: '400' }}>
              Executive campaign AI builder for executive people
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Image */}
            <div>
              <h3 className="text-2xl text-gray-800 mb-6" style={{ fontWeight: '475' }}>
                Image uploaded
              </h3>
              
              {uploadedImage && (
                <div className="w-full h-80 bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded product" 
                    className="max-w-full max-h-full object-contain"
                    data-testid="img-uploaded-preview"
                  />
                </div>
              )}
            </div>

            {/* Right Column - Configuration */}
            <div className="space-y-8">
              {/* Form Fields Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="target-audience" className="text-lg text-gray-700 mb-2 block">
                    Target audience
                  </Label>
                  <Input
                    id="target-audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Enter target audience"
                    className="text-base h-12"
                    data-testid="input-target-audience"
                  />
                </div>
                
                <div>
                  <Label htmlFor="campaign-type" className="text-lg text-gray-700 mb-2 block">
                    Campaign Type
                  </Label>
                  <Input
                    id="campaign-type"
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    placeholder="Enter campaign type"
                    className="text-base h-12"
                    data-testid="input-campaign-type"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tone-of-voice" className="text-lg text-gray-700 mb-2 block">
                    Tone of voice
                  </Label>
                  <Input
                    id="tone-of-voice"
                    value={toneOfVoice}
                    onChange={(e) => setToneOfVoice(e.target.value)}
                    placeholder="Enter tone"
                    className="text-base h-12"
                    data-testid="input-tone-of-voice"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="product-description" className="text-lg text-gray-700 mb-2 block">
                  Description of your product
                </Label>
                <Textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="AI is analyzing your image..."
                  className="text-base min-h-32 resize-none"
                  rows={6}
                  data-testid="textarea-product-description"
                />
              </div>

              {/* Create Campaign Button */}
              <div className="pt-4">
                <Button
                  onClick={handleCreateCampaign}
                  disabled={!targetAudience || !campaignType || !toneOfVoice || !productDescription}
                  className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold py-4 text-xl rounded-full transition-all duration-200"
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
  );
}