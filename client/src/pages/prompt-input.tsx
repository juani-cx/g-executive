import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Home, ArrowLeft, Mic, MicOff, Volume2 } from "lucide-react";

export default function PromptInput() {
  const [, navigate] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [guidedMode, setGuidedMode] = useState(true);
  const [appType, setAppType] = useState<'marketing' | 'catalog'>('marketing');

  // Get the selected app type from localStorage
  useEffect(() => {
    const selectedType = localStorage.getItem('selectedAppType') as 'marketing' | 'catalog';
    if (selectedType) {
      setAppType(selectedType);
    }
  }, []);

  // Sample prompts based on app type
  const samplePrompts = {
    marketing: "Create a campaign for our new eco-friendly water bottles targeting health-conscious millennials who care about sustainability",
    catalog: "Generate product descriptions for premium wireless headphones with noise cancellation features for our e-commerce store"
  };

  // Voice input simulation (in real implementation, would use Web Speech API)
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice input
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  const handleClear = () => {
    setPrompt("");
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      // Store the prompt and app type for the canvas
      localStorage.setItem('campaignPrompt', prompt.trim());
      localStorage.setItem('selectedAppType', appType);
      // Navigate to canvas
      navigate('/canvas');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative dotted-background">
      
      <main className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Say or type your prompt
            </h1>
            <p className="text-lg text-gray-600">
              {appType === 'marketing' 
                ? "Describe your marketing campaign vision" 
                : "Describe your product catalog needs"}
            </p>
          </div>

          {/* Main input card */}
          <Card className="clean-card mb-12">
            <CardContent className="p-12">
              {/* Large text input area */}
              <div className="mb-8">
                <textarea
                  placeholder={samplePrompts[appType]}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-64 bg-white border border-gray-200 rounded-2xl text-lg p-6 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                  data-testid="textarea-prompt"
                />
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between">
                {/* Left side - Clear button and character count */}
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    onClick={handleClear}
                    className="text-gray-600 hover:text-gray-800 py-3 px-6 text-lg min-h-[48px]"
                    data-testid="button-clear"
                  >
                    Clear
                  </Button>
                  <span className="text-base text-gray-500">
                    {prompt.length}/2000
                  </span>
                </div>

                {/* Right side - Voice button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleVoiceInput}
                  className={`rounded-full w-16 h-16 p-0 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  data-testid="button-voice"
                >
                  {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample suggestions based on app type */}
          <div className="mb-12">
            <p className="text-lg text-gray-600 mb-6">Try something like:</p>
            <div className="flex flex-wrap gap-4">
              {appType === 'marketing' ? (
                <>
                  <button className="px-6 py-3 bg-orange-100 text-orange-700 rounded-full text-base cursor-pointer hover:bg-orange-200 transition-colors min-h-[48px] flex items-center border-0" 
                          onClick={() => setPrompt("Launch campaign for new fitness app targeting busy professionals")}>
                    🏃‍♀️ <span className="text-orange-600 font-medium ml-2">Fitness App</span> <span className="ml-1">targeting busy professionals</span>
                  </button>
                  <button className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-base cursor-pointer hover:bg-blue-200 transition-colors min-h-[48px] flex items-center border-0"
                          onClick={() => setPrompt("Create social media campaign for sustainable fashion brand")}>
                    🌱 <span className="text-green-600 font-medium ml-2">Sustainable</span> <span className="ml-1">fashion brand campaign</span>
                  </button>
                  <button className="px-6 py-3 bg-purple-100 text-purple-700 rounded-full text-base cursor-pointer hover:bg-purple-200 transition-colors min-h-[48px] flex items-center border-0"
                          onClick={() => setPrompt("Marketing campaign for premium coffee subscription service")}>
                    ☕ <span className="text-purple-600 font-medium ml-2">Coffee subscription</span> <span className="ml-1">service</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="px-6 py-3 bg-green-100 text-green-700 rounded-full text-base cursor-pointer hover:bg-green-200 transition-colors min-h-[48px] flex items-center border-0"
                          onClick={() => setPrompt("Enrich catalog for luxury skincare products with detailed ingredients")}>
                    ✨ <span className="text-green-600 font-medium ml-2">Luxury skincare</span> <span className="ml-1">with detailed ingredients</span>
                  </button>
                  <button className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-base cursor-pointer hover:bg-blue-200 transition-colors min-h-[48px] flex items-center border-0"
                          onClick={() => setPrompt("Generate product descriptions for tech gadgets and electronics")}>
                    📱 <span className="text-blue-600 font-medium ml-2">Tech gadgets</span> <span className="ml-1">and electronics</span>
                  </button>
                  <button className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-full text-base cursor-pointer hover:bg-yellow-200 transition-colors min-h-[48px] flex items-center border-0"
                          onClick={() => setPrompt("Create catalog content for home furniture and decor items")}>
                    🏠 <span className="text-yellow-600 font-medium ml-2">Home furniture</span> <span className="ml-1">and decor</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex items-center justify-between">
            {/* Left side - Home and Back buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleGoHome}
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full w-14 h-14 p-0"
                data-testid="button-home"
              >
                <Home className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-3 min-h-[56px]"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>

            {/* Center - Guided mode toggle */}
            <div 
              className="flex items-center space-x-3 cursor-pointer min-h-[48px] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setGuidedMode(!guidedMode)}
            >
              <label htmlFor="guided-mode-switch" className="text-base text-gray-600 cursor-pointer">
                Guided mode
              </label>
              <Switch
                id="guided-mode-switch"
                checked={guidedMode}
                onCheckedChange={setGuidedMode}
                data-testid="switch-guided-mode"
                className="scale-150"
              />
            </div>

            {/* Right side - Generate button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className={`px-8 py-4 font-semibold rounded-xl transition-all duration-200 text-lg min-h-[56px] ${
                appType === 'marketing'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              data-testid="button-generate"
            >
              {appType === 'marketing' ? 'Generate Campaign' : 'Generate Catalog'}
              <ArrowLeft className="w-5 h-5 ml-3 rotate-180" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}