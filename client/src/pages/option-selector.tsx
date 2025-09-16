import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Package } from "lucide-react";
import Lottie from "lottie-react";
import marketingAnimation from "../assets/marketing-animation.json";
import chartsAnimation from "../assets/charts-animation.json";

export default function OptionSelector() {
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center">
          <div className="text-2xl font-normal">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="md-text-button text-md-sys-color-primary"
          data-testid="button-back-to-home"
        >
          ← Back
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-200px)] px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-normal text-gray-900 mb-6 tracking-tight">
              What would you like to create?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose your workflow to get started with AI-powered content generation
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Marketing Card */}
            <Card 
              className="md-card md-state-layer cursor-pointer p-8 group hover:scale-105 transition-all duration-300"
              onClick={() => handleOptionSelect('marketing')}
              data-testid="card-marketing-option"
            >
              <CardContent className="p-0 text-center">
                {/* Animation */}
                <div className="mb-8 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <Lottie 
                      animationData={marketingAnimation}
                      loop={true}
                      className="w-20 h-20"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-8">
                  <h3 className="md-typescale-display-small text-gray-900 mb-4 font-medium">
                    Marketing Campaigns
                  </h3>
                  <p className="md-typescale-body-large text-gray-600 leading-relaxed mb-6">
                    Create comprehensive marketing campaigns with slides, landing pages, social media content, and promotional materials
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                    <span>• Slides</span>
                    <span>• Landing Pages</span>
                    <span>• Social Media</span>
                    <span>• Email</span>
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  className="fab-style w-full py-4 text-lg font-medium rounded-2xl transition-all duration-200 group-hover:scale-105"
                  data-testid="button-select-marketing"
                >
                  Start Marketing Campaign
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Catalog Card */}
            <Card 
              className="md-card md-state-layer cursor-pointer p-8 group hover:scale-105 transition-all duration-300"
              onClick={() => handleOptionSelect('catalog')}
              data-testid="card-catalog-option"
            >
              <CardContent className="p-0 text-center">
                {/* Animation */}
                <div className="mb-8 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <Lottie 
                      animationData={chartsAnimation}
                      loop={true}
                      className="w-20 h-20"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-8">
                  <h3 className="md-typescale-display-small text-gray-900 mb-4 font-medium">
                    Catalog Enrichment
                  </h3>
                  <p className="md-typescale-body-large text-gray-600 leading-relaxed mb-6">
                    Enhance your product catalogs with AI-generated descriptions, features, specifications, and SEO-optimized content
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                    <span>• Descriptions</span>
                    <span>• Features</span>
                    <span>• SEO Content</span>
                    <span>• Specs</span>
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  variant="outline"
                  className="md-outlined-button w-full py-4 text-lg font-medium rounded-2xl border-md-sys-color-outline text-md-sys-color-primary hover:bg-md-sys-color-surface-container-highest transition-all duration-200 group-hover:scale-105"
                  data-testid="button-select-catalog"
                >
                  Start Catalog Enrichment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Executive campaign AI builder for executive people
        </p>
      </footer>
    </div>
  );
}