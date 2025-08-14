import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Sparkles, 
  FileText,
  Target,
  Palette,
  Users,
  Calendar,
  DollarSign,
  ArrowLeft,
  Paperclip,
  X,
  Layers,
  Zap,
  Brain
} from "lucide-react";
import { useLocation } from "wouter";
import MaterialHeader from "@/components/material-header";
import GlassBackground from "@/components/glass-background";
import { MainMenu } from "@/components/main-menu";
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

export default function CampaignGenerator() {
  const [, navigate] = useLocation();
  const [showMainMenu, setShowMainMenu] = useState(false);
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
      // Add a minimum loading time to show the animation (4 seconds)
      const [response] = await Promise.all([
        apiRequest('POST', '/api/create-campaign', campaignData),
        new Promise(resolve => setTimeout(resolve, 4000))
      ]);
      return await response.json();
    },
    onSuccess: (data) => {
      // Navigate to canvas with campaign ID
      navigate(`/canvas/${data.id}`);
    },
    onError: (error) => {
      console.error('Failed to create campaign:', error);
    }
  });

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

  const handleCreateCampaign = () => {
    const campaignData = {
      ...config,
      sourceImage: uploadedImage ? imagePreview : null
    };
    createCampaignMutation.mutate(campaignData);
  };

  const isFormValid = config.name && config.description && config.brandTone && config.targetAudience;

  return (
    <div className="min-h-screen relative">
      <GlassBackground />
      <MaterialHeader onToggleMainMenu={() => setShowMainMenu(!showMainMenu)} />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
                className="glass-surface hover:glass-elevated rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-glass-text-primary">New Campaign</h1>
                <p className="text-glass-text-secondary">Configure your campaign and go directly to canvas</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="glass-surface border-glass-border">
                <CardHeader>
                  <CardTitle className="text-glass-text-primary flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-glass-text-primary">Campaign Name</Label>
                    <Input
                      id="name"
                      value={config.name}
                      onChange={(e) => setConfig(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter campaign name"
                      className="glass-surface border-glass-border text-glass-text-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-glass-text-primary">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe your campaign objectives and key messages"
                      className="glass-surface border-glass-border text-glass-text-primary min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Brand & Audience */}
              <Card className="glass-surface border-glass-border">
                <CardHeader>
                  <CardTitle className="text-glass-text-primary flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Brand & Audience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-glass-text-primary">Brand Tone</Label>
                    <Select value={config.brandTone} onValueChange={(value) => setConfig(prev => ({...prev, brandTone: value}))}>
                      <SelectTrigger className="glass-surface border-glass-border text-glass-text-primary">
                        <SelectValue placeholder="Select brand tone" />
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
                    <Label className="text-glass-text-primary">Target Audience</Label>
                    <Input
                      value={config.targetAudience}
                      onChange={(e) => setConfig(prev => ({...prev, targetAudience: e.target.value}))}
                      placeholder="e.g., Tech professionals, 25-40 years old"
                      className="glass-surface border-glass-border text-glass-text-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Goals */}
              <Card className="glass-surface border-glass-border">
                <CardHeader>
                  <CardTitle className="text-glass-text-primary flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Campaign Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {["Brand Awareness", "Lead Generation", "Sales", "Engagement", "Traffic", "Conversions"].map((goal) => (
                      <Button
                        key={goal}
                        variant={config.campaignGoals.includes(goal) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGoalToggle(goal)}
                        className={`justify-start ${
                          config.campaignGoals.includes(goal) 
                            ? "bg-[rgba(99,102,241,0.2)] text-[#6366f1] border-[rgba(99,102,241,0.3)]" 
                            : "glass-surface border-glass-border text-glass-text-secondary hover:glass-elevated"
                        }`}
                      >
                        {goal}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Platforms */}
              <Card className="glass-surface border-glass-border">
                <CardHeader>
                  <CardTitle className="text-glass-text-primary flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Target Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {["LinkedIn", "Instagram", "Facebook", "Twitter", "Email", "Website"].map((platform) => (
                      <Button
                        key={platform}
                        variant={config.platforms.includes(platform) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`justify-start ${
                          config.platforms.includes(platform) 
                            ? "bg-[rgba(99,102,241,0.2)] text-[#6366f1] border-[rgba(99,102,241,0.3)]" 
                            : "glass-surface border-glass-border text-glass-text-secondary hover:glass-elevated"
                        }`}
                      >
                        {platform}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card className="glass-surface border-glass-border">
                <CardHeader>
                  <CardTitle className="text-glass-text-primary flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Source Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Campaign source" 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-6 h-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-glass-border rounded-lg p-6 text-center cursor-pointer hover:border-[rgba(99,102,241,0.3)] transition-colors"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Paperclip className="w-8 h-8 mx-auto mb-2 text-glass-text-muted" />
                      <p className="text-sm text-glass-text-muted">Click to upload image</p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </CardContent>
              </Card>

              {/* Brand Colors */}
              <Card className="glass-surface border-glass-border">
                <CardHeader>
                  <CardTitle className="text-glass-text-primary flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Brand Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-glass-text-primary">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig(prev => ({...prev, primaryColor: e.target.value}))}
                        className="w-10 h-10 rounded border border-glass-border"
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => setConfig(prev => ({...prev, primaryColor: e.target.value}))}
                        className="glass-surface border-glass-border text-glass-text-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-glass-text-primary">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig(prev => ({...prev, secondaryColor: e.target.value}))}
                        className="w-10 h-10 rounded border border-glass-border"
                      />
                      <Input
                        value={config.secondaryColor}
                        onChange={(e) => setConfig(prev => ({...prev, secondaryColor: e.target.value}))}
                        className="glass-surface border-glass-border text-glass-text-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline & Budget */}
              <Card className="glass-surface border-glass-border">
                <CardHeader>
                  <CardTitle className="text-glass-text-primary flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-glass-text-primary">Timeline</Label>
                    <Select value={config.timeline} onValueChange={(value) => setConfig(prev => ({...prev, timeline: value}))}>
                      <SelectTrigger className="glass-surface border-glass-border text-glass-text-primary">
                        <SelectValue placeholder="Select timeline" />
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
                  <div>
                    <Label className="text-glass-text-primary">Budget Range</Label>
                    <Select value={config.budget} onValueChange={(value) => setConfig(prev => ({...prev, budget: value}))}>
                      <SelectTrigger className="glass-surface border-glass-border text-glass-text-primary">
                        <SelectValue placeholder="Select budget" />
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
                </CardContent>
              </Card>

              {/* Create Campaign Button */}
              <Button 
                onClick={handleCreateCampaign}
                disabled={!isFormValid || createCampaignMutation.isPending}
                className="w-full bg-[rgba(139,92,246,0.9)] hover:bg-[rgba(139,92,246,1)] text-white rounded-2xl py-3 text-sm font-medium transition-all duration-200"
              >
                {createCampaignMutation.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Campaign
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {createCampaignMutation.isPending && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-8">
            {/* Isometric Animation Container */}
            <div className="relative w-64 h-64 mx-auto">
              {/* Video Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-48 h-48 object-contain opacity-90"
                    onError={(e) => {
                      // Hide video and show fallback if it fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  >
                    <source src="/attached_assets/isoG_1755148542335.mp4" type="video/mp4" />
                  </video>
                  {/* Fallback animation if video doesn't load */}
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hidden">
                    <Brain className="w-16 h-16 text-white animate-spin" />
                  </div>
                </div>
              </div>
              
              {/* Subtle glow effect around video */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
              
              {/* Orbiting particles around video */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '6s'}}>
                <div className="absolute -top-16 left-1/2 w-3 h-3 bg-white/60 rounded-full"></div>
                <div className="absolute top-1/2 -right-16 w-2 h-2 bg-purple-400/60 rounded-full"></div>
                <div className="absolute -bottom-16 left-1/2 w-3 h-3 bg-blue-400/60 rounded-full"></div>
                <div className="absolute top-1/2 -left-16 w-2 h-2 bg-cyan-400/60 rounded-full"></div>
              </div>
            </div>
            
            {/* Loading Text with Typewriter Effect */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Preparing Your Canvas</h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="space-y-3 mt-8">
                <div className="flex items-center justify-center space-x-3 text-sm text-white/80 animate-fade-in">
                  <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span>Analyzing campaign configuration</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-white/60 animate-fade-in" style={{animationDelay: '1s'}}>
                  <Layers className="w-4 h-4 text-blue-400 animate-pulse" style={{animationDelay: '1s'}} />
                  <span>Initializing AI workspace</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-white/80 animate-fade-in" style={{animationDelay: '2s'}}>
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" style={{animationDelay: '2s'}} />
                  <span>Setting up asset generation</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-white/80 animate-fade-in" style={{animationDelay: '3s'}}>
                  <Brain className="w-4 h-4 text-green-400 animate-pulse" style={{animationDelay: '3s'}} />
                  <span>Launching your canvas...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu */}
      <MainMenu isOpen={showMainMenu} onOpenChange={setShowMainMenu} />
    </div>
  );
}