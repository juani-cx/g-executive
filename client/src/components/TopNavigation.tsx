import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
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
} from "@/components/ui/dialog";
import howItWorksImage from "@assets/Screenshot 2025-09-26 at 14.13.25_1758906819756.png";

interface TopNavigationProps {
  isLandingPage?: boolean;
}

export default function TopNavigation({ isLandingPage = false }: TopNavigationProps) {
  const [timeoutEnabled, setTimeoutEnabled] = useState(true);
  const [guidedVersion, setGuidedVersion] = useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [activeHowItWorksTab, setActiveHowItWorksTab] = useState<'campaign' | 'catalog'>('campaign');

  return (
    <div className="w-full flex justify-between items-center h-full">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <Logo size={isLandingPage ? "xlarge" : "large"} />
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
          <DialogContent className="max-w-7xl w-full bg-white z-[10001] flex flex-col" style={{ zIndex: 10001, height: '80vh', maxHeight: '80vh' }}>
            <DialogHeader className="pb-4 px-6 pt-6">
              <DialogTitle className="text-2xl font-semibold text-center mb-4">
                How Campaign AI Gen Works
              </DialogTitle>
              
              {/* Tabs */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                  <Button
                    variant={activeHowItWorksTab === 'campaign' ? "default" : "ghost"}
                    className={`rounded-full text-2xl font-medium transition-colors px-12 py-4 ${
                      activeHowItWorksTab === 'campaign'
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-white"
                    }`}
                    onClick={() => setActiveHowItWorksTab('campaign')}
                    data-testid="tab-campaign"
                  >
                    Campaign
                  </Button>
                  <Button
                    variant={activeHowItWorksTab === 'catalog' ? "default" : "ghost"}
                    className={`rounded-full text-2xl font-medium transition-colors px-12 py-4 ${
                      activeHowItWorksTab === 'catalog'
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-white"
                    }`}
                    onClick={() => setActiveHowItWorksTab('catalog')}
                    data-testid="tab-catalog"
                  >
                    Catalog
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            {/* Content Area */}
            <div className="flex-1 overflow-hidden px-6 pb-6 flex flex-col items-start justify-start">
              {/* Campaign Tab Content */}
              <div className={`h-full transition-opacity duration-200 ${
                activeHowItWorksTab === 'campaign' ? 'opacity-100' : 'opacity-0 absolute'
              }`}>
                <div className="flex justify-center h-full">
                  <img 
                    src={howItWorksImage} 
                    alt="Campaign AI Gen Workflow" 
                    className="w-auto h-auto rounded-lg shadow-lg object-contain"
                    style={{ width: '200%', maxHeight: 'calc(80vh - 180px)' }}
                    onError={(e) => console.log('Image load error:', e)}
                    onLoad={() => console.log('Image loaded successfully')}
                  />
                </div>
              </div>
              
              {/* Catalog Tab Content */}
              <div className={`h-full transition-opacity duration-200 ${
                activeHowItWorksTab === 'catalog' ? 'opacity-100' : 'opacity-0 absolute'
              }`}>
                <div className="flex flex-col items-center justify-start h-full text-center p-8">
                  <h3 className="text-4xl font-semibold mb-8 text-gray-800">
                    Catalog Enhancement Workflow
                  </h3>
                  <div className="space-y-8 text-gray-600 max-w-4xl">
                    <div className="bg-blue-50 p-8 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-4 text-2xl">1. Upload Product Images</h4>
                      <p className="text-lg">Upload your e-commerce product photos for AI analysis</p>
                    </div>
                    <div className="bg-green-50 p-8 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-4 text-2xl">2. AI Enhancement</h4>
                      <p className="text-lg">Our AI analyzes images and generates optimized product descriptions, titles, and metadata</p>
                    </div>
                    <div className="bg-purple-50 p-8 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-4 text-2xl">3. SEO Optimization</h4>
                      <p className="text-lg">Get SEO-optimized content, keywords, and enhanced product features for better visibility</p>
                    </div>
                    <div className="bg-orange-50 p-8 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-4 text-2xl">4. Export & Implement</h4>
                      <p className="text-lg">Download enhanced content and integrate into your e-commerce platform</p>
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
            className="w-64 bg-gray-800 border-gray-700 text-white shadow-xl"
            style={{ backgroundColor: '#4a4a4a' }}
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
    </div>
  );
}