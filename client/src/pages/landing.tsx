import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, ArrowRight, MousePointer2 } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionType: 'marketing' | 'catalog') => {
    setSelectedOption(optionType);
    // Store the selected type for the prompt screen
    localStorage.setItem('selectedAppType', optionType);
    // Navigate to the prompt input screen
    navigate('/prompt-input');
  };

  return (
    <div className="min-h-screen dotted-background">
      <main className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              GenAI and Machine Learning Experiments
            </h1>
            <p className="text-lg text-gray-600">
              No technical expertise required
            </p>
          </div>

          {/* Two main options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
            {/* Marketing Inspiration Option */}
            <Card 
              className="clean-card border-orange-300 hover:border-orange-400 cursor-pointer group"
              onClick={() => handleOptionSelect('marketing')}
              data-testid="card-marketing-option"
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <TrendingUp className="text-white w-8 h-8" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Marketing Inspiration<br />to Activation
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Capture or upload an image, describe what you want to promote, and select your target audience. AI transforms your inspiration into complete multi-channel campaigns.
                  </p>
                  
                  {/* Preview image placeholder */}
                  <div className="w-full h-24 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center text-orange-600">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">Campaign Preview</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-sm rounded-lg transition-all duration-200 min-h-[44px]"
                    data-testid="button-select-marketing"
                  >
                    Start Marketing Campaign
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Catalog Enrichment Option */}
            <Card 
              className="clean-card border-green-300 hover:border-green-400 cursor-pointer group"
              onClick={() => handleOptionSelect('catalog')}
              data-testid="card-catalog-option"
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="text-white w-8 h-8" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Catalog<br />Enrichment
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Upload product images and define your brand tone. AI generates high-quality titles, descriptions, feature bullets, alt text, and SEO metadata instantly.
                  </p>
                  
                  {/* Preview image placeholder */}
                  <div className="w-full h-24 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center text-green-600">
                      <Sparkles className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">Product Catalog</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-sm rounded-lg transition-all duration-200 min-h-[44px]"
                    data-testid="button-select-catalog"
                  >
                    Enrich Product Catalog
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600 text-base mb-2">
              Choose an experience to get started
            </p>
            <MousePointer2 className="w-5 h-5 text-gray-500 mx-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}