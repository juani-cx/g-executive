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
import { useTimeoutSettings } from "@/contexts/TimeoutContext";

interface TopNavigationProps {
  isLandingPage?: boolean;
}

export default function TopNavigation({ isLandingPage = false }: TopNavigationProps) {
  const { timeoutEnabled, setTimeoutEnabled } = useTimeoutSettings();
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
          className="rounded-full border text-[20px] font-normal leading-[24px] text-[#1f2937]"
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
              variant="ghost"
              className="w-[25px] h-[25px] rounded-full p-0"
              data-testid="button-settings"
            >
              <Settings className="w-[25px] h-[25px] text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              className="flex items-center justify-between p-3"
              onSelect={(e) => e.preventDefault()}
            >
              <span>Auto-Timeout (Off by default)</span>
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