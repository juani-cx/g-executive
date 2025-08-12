import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu
} from "lucide-react";
import { useState } from "react";

interface MaterialHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  className?: string;
  onToggleSidebar?: () => void;
}

export default function MaterialHeader({ 
  title = "Campaign AI", 
  showSearch = true, 
  showNotifications = true,
  className = "",
  onToggleSidebar
}: MaterialHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className={`sticky top-0 z-50 ${className}`}>
      <div className="flex justify-center pt-8 pb-4">
        {/* Centered Floating Navigation Bar */}
        <div className="glass-elevated border border-glass-border backdrop-blur-xl rounded-3xl px-6 py-3 shadow-lg w-full max-w-[1280px]">
          <div className="flex items-center justify-between w-full">
            {/* Left side - Menu Toggle and Logo */}
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6 glass-surface hover:glass-elevated rounded-lg transition-all duration-200"
                onClick={onToggleSidebar}
              >
                <Menu className="w-4 h-4 text-glass-text-primary" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <img 
                  src="/google-logo.png" 
                  alt="Google" 
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold text-[#7166EF]" style={{ fontFamily: 'Work Sans, sans-serif' }}>Marketer</span>
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.19 12.23C9.96 11.27 9.83 10.1 9.83 8.84C9.83 7.58 9.96 6.41 10.19 5.45C10.41 4.54 10.92 3.51 11.28 3.05L2.45 8.56C2.24 8.69 2.24 8.99 2.45 9.12L11.28 14.63C10.92 14.17 10.41 13.14 10.19 12.23Z" fill="#292645"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Center - Navigation Links */}
            <nav className="flex items-center space-x-9">
              <Link href="/" className="text-sm font-medium text-[#141221] hover:text-[rgba(99,102,241,0.9)] transition-colors" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                Dashboard
              </Link>
              <Link href="/templates" className="text-sm font-medium text-[#141221] hover:text-[rgba(99,102,241,0.9)] transition-colors" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                Templates
              </Link>
              <Link href="/campaign-generator" className="text-sm font-medium text-[#141221] hover:text-[rgba(99,102,241,0.9)] transition-colors" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                Campaigns
              </Link>
              
              <Link href="/resources" className="text-sm font-medium text-[#141221] hover:text-[rgba(99,102,241,0.9)] transition-colors" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                Resources
              </Link>
            </nav>

            {/* Right side - Action Button and Profile */}
            <div className="flex items-center space-x-4">
              <Link href="/campaign-generator">
                <Button className="bg-[#694FE8] hover:bg-[#5A42C7] text-white rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 shadow-lg" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                  New Campaign
                </Button>
              </Link>
              
              <Avatar className="w-10 h-10 rounded-full overflow-hidden bg-[#D3D3D3]">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback className="bg-[#D3D3D3] text-gray-600 text-sm font-medium">
                  U
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}