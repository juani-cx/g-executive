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

interface TopNavigationProps {
  isLandingPage?: boolean;
}

export default function TopNavigation({ isLandingPage = false }: TopNavigationProps) {
  const [timeoutEnabled, setTimeoutEnabled] = useState(true);
  const [guidedVersion, setGuidedVersion] = useState(false);

  const handleHowItWorks = () => {
    console.log('How it works clicked');
  };

  return (
    <div className="w-full flex justify-between items-center" style={{
      padding: isLandingPage ? '48px 112px 0' : '32px 32px 0'
    }}>
      {/* Left side - Logo */}
      <div className="flex items-center">
        <Logo size={isLandingPage ? "large" : "medium"} />
      </div>
      
      {/* Right side - How it works button and settings */}
      <div className="flex items-center gap-5">
        <Button 
          variant="outline"
          className="rounded-full border-4 text-[20px] font-medium leading-[24px] text-[#1f2937]"
          style={{
            borderColor: '#bec6d1b3',
            padding: '16px 48px'
          }}
          onClick={handleHowItWorks}
          data-testid="button-how-it-works"
        >
          How it works
        </Button>

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[60px] h-[60px] rounded-full border-2 p-0"
              style={{ borderColor: '#bec6d1b3' }}
              data-testid="button-settings"
            >
              <Settings className="w-8 h-8 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              className="flex items-center justify-between p-3"
              onSelect={(e) => e.preventDefault()}
            >
              <span>Timeout</span>
              <Switch
                checked={timeoutEnabled}
                onCheckedChange={setTimeoutEnabled}
                data-testid="switch-timeout"
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center justify-between p-3"
              onSelect={(e) => e.preventDefault()}
            >
              <span>Guided Version</span>
              <Switch
                checked={guidedVersion}
                onCheckedChange={setGuidedVersion}
                data-testid="switch-guided-version"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}