import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useKeyboard } from "@/contexts/KeyboardContext";
import { useTimeoutSettings } from "@/contexts/TimeoutContext";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import howItWorksImage from "@assets/Screenshot 2025-09-26 at 14.13.25_1758906819756.png";

interface TopNavigationProps {
  isLandingPage?: boolean;
}

export default function TopNavigation({ isLandingPage = false }: TopNavigationProps) {
  const { timeoutEnabled, setTimeoutEnabled } = useTimeoutSettings();
  const [guidedVersion, setGuidedVersion] = useState(false);
  const { keyboardEnabled, setKeyboardEnabled } = useKeyboard();
  const [activeHowItWorksTab, setActiveHowItWorksTab] = useState<'campaign' | 'catalog'>('campaign');
  const [showExitModal, setShowExitModal] = useState(false);
  const [, navigate] = useLocation();

  const handleLogoClick = () => {
    setShowExitModal(true);
  };

  const handleExitToLanding = () => {
    setShowExitModal(false);
    navigate('/');
  };

  return (
    <div className="w-full flex justify-between items-center h-full">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <div onClick={handleLogoClick} className="cursor-pointer" data-testid="logo-clickable">
          <Logo size={isLandingPage ? "xlarge" : "large"} />
        </div>
      </div>
      
      {/* Right side - How it works button and settings */}
      <div className="navigation-right flex items-center" style={{ gap: 'var(--space-md)' }}>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost"
              className="navigation-button font-normal text-[#1f2937] bg-transparent hover:bg-transparent"
              style={{
                height: 'calc(var(--space-2xl) * 2)',
                fontSize: '45px',
                padding: 'calc(var(--space-sm) * 2) calc(var(--space-md) * 2)'
              }}
              data-testid="button-how-it-works"
            >
              How it works
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full bg-white z-[10001] flex flex-col" style={{ zIndex: 10001, height: '60vh', maxHeight: '60vh' }}>
            <DialogHeader className="pb-4 px-6 pt-6" style={{ zIndex: 99, position: 'relative' }}>
              <DialogTitle className="text-2xl font-semibold text-center mb-4">
                How Campaign AI Gen Works
              </DialogTitle>
              
              {/* Tabs */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center bg-gray-100 rounded-full p-2" style={{ gap: '8px' }}>
                  <Button
                    variant="ghost"
                    className={`rounded-full font-medium transition-all duration-200 px-8 py-3 ${
                      activeHowItWorksTab === 'campaign'
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    style={{
                      fontSize: "24px",
                      lineHeight: "1.4",
                      minWidth: "140px",
                    }}
                    onClick={() => setActiveHowItWorksTab('campaign')}
                    data-testid="tab-campaign"
                  >
                    Campaign
                  </Button>
                  <Button
                    variant="ghost"
                    className={`rounded-full font-medium transition-all duration-200 px-8 py-3 ${
                      activeHowItWorksTab === 'catalog'
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    style={{
                      fontSize: "24px",
                      lineHeight: "1.4",
                      minWidth: "140px",
                    }}
                    onClick={() => setActiveHowItWorksTab('catalog')}
                    data-testid="tab-catalog"
                  >
                    Catalog
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            {/* Content Area */}
            <div className="flex-1 overflow-hidden px-6 pb-6 flex flex-col items-center justify-center">
              {/* Campaign Tab Content */}
              <div className={`h-full transition-opacity duration-200 ${
                activeHowItWorksTab === 'campaign' ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`} style={{ zIndex: 1 }}>
                <div className="flex justify-center h-full">
                  <img 
                    src={howItWorksImage} 
                    alt="Campaign AI Gen Workflow" 
                    className="w-auto h-auto rounded-lg object-contain"
                    style={{ width: '300%', maxHeight: 'calc(60vh - 140px)' }}
                    onError={(e) => console.log('Image load error:', e)}
                    onLoad={() => console.log('Image loaded successfully')}
                  />
                </div>
              </div>
              
              {/* Catalog Tab Content */}
              <div className={`h-full transition-opacity duration-200 ${
                activeHowItWorksTab === 'catalog' ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`} style={{ zIndex: 1 }}>
                <div className="flex flex-col h-full text-center p-4 overflow-y-auto">
                  <h3 className="text-3xl font-semibold mb-4 text-gray-800">
                    Catalog Enhancement Workflow
                  </h3>
                  <div className="space-y-4 text-gray-600 max-w-3xl mx-auto">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2 text-lg">1. Upload Product Images</h4>
                      <p className="text-sm">Upload your e-commerce product photos for AI analysis</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2 text-lg">2. AI Enhancement</h4>
                      <p className="text-sm">Our AI analyzes images and generates optimized product descriptions, titles, and metadata</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2 text-lg">3. SEO Optimization</h4>
                      <p className="text-sm">Get SEO-optimized content, keywords, and enhanced product features for better visibility</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2 text-lg">4. Export & Implement</h4>
                      <p className="text-sm">Download enhanced content and integrate into your e-commerce platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="navigation-gear w-[36px] h-[36px] rounded-full p-0"
              data-testid="button-settings"
            >
              <Settings className="navigation-gear-icon text-gray-600" style={{ height: 'auto', width: '70px' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-gray-800 border-gray-700 text-white shadow-xl"
            style={{ backgroundColor: '#4a4a4a', width: '470px' }}
          >
            <div className="p-4 space-y-4">
              {/* TimeOut Control */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-2xl">TimeOut</div>
                  <div className="text-gray-300 text-xl">Auto-timeout enabled</div>
                </div>
                <Switch
                  checked={timeoutEnabled}
                  onCheckedChange={setTimeoutEnabled}
                  data-testid="switch-timeout"
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-600"></div>

              {/* Guided Mode Control */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-2xl">Guided Mode</div>
                  <div className="text-gray-300 text-xl">Step-by-step guidance</div>
                </div>
                <Switch
                  checked={guidedVersion}
                  onCheckedChange={setGuidedVersion}
                  data-testid="switch-guided-version"
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-600"></div>

              {/* Keyboard Control */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-2xl">Keyboard</div>
                  <div className="text-gray-300 text-xl">Virtual keyboard enabled</div>
                </div>
                <Switch
                  checked={keyboardEnabled}
                  onCheckedChange={setKeyboardEnabled}
                  data-testid="switch-keyboard"
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Exit Confirmation Modal */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent className="max-w-md mx-auto" style={{ zIndex: 10002 }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center mb-2">
              Leave Current Flow?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Are you sure you want to drop the current flow and return to the landing page? Any unsaved progress will be lost.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setShowExitModal(false)}
              data-testid="button-cancel-exit"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white" 
              onClick={handleExitToLanding}
              data-testid="button-confirm-exit"
            >
              Yes, Exit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}