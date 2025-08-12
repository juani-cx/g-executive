import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sparkles, 
  Search, 
  Bell,
  Settings,
  Menu,
  Plus
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
    <header className={`glass-elevated border-b border-glass-border sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo, Menu Toggle and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Logo with Menu Toggle */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 glass-surface hover:glass-elevated rounded-lg transition-all duration-200"
                onClick={onToggleSidebar}
              >
                <Menu className="w-4 h-4 text-glass-text-primary" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[rgba(99,102,241,0.8)] to-[rgba(236,72,153,0.8)] rounded-lg flex items-center justify-center shadow-lg backdrop-blur-lg border border-white/20">
                  <Sparkles className="text-white w-4 h-4" />
                </div>
                <h1 className="text-lg font-semibold text-glass-text-primary">Google Marketer</h1>
              </div>
            </div>

            {/* Floating Navigation Menu */}
            <nav className="glass-elevated px-6 py-2 rounded-full border border-glass-border backdrop-blur-xl">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-sm font-medium text-glass-text-primary hover:text-[rgba(99,102,241,0.9)] transition-colors">
                  Dashboard
                </Link>
                <Link href="/templates" className="text-sm font-medium text-glass-text-secondary hover:text-glass-text-primary transition-colors">
                  Templates
                </Link>
                <Link href="/campaign-generator" className="text-sm font-medium text-glass-text-secondary hover:text-glass-text-primary transition-colors">
                  Campaigns
                </Link>
                <Link href="/analytics" className="text-sm font-medium text-glass-text-secondary hover:text-glass-text-primary transition-colors">
                  Analytics
                </Link>
                <Link href="/resources" className="text-sm font-medium text-glass-text-secondary hover:text-glass-text-primary transition-colors">
                  Resources
                </Link>
              </div>
            </nav>
          </div>

          {/* Right Actions */}

          <div className="flex items-center space-x-3">
            {/* New Campaign Button */}
            <Link href="/campaign-generator">
              <Button className="bg-[rgba(99,102,241,0.9)] hover:bg-[rgba(99,102,241,1)] text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 shadow-lg backdrop-blur-lg">
                New Campaign
              </Button>
            </Link>

            {/* Profile Avatar */}
            <Avatar className="w-9 h-9 ring-2 ring-glass-border ring-offset-1 ring-offset-transparent">
              <AvatarImage src="/api/placeholder/32/32" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-[rgba(99,102,241,0.3)] to-[rgba(236,72,153,0.3)] text-glass-text-primary backdrop-blur-lg text-sm">
                AI
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}