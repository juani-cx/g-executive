import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, ArrowRight, MousePointer2, Upload, Star } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<'demo1' | 'demo2' | 'demo3'>('demo1');

  const handleOptionSelect = (optionType: 'marketing' | 'catalog') => {
    setSelectedOption(optionType);
    // Store the selected type for the prompt screen
    localStorage.setItem('selectedAppType', optionType);
    // Navigate to the prompt input screen
    navigate('/prompt-input');
  };

  const renderDemo2Prompt = () => (
    <div className="relative flex items-center justify-center min-h-screen p-8">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ellipse SVG - Bottom Left */}
        <div className="absolute opacity-100" style={{
          width: '530px',
          height: 'auto',
          left: '-100px',
          bottom: '-30%'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 1068 1068" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#D96756" strokeWidth="67" d="M34,534A500,500 0,1,1 1034,534A500,500 0,1,1 34,534" className="WxGoLpNe_0"/>
            <style dangerouslySetInnerHTML={{__html: `.WxGoLpNe_0{stroke-dasharray:3143 3145;stroke-dashoffset:3144;animation:WxGoLpNe_draw_0 7200ms ease-in-out 0ms infinite,WxGoLpNe_fade 7200ms linear 0ms infinite;}@keyframes WxGoLpNe_draw{100%{stroke-dashoffset:0;}}@keyframes WxGoLpNe_fade{0%{stroke-opacity:1;}94.44444444444444%{stroke-opacity:1;}100%{stroke-opacity:0;}}@keyframes WxGoLpNe_draw_0{11.11111111111111%{stroke-dashoffset: 3144}38.88888888888889%{ stroke-dashoffset: 0;}100%{ stroke-dashoffset: 0;}}`}} />
          </svg>
        </div>
        {/* Shape SVG - Top Right */}
        <div className="absolute top-20 right-20 w-72 h-72 opacity-100">
          <svg width="100%" height="100%" viewBox="0 0 1596 2919" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34 2919V34H1596" stroke="#6790ED" strokeWidth="67" className="alVfMhya_0"/>
            <style dangerouslySetInnerHTML={{__html: `.alVfMhya_0{stroke-dasharray:4447 4449;stroke-dashoffset:4448;animation:alVfMhya_draw_0 7200ms ease-in-out 0ms infinite,alVfMhya_fade 7200ms linear 0ms infinite;}@keyframes alVfMhya_draw{100%{stroke-dashoffset:0;}}@keyframes alVfMhya_fade{0%{stroke-opacity:1;}94.44444444444444%{stroke-opacity:1;}100%{stroke-opacity:0;}}@keyframes alVfMhya_draw_0{11.11111111111111%{stroke-dashoffset: 4448}38.88888888888889%{ stroke-dashoffset: 0;}100%{ stroke-dashoffset: 0;}}`}} />
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
            Promote your product now
          </h1>
          <p className="text-lg text-gray-600">
            Complete multi-channel campaign AI builder for executive people
          </p>
        </div>

        {/* Prompt Input Area - No Card wrapper, no background */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Describe your product to market</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center">
                <Upload className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-gray-400">or</span>
              <div className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center">
                <Star className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-6 min-h-[120px] mb-6">
            <div className="text-gray-400 text-center">
              Type your product description here...
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-8 py-3 rounded-lg font-medium">
              Generate Campaign
            </Button>
          </div>
        </div>

        {/* Bottom suggestions */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
          <div>
            <p className="font-medium mb-1">Recent content</p>
            <p className="text-xs">AI generated platform built in platform marketing campaigns and drive more buyers to your groups</p>
          </div>
          <div>
            <p className="font-medium mb-1">Email new product launch for Q4 market</p>
          </div>
          <div>
            <p className="font-medium mb-1">Digital services for development</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemo3Prompt = () => (
    <div className="relative w-full min-h-screen">
      {/* Spline Background - Interactive */}
      <div className="absolute inset-0">
        <iframe 
          src='https://my.spline.design/googleiolandingpageconcept-0tTW0rW0LglwjHiVQlAaadFE/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full"
        />
      </div>
      
      {/* Content positioned with specific dimensions - No z-index to allow Spline interaction */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2" style={{ width: '880px', paddingLeft: '444px', textAlign: 'left' }}>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
            Promote your product now
          </h1>
          <p className="text-base text-gray-600">
            Complete multi-channel campaign AI builder for executive people
          </p>
        </div>

        {/* Prompt Input Area - No Card wrapper, minimal styling */}
        <div className="mb-8">
          <div className="border border-gray-300 rounded-lg p-4 min-h-[100px] mb-6 bg-white">
            <div className="text-gray-400 text-sm">
              Type your product description here...
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-lg font-medium">
              Start now
            </Button>
            <div className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center bg-white">
              <Upload className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-gray-400">or</span>
            <div className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center bg-white">
              <Star className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Bottom suggestions - Simplified */}
        <div className="text-xs text-gray-600">
          <div className="mb-2">
            <p className="font-medium">How it works</p>
          </div>
          <div>
            <p className="font-medium">Check examples</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen dotted-background">
      {/* Demo Navigation Links - Centered */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveDemo('demo1')}
            className={`text-sm font-medium transition-colors ${
              activeDemo === 'demo1' 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-testid="link-demo1"
          >
            Demo 1
          </button>
          <button
            onClick={() => setActiveDemo('demo2')}
            className={`text-sm font-medium transition-colors ${
              activeDemo === 'demo2' 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-testid="link-demo2"
          >
            Demo 2
          </button>
          <button
            onClick={() => setActiveDemo('demo3')}
            className={`text-sm font-medium transition-colors ${
              activeDemo === 'demo3' 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-testid="link-demo3"
          >
            Demo 3
          </button>
        </div>
      </div>
      {/* Conditional Demo Content */}
      {activeDemo === 'demo2' && renderDemo2Prompt()}
      {activeDemo === 'demo3' && renderDemo3Prompt()}
      {activeDemo === 'demo1' && (
        <main className="flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">Promote your product now</h1>
              <p className="text-lg text-gray-600">Executive campaign AI builder for executive people</p>
            </div>

            {/* Two main options - Simplified for Demo 1 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              {/* Marketing Inspiration Option - Simplified */}
              <Card 
                className="clean-card border-gray-200 hover:border-gray-300 cursor-pointer group"
                onClick={() => handleOptionSelect('marketing')}
                data-testid="card-marketing-option"
              >
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <TrendingUp className="text-gray-800 w-8 h-8" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Marketing Inspiration<br />to Activation
                    </h2>
                    
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      Capture or upload an image, describe what you want to promote, and select your target audience. AI transforms your inspiration into complete multi-channel campaigns.
                    </p>
                    
                    <Button 
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 text-sm rounded-lg transition-all duration-200 min-h-[44px]"
                      data-testid="button-select-marketing"
                    >
                      Start Marketing Campaign
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Catalog Enrichment Option - Simplified */}
              <Card 
                className="clean-card border-gray-200 hover:border-gray-300 cursor-pointer group"
                onClick={() => handleOptionSelect('catalog')}
                data-testid="card-catalog-option"
              >
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Sparkles className="text-gray-800 w-8 h-8" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Catalog<br />Enrichment
                    </h2>
                    
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      Upload product images and define your brand tone. AI generates high-quality titles, descriptions, feature bullets, alt text, and SEO metadata instantly.
                    </p>
                    
                    <Button 
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 text-sm rounded-lg transition-all duration-200 min-h-[44px]"
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
      )}
    </div>
  );
}