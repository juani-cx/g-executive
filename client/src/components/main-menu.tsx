import { Button } from "@/components/ui/button";
import { 
  Home,
  FileText,
  Archive,
  Users,
  Settings,
  HelpCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLocation } from "wouter";

interface MainMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MainMenu({ isOpen, onOpenChange }: MainMenuProps) {
  const [, setLocation] = useLocation();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[350px] border-glass-border" style={{ backgroundColor: '#ffffffd1' }}>
        <SheetHeader>
          <SheetTitle className="text-glass-text-primary flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">Google</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Marketer</span>
          </SheetTitle>
          <SheetDescription className="text-glass-text-secondary">
            Navigation and project management
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Navigation */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-glass-text-primary">Navigation</h3>
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setLocation('/');
                  onOpenChange(false);
                }}
              >
                <Home className="w-4 h-4 mr-3" />
                Home
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                Campaigns
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Archive className="w-4 h-4 mr-3" />
                Catalogs
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="w-4 h-4 mr-3" />
                Resources
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-glass-text-primary">Settings</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-3" />
                Preferences
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}