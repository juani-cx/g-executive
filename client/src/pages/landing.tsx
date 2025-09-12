import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, ArrowRight, MousePointer2 } from "lucide-react";
import GlassBackground from "@/components/glass-background";

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
    <div className="min-h-screen relative">
      <GlassBackground />
      
      <main className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold text-glass-text-primary mb-6 tracking-tight leading-tight">
              AI Marketing & Commerce Platform
            </h1>
            <p className="text-2xl text-glass-text-secondary font-medium">
              No technical expertise required
            </p>
          </div>

          {/* Two main options */}
          <div className="grid md:grid-cols-2 gap-12 mb-16 max-w-6xl mx-auto">
            {/* Marketing Inspiration Option */}
            <Card 
              className="glass-elevated border-2 border-orange-400 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl cursor-pointer group"
              onClick={() => handleOptionSelect('marketing')}
              data-testid="card-marketing-option"
            >
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
                    <TrendingUp className="text-white w-12 h-12" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-glass-text-primary mb-6 leading-relaxed">
                    Marketing Inspiration 
                    <br />
                    to Activation
                  </h2>
                  
                  <p className="text-lg text-glass-text-secondary mb-8 leading-relaxed">
                    Capture or upload an image, describe what you want to promote, and select your target audience. 
                    AI transforms your inspiration into complete multi-channel campaigns.
                  </p>
                  
                  {/* Preview image placeholder */}
                  <div className="w-full h-40 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-8 flex items-center justify-center">
                    <div className="text-center text-orange-600">
                      <TrendingUp className="w-10 h-10 mx-auto mb-3" />
                      <span className="text-base font-medium">Campaign Preview</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-5 px-8 text-lg rounded-xl transition-all duration-200 group-hover:scale-105 min-h-[56px]"
                    data-testid="button-select-marketing"
                  >
                    Start Marketing Campaign
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Catalog Enrichment Option */}
            <Card 
              className="glass-elevated border-2 border-green-400 hover:border-green-500 transition-all duration-300 hover:shadow-2xl cursor-pointer group"
              onClick={() => handleOptionSelect('catalog')}
              data-testid="card-catalog-option"
            >
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
                    <Sparkles className="text-white w-12 h-12" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-glass-text-primary mb-6 leading-relaxed">
                    Catalog 
                    <br />
                    Enrichment
                  </h2>
                  
                  <p className="text-lg text-glass-text-secondary mb-8 leading-relaxed">
                    Upload product images and define your brand tone. AI generates high-quality titles, descriptions, 
                    feature bullets, alt text, and SEO metadata instantly.
                  </p>
                  
                  {/* Preview image placeholder */}
                  <div className="w-full h-40 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-8 flex items-center justify-center">
                    <div className="text-center text-green-600">
                      <Sparkles className="w-10 h-10 mx-auto mb-3" />
                      <span className="text-base font-medium">Product Catalog</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-5 px-8 text-lg rounded-xl transition-all duration-200 group-hover:scale-105 min-h-[56px]"
                    data-testid="button-select-catalog"
                  >
                    Enrich Product Catalog
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-glass-text-secondary text-xl mb-4">
              Choose an experience to get started
            </p>
            <MousePointer2 className="w-8 h-8 text-glass-text-muted mx-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}