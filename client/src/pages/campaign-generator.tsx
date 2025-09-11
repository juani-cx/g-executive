import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Paperclip,
  X,
  Brain
} from "lucide-react";
import { useLocation } from "wouter";
import GlassBackground from "@/components/glass-background";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CampaignConfig {
  name: string;
  description: string;
  brandTone: string;
  targetAudience: string;
  campaignGoals: string[];
  budget: string;
  timeline: string;
  platforms: string[];
  primaryColor: string;
  secondaryColor: string;
  sourceImage?: File;
}

type Step = 'configure' | 'contextualize' | 'preview';

export default function CampaignGenerator() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('configure');
  const [config, setConfig] = useState<CampaignConfig>({
    name: "",
    description: "",
    brandTone: "",
    targetAudience: "",
    campaignGoals: [],
    budget: "",
    timeline: "",
    platforms: [],
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6"
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const [response] = await Promise.all([
        apiRequest('POST', '/api/create-campaign', campaignData),
        new Promise(resolve => setTimeout(resolve, 4000))
      ]);
      return await response.json();
    },
    onSuccess: (data) => {
      navigate(`/canvas/${data.id}`);
    },
    onError: (error) => {
      console.error('Failed to create campaign:', error);
    }
  });

  const steps: { key: Step; label: string }[] = [
    { key: 'configure', label: 'Configure' },
    { key: 'contextualize', label: 'Contextualize' },
    { key: 'preview', label: 'Preview' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const canGoNext = currentStepIndex < steps.length - 1;
  const canGoPrev = currentStepIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview("");
  };

  const handleGoalToggle = (goal: string) => {
    setConfig(prev => ({
      ...prev,
      campaignGoals: prev.campaignGoals.includes(goal)
        ? prev.campaignGoals.filter(g => g !== goal)
        : [...prev.campaignGoals, goal]
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setConfig(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const randomizeCurrentStep = () => {
    if (currentStep === 'configure') {
      setConfig(prev => ({
        ...prev,
        name: "TechFlow Startup Campaign",
        description: "Launch campaign for innovative SaaS startup targeting tech professionals with modern, clean design approach",
        brandTone: "professional",
        budget: "5k-10k",
        timeline: "1-month"
      }));
    } else if (currentStep === 'contextualize') {
      setConfig(prev => ({
        ...prev,
        targetAudience: "Tech professionals, 25-40 years old, interested in productivity tools",
        campaignGoals: ["Brand Awareness", "Lead Generation", "Traffic"],
        platforms: ["LinkedIn", "Instagram", "Email"]
      }));
    }
  };

  const handleCreateCampaign = () => {
    const campaignData = {
      ...config,
      sourceImage: uploadedImage ? imagePreview : null
    };
    createCampaignMutation.mutate(campaignData);
  };

  const isStepValid = () => {
    if (currentStep === 'configure') {
      return config.name && config.description && config.brandTone;
    }
    if (currentStep === 'contextualize') {
      return config.targetAudience && config.campaignGoals.length > 0;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'configure':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's configure your campaign</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">1. What's your campaign name?</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, name: "TechFlow Startup Campaign"}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-name"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({...prev, name: e.target.value}))}
                  placeholder="Select or Start Typing"
                  className="w-full border border-gray-300 focus:border-blue-500"
                  data-testid="input-campaign-name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">2. Describe your campaign</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, description: "Launch campaign for innovative SaaS startup targeting tech professionals with modern, clean design approach"}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-description"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({...prev, description: e.target.value}))}
                  placeholder="Select or Start Typing"
                  className="w-full min-h-[100px] border border-gray-300 focus:border-blue-500"
                  data-testid="input-campaign-description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">3. What's your brand tone?</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, brandTone: "professional"}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-tone"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <Select value={config.brandTone} onValueChange={(value) => setConfig(prev => ({...prev, brandTone: value}))}>
                  <SelectTrigger className="w-full border border-gray-300 focus:border-blue-500" data-testid="select-brand-tone">
                    <SelectValue placeholder="Select or Start Typing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">4. What's your budget range?</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, budget: "5k-10k"}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-budget"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <Select value={config.budget} onValueChange={(value) => setConfig(prev => ({...prev, budget: value}))}>
                  <SelectTrigger className="w-full border border-gray-300 focus:border-blue-500" data-testid="select-budget">
                    <SelectValue placeholder="Select or Start Typing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1k">Under $1,000</SelectItem>
                    <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="over-25k">Over $25,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">5. What's your timeline?</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, timeline: "1-month"}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-timeline"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <Select value={config.timeline} onValueChange={(value) => setConfig(prev => ({...prev, timeline: value}))}>
                  <SelectTrigger className="w-full border border-gray-300 focus:border-blue-500" data-testid="select-timeline">
                    <SelectValue placeholder="Select or Start Typing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-week">1 Week</SelectItem>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'contextualize':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's contextualize your campaign</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">1. Who's your target audience?</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, targetAudience: "Tech professionals, 25-40 years old, interested in productivity tools"}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-audience"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={config.targetAudience}
                  onChange={(e) => setConfig(prev => ({...prev, targetAudience: e.target.value}))}
                  placeholder="Select or Start Typing"
                  className="w-full border border-gray-300 focus:border-blue-500"
                  data-testid="input-target-audience"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">2. What are your campaign goals?</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, campaignGoals: ["Brand Awareness", "Lead Generation", "Traffic"]}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-goals"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Brand Awareness", "Lead Generation", "Sales", "Engagement", "Traffic", "Conversions"].map((goal) => (
                    <Button
                      key={goal}
                      variant={config.campaignGoals.includes(goal) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleGoalToggle(goal)}
                      className={`justify-start text-sm ${
                        config.campaignGoals.includes(goal) 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                      data-testid={`button-goal-${goal.toLowerCase().replace(' ', '-')}`}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">3. What platforms will you use?</Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setConfig(prev => ({...prev, platforms: ["LinkedIn", "Instagram", "Email"]}))}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    data-testid="button-randomize-platforms"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["LinkedIn", "Instagram", "Facebook", "Twitter", "Email", "Website"].map((platform) => (
                    <Button
                      key={platform}
                      variant={config.platforms.includes(platform) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePlatformToggle(platform)}
                      className={`justify-start text-sm ${
                        config.platforms.includes(platform) 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                      data-testid={`button-platform-${platform.toLowerCase()}`}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">4. Upload source image (optional)</Label>
                </div>
                {imagePreview ? (
                  <div className="relative border-2 border-gray-200 rounded-lg p-4">
                    <img 
                      src={imagePreview} 
                      alt="Campaign source" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-6 h-6"
                      data-testid="button-remove-image"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    data-testid="area-upload-image"
                  >
                    <Paperclip className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  data-testid="input-file-upload"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium">Primary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({...prev, primaryColor: e.target.value}))}
                      className="w-8 h-8 rounded border border-gray-300"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({...prev, primaryColor: e.target.value}))}
                      className="flex-1 border border-gray-300 focus:border-blue-500"
                      data-testid="input-primary-color-text"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Secondary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig(prev => ({...prev, secondaryColor: e.target.value}))}
                      className="w-8 h-8 rounded border border-gray-300"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => setConfig(prev => ({...prev, secondaryColor: e.target.value}))}
                      className="flex-1 border border-gray-300 focus:border-blue-500"
                      data-testid="input-secondary-color-text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Preview your campaign</h2>
              <p className="text-gray-600">Review your configuration before creating the campaign</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Campaign Name</h3>
                <p className="text-gray-600">{config.name || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600">{config.description || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Brand Tone</h3>
                <p className="text-gray-600">{config.brandTone || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Target Audience</h3>
                <p className="text-gray-600">{config.targetAudience || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Campaign Goals</h3>
                <p className="text-gray-600">{config.campaignGoals.length > 0 ? config.campaignGoals.join(", ") : "None selected"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Platforms</h3>
                <p className="text-gray-600">{config.platforms.length > 0 ? config.platforms.join(", ") : "None selected"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Budget & Timeline</h3>
                <p className="text-gray-600">{config.budget || "Not specified"} • {config.timeline || "Not specified"}</p>
              </div>
              {imagePreview && (
                <div>
                  <h3 className="font-semibold text-gray-800">Source Image</h3>
                  <img 
                    src={imagePreview} 
                    alt="Campaign source" 
                    className="w-32 h-32 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GlassBackground />
      
      {/* Top Navigation - Step Indicator */}
      <div className="border-b bg-white/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back arrow, title, and step navigation */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/")}
                  className="hover:bg-gray-100 hover:text-gray-900"
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-800">Create Campaign</h1>
              </div>
              
              <div className="flex items-center space-x-1">
                {steps.map((step, index) => (
                  <div key={step.key} className="flex items-center">
                    <div 
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                        currentStep === step.key 
                          ? 'bg-blue-600 text-white' 
                          : index < currentStepIndex
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      data-testid={`step-${step.key}`}
                    >
                      {step.label}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-4 h-px bg-gray-300 mx-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - How it works button */}
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              data-testid="button-how-it-works"
            >
              How it works
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {renderStepContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {canGoPrev && (
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                  data-testid="button-prev-step"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={randomizeCurrentStep}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                data-testid="button-randomize-all"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize All
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              {canGoNext ? (
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
                  data-testid="button-continue"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleCreateCampaign}
                  disabled={!isStepValid() || createCampaignMutation.isPending}
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
                  data-testid="button-create-campaign"
                >
                  {createCampaignMutation.isPending ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {createCampaignMutation.isPending && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-8">
            <div className="relative w-64 h-64 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-blue-100 border border-gray-200 rounded-2xl flex items-center justify-center">
                    <Brain className="w-16 h-16 text-purple-600 animate-spin" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Preparing Your Canvas</h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}