import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/image-upload";
import AssetPreview from "@/components/asset-preview";
import AIAssistant from "@/components/ai-assistant";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Sparkles, RefreshCw } from "lucide-react";
import { type Campaign } from "@shared/schema";

const BRAND_TONES = [
  "Professional & Trustworthy",
  "Innovative & Bold", 
  "Friendly & Approachable",
  "Luxury & Premium",
  "Energetic & Dynamic"
];

const PLATFORMS = [
  "Instagram",
  "TikTok", 
  "Facebook",
  "LinkedIn"
];

const CAMPAIGN_FOCUS = [
  "Brand Awareness",
  "Lead Generation", 
  "Product Launch"
];

interface CampaignFormData {
  name: string;
  brandTone: string;
  targetPlatforms: string[];
  campaignFocus: string;
}

export default function CampaignGenerator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    brandTone: "",
    targetPlatforms: [],
    campaignFocus: ""
  });
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [previewAssets, setPreviewAssets] = useState<any[]>([]);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Image analysis mutation
  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formDataObj = new FormData();
      formDataObj.append('image', file);
      
      const response = await apiRequest('POST', '/api/analyze-image', formDataObj);
      return response.json();
    },
    onSuccess: (data) => {
      setImageAnalysis(data);
      if (data.suggestedTones?.length > 0) {
        setFormData(prev => ({ ...prev, brandTone: data.suggestedTones[0] }));
      }
      setStep(2);
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Preview generation mutation
  const generatePreviewMutation = useMutation({
    mutationFn: async (previewData: any) => {
      const response = await apiRequest('POST', '/api/generate-preview', previewData);
      return response.json();
    },
    onSuccess: (preview) => {
      setPreviewAssets(preview.assets || []);
      setStep(3);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate preview",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Campaign creation mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const response = await apiRequest('POST', '/api/campaigns', campaignData);
      return response.json();
    },
    onSuccess: (campaign) => {
      setCurrentCampaign(campaign);
      setStep(4);
      // Start final generation
      generateCampaignMutation.mutate({
        campaignId: campaign.id,
        imageBase64: imageAnalysis.imageBase64,
        ...formData
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Campaign generation mutation
  const generateCampaignMutation = useMutation({
    mutationFn: async (generationData: any) => {
      const response = await apiRequest('POST', '/api/generate-campaign', generationData);
      return response.json();
    },
    onSuccess: (campaign) => {
      setCurrentCampaign(campaign);
      setStep(5);
      toast({
        title: "Campaign generated successfully!",
        description: "Your AI-powered marketing campaign is ready.",
      });
      // Redirect to output hub
      setTimeout(() => {
        setLocation(`/output/${campaign.id}`);
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Generation failed", 
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleImageUpload = (file: File, preview: string) => {
    if (file && preview) {
      setUploadedImage({ file, preview });
      analyzeImageMutation.mutate(file);
    } else {
      setUploadedImage(null);
      setImageAnalysis(null);
      setStep(1);
    }
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.brandTone || !formData.campaignFocus || formData.targetPlatforms.length === 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all campaign configuration fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate preview first
    generatePreviewMutation.mutate({
      imageBase64: imageAnalysis.imageBase64,
      brandTone: formData.brandTone,
      targetPlatforms: formData.targetPlatforms,
      campaignFocus: formData.campaignFocus
    });
  };

  const handleApproveAndGenerate = () => {
    if (!imageAnalysis?.imageBase64) {
      toast({
        title: "Missing image data",
        description: "Please re-upload your image and try again.",
        variant: "destructive",
      });
      return;
    }
    
    createCampaignMutation.mutate({
      name: formData.name,
      sourceImageUrl: uploadedImage?.preview || '',
      brandTone: formData.brandTone,
      targetPlatforms: formData.targetPlatforms,
      campaignFocus: formData.campaignFocus,
      status: "draft"
    });
  };

  const getProgressValue = () => {
    switch(step) {
      case 1: return 20;
      case 2: return 40;
      case 3: return 60;
      case 4: return 80;
      case 5: return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-secondary/5">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Progress Header */}
        <Card className="shadow-lg border border-outline-variant mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-on-surface">Campaign Generation</h2>
              <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
                <Sparkles className="text-primary w-4 h-4" />
                <span>AI Assistant Active</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Progress value={getProgressValue()} className="w-full" />
              <div className="flex items-center justify-between text-sm">
                <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 1 ? 'bg-primary text-white' : 'bg-outline-variant text-on-surface-variant'
                  }`}>
                    {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                  </div>
                  <span>Upload</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 2 ? 'bg-primary text-white' : 'bg-outline-variant text-on-surface-variant'
                  } ${step === 2 ? 'animate-pulse-glow' : ''}`}>
                    {step > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
                  </div>
                  <span>Configure</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 3 ? 'bg-primary text-white' : 'bg-outline-variant text-on-surface-variant'
                  } ${step === 3 ? 'animate-pulse-glow' : ''}`}>
                    {step > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
                  </div>
                  <span>Generate</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 3 ? 'bg-primary text-white' : 'bg-outline-variant text-on-surface-variant'
                  } ${step === 3 ? 'animate-pulse-glow' : ''}`}>
                    {step > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
                  </div>
                  <span>Preview</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 4 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 4 ? 'bg-primary text-white' : 'bg-outline-variant text-on-surface-variant'
                  } ${step === 4 ? 'animate-pulse-glow' : ''}`}>
                    {step > 4 ? <CheckCircle className="w-4 h-4" /> : '4'}
                  </div>
                  <span>Generate</span>
                </div>
                <div className={`flex items-center space-x-2 ${step >= 5 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 5 ? 'bg-primary text-white' : 'bg-outline-variant text-on-surface-variant'
                  }`}>
                    {step >= 5 ? <CheckCircle className="w-4 h-4" /> : '5'}
                  </div>
                  <span>Export</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Image Upload/Preview */}
            <Card className="shadow-lg border border-outline-variant">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-on-surface mb-4">Source Image</h3>
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  preview={uploadedImage?.preview}
                />
                {analyzeImageMutation.isPending && (
                  <div className="mt-4 flex items-center space-x-2 text-sm text-on-surface-variant">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing image...</span>
                  </div>
                )}
                {imageAnalysis && (
                  <div className="mt-4 p-3 bg-surface rounded-lg">
                    <p className="text-sm text-on-surface-variant">{imageAnalysis.description}</p>
                    {imageAnalysis.suggestedTones?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-on-surface mb-1">Suggested tones:</p>
                        <div className="flex flex-wrap gap-1">
                          {imageAnalysis.suggestedTones.map((tone: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Configuration */}
            {step >= 2 && (
              <Card className="shadow-lg border border-outline-variant">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-on-surface mb-4">Campaign Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="campaign-name" className="text-sm font-medium text-on-surface">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        placeholder="Enter campaign name..."
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-on-surface">Brand Tone</Label>
                      <Select 
                        value={formData.brandTone} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, brandTone: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select brand tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRAND_TONES.map((tone) => (
                            <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-on-surface mb-2 block">Target Platforms</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PLATFORMS.map((platform) => (
                          <label key={platform} className="flex items-center space-x-2 p-3 border border-outline-variant rounded-xl cursor-pointer hover:bg-surface/50">
                            <Checkbox 
                              checked={formData.targetPlatforms.includes(platform)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    targetPlatforms: [...prev.targetPlatforms, platform] 
                                  }));
                                } else {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    targetPlatforms: prev.targetPlatforms.filter(p => p !== platform) 
                                  }));
                                }
                              }}
                            />
                            <span className="text-sm">{platform}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-on-surface mb-2 block">Campaign Focus</Label>
                      <RadioGroup 
                        value={formData.campaignFocus} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, campaignFocus: value }))}
                      >
                        {CAMPAIGN_FOCUS.map((focus) => (
                          <div key={focus} className="flex items-center space-x-2">
                            <RadioGroupItem value={focus} id={focus} />
                            <Label htmlFor={focus} className="text-sm">{focus}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <Button 
                    onClick={handleFormSubmit}
                    disabled={generatePreviewMutation.isPending || step >= 3}
                    className="w-full mt-6 bg-primary text-white hover:shadow-lg"
                  >
                    {generatePreviewMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating Preview...
                      </>
                    ) : (
                      'Generate Preview'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Preview Approval Step */}
            {step === 3 && (
              <Card className="shadow-lg border border-outline-variant">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-on-surface mb-4">Preview Assets</h3>
                  <p className="text-sm text-on-surface-variant mb-4">
                    Review the AI-generated content preview below. You can approve to create the final campaign or go back to modify settings.
                  </p>
                  
                  <div className="space-y-4">
                    <Button 
                      onClick={handleApproveAndGenerate}
                      disabled={createCampaignMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {createCampaignMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Creating Campaign...
                        </>
                      ) : (
                        'Approve & Generate Final Campaign'
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="w-full"
                    >
                      Back to Modify Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Preview Canvas */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-outline-variant h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-on-surface">AI Asset Preview</h3>
                  {step === 3 && generateCampaignMutation.isPending && (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="text-primary w-4 h-4 animate-spin" />
                      <span className="text-sm text-on-surface-variant">Generating...</span>
                    </div>
                  )}
                </div>

                {step === 3 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Preview Mode</h4>
                      <p className="text-sm text-blue-800">This is a quick preview of your campaign assets. Approve to generate the final high-quality versions.</p>
                    </div>
                    <AssetPreview 
                      assets={previewAssets}
                      isLoading={generatePreviewMutation.isPending}
                    />
                  </div>
                ) : step >= 4 ? (
                  <div>
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Final Campaign Generated!</h4>
                      <p className="text-sm text-green-800">
                        {currentCampaign?.generatedAssets?.length || 0} assets created with DALL-E
                      </p>
                      {currentCampaign?.generatedAssets?.length === 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          Debug: No assets found. Check console for generation errors.
                        </p>
                      )}
                    </div>
                    <AssetPreview 
                      assets={currentCampaign?.generatedAssets || []}
                      isLoading={generateCampaignMutation.isPending}
                    />
                    {/* Debug Info */}
                    <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                      <details>
                        <summary>Debug: Campaign Data</summary>
                        <pre className="mt-2 overflow-auto max-h-32">
                          {JSON.stringify(currentCampaign?.generatedAssets, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-on-surface-variant">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Configure your campaign to see AI-generated preview</p>
                    </div>
                  </div>
                )}

                {/* AI Assistant */}
                {step >= 2 && (
                  <div className="mt-8 border-t border-outline-variant pt-6">
                    <AIAssistant 
                      suggestions={[
                        "Make the copy more energetic",
                        "Focus on B2B messaging", 
                        "Add urgency to the CTA",
                        "Create more visual variants"
                      ]}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
