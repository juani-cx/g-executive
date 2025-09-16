import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Mic } from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

export default function PromptInput() {
  const [, navigate] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [appType, setAppType] = useState<'marketing' | 'catalog'>('marketing');
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Get the selected app type and saved values from localStorage
  useEffect(() => {
    const selectedType = localStorage.getItem('selectedAppType') as 'marketing' | 'catalog';
    if (selectedType) {
      setAppType(selectedType);
    }
    
    // Restore saved selector values
    const savedAudience = localStorage.getItem('targetAudience');
    const savedCampaignType = localStorage.getItem('campaignType');
    const savedToneOfVoice = localStorage.getItem('toneOfVoice');
    
    if (savedAudience) setTargetAudience(savedAudience);
    if (savedCampaignType) setCampaignType(savedCampaignType);
    if (savedToneOfVoice) setToneOfVoice(savedToneOfVoice);
  }, []);

  const handleClear = () => {
    setPrompt("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      // Store image in localStorage (in a real app, you'd upload to a server)
      localStorage.setItem('uploadedImageName', file.name);
    }
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      // Store all form data for the canvas
      localStorage.setItem('campaignPrompt', prompt.trim());
      localStorage.setItem('selectedAppType', appType);
      localStorage.setItem('targetAudience', targetAudience);
      localStorage.setItem('campaignType', campaignType);
      localStorage.setItem('toneOfVoice', toneOfVoice);
      
      // Navigate to canvas
      navigate('/canvas');
    }
  };

  // Save selector values to localStorage as user changes them
  const handleAudienceChange = (value: string) => {
    setTargetAudience(value);
    localStorage.setItem('targetAudience', value);
  };
  
  const handleCampaignTypeChange = (value: string) => {
    setCampaignType(value);
    localStorage.setItem('campaignType', value);
  };
  
  const handleToneChange = (value: string) => {
    setToneOfVoice(value);
    localStorage.setItem('toneOfVoice', value);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <motion.div 
      className="min-h-screen relative dotted-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <main className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Promote your product now
            </h1>
            <p className="text-lg text-gray-600">
              Add a brief description to create your campaign
            </p>
          </motion.div>

          {/* Main input form - Clean without card background */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            
            {/* Large text input area with icons */}
            <div className="mb-8 relative">
              <textarea
                placeholder="Type your product description here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-48 bg-white dark:bg-black rounded-2xl text-lg p-6 pb-16 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none overflow-hidden border border-[#cbcbcb] dark:border-neutral-700"
                style={{}}
                data-testid="textarea-prompt"
              />
              
              {/* Icons inside textarea */}
              <div className="absolute bottom-4 left-6 flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
                  <DialogTrigger asChild>
                    <button 
                      className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded flex items-center justify-center transition-colors"
                      data-testid="button-upload"
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white border border-[#cbcbcb] opacity-100">
                    <DialogHeader>
                      <DialogTitle className="text-center">Scan this code to upload your image</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white p-6 rounded-lg border border-[#cbcbcb]">
                        <QRCode 
                          value={`${window.location.origin}/prompt-input`} 
                          size={200}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />
                      </div>
                      <p className="text-center text-gray-600">Scan the QR code to visit our upload service</p>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <span className="text-gray-400 text-sm">or</span>
                
                <button 
                  className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center justify-center transition-colors"
                  data-testid="button-mic"
                >
                  <Mic className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {uploadedImage && (
                <p className="text-sm text-green-600 mt-2">
                  Image uploaded: {uploadedImage.name}
                </p>
              )}
            </div>
          </motion.div>

          {/* Three Selectors */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <Select value={targetAudience} onValueChange={handleAudienceChange}>
                  <SelectTrigger className="w-full bg-white dark:bg-black border border-[#cbcbcb] dark:border-neutral-700 rounded-lg h-12" data-testid="select-audience">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="millennials">Millennials</SelectItem>
                    <SelectItem value="gen-z">Gen Z</SelectItem>
                    <SelectItem value="professionals">Professionals</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="seniors">Seniors</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                <Select value={campaignType} onValueChange={handleCampaignTypeChange}>
                  <SelectTrigger className="w-full bg-white dark:bg-black border border-[#cbcbcb] dark:border-neutral-700 rounded-lg h-12" data-testid="select-campaign">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product-launch">Product Launch</SelectItem>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                    <SelectItem value="sales-promotion">Sales Promotion</SelectItem>
                    <SelectItem value="content-marketing">Content Marketing</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone of Voice</label>
                <Select value={toneOfVoice} onValueChange={handleToneChange}>
                  <SelectTrigger className="w-full bg-white dark:bg-black border border-[#cbcbcb] dark:border-neutral-700 rounded-lg h-12" data-testid="select-tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Bottom controls - Simplified */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-4 px-12 text-lg rounded-lg transition-all duration-200 min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-generate"
            >
              Generate Campaign
            </Button>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}