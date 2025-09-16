import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewHome() {
  const [, navigate] = useLocation();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleStartNow = () => {
    navigate('/options');
  };

  const handleHowItWorks = () => {
    setShowHowItWorks(true);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center">
          {/* Google logo style */}
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
          variant="outline" 
          onClick={handleHowItWorks}
          className="md-outlined-button border-md-sys-color-outline text-md-sys-color-primary hover:bg-md-sys-color-surface-container-highest"
          data-testid="button-how-it-works-header"
        >
          How it works
        </Button>
      </header>

      {/* Main Content */}
      {!showHowItWorks ? (
        <main className="flex items-center justify-center min-h-[calc(100vh-200px)] px-8">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Decorative circle element */}
            <div className="absolute -right-32 top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none">
              <div className="w-96 h-96 rounded-full border-4 border-purple-300"></div>
            </div>
            
            {/* Main headline */}
            <h1 className="text-6xl font-normal text-gray-900 mb-6 tracking-tight">
              Promote your product now
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Executive campaign AI builder for executive people
            </p>
            
            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={handleStartNow}
                className="fab-style px-8 py-4 text-lg font-medium rounded-full transition-all duration-200 hover:scale-105"
                data-testid="button-start-now"
              >
                Start now
              </Button>
              <Button 
                variant="outline"
                onClick={handleHowItWorks}
                className="md-outlined-button border-md-sys-color-outline text-md-sys-color-primary hover:bg-md-sys-color-surface-container-highest px-8 py-4 text-lg font-medium rounded-full"
                data-testid="button-how-it-works-main"
              >
                How it works
              </Button>
            </div>
          </div>
        </main>
      ) : (
        /* How it works section */
        <main className="max-w-6xl mx-auto px-8 py-16">
          <div className="text-center mb-16">
            <Button 
              variant="ghost" 
              onClick={() => setShowHowItWorks(false)}
              className="mb-8"
              data-testid="button-back-to-home"
            >
              ← Back to home
            </Button>
            <h2 className="text-4xl font-normal text-gray-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional marketing campaigns in minutes with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="md-card md-state-layer p-8 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-md-sys-color-primary to-md-sys-color-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="md-typescale-title-large text-gray-900 mb-4">
                  Describe your product
                </h3>
                <p className="md-typescale-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  Simply tell us about your product and target audience. Upload images if you have them.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="md-card md-state-layer p-8 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-md-sys-color-secondary to-md-sys-color-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="md-typescale-title-large text-gray-900 mb-4">
                  AI generates content
                </h3>
                <p className="md-typescale-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  Our AI creates slides, landing pages, social media posts, and marketing materials instantly.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="md-card md-state-layer p-8 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-md-sys-color-tertiary to-md-sys-color-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="md-typescale-title-large text-gray-900 mb-4">
                  Review and export
                </h3>
                <p className="md-typescale-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  Edit, collaborate, and export your campaign assets in multiple formats ready for use.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Button 
              onClick={handleStartNow}
              className="fab-style px-8 py-4 text-lg font-medium rounded-full transition-all duration-200 hover:scale-105"
              data-testid="button-start-now-how-it-works"
            >
              Start now
            </Button>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Executive campaign AI builder for executive people
        </p>
      </footer>
    </div>
  );
}