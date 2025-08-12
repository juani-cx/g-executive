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
}

export default function MaterialHeader({ 
  title = "Campaign AI", 
  showSearch = true, 
  showNotifications = true,
  className = ""
}: MaterialHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className={`glass-elevated border-b border-glass-border sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[rgba(99,102,241,0.8)] to-[rgba(236,72,153,0.8)] rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-lg border border-white/30">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-glass-text-primary tracking-tight">
                  {title}
                </h1>
                <p className="text-sm text-glass-text-secondary">
                  AI-Powered Marketing Platform
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar - Center */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-glass-text-muted w-5 h-5" />
                <Input
                  placeholder="Search campaigns, catalogs, or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass-surface border-glass-border rounded-2xl text-glass-text-primary placeholder:text-glass-text-muted focus:ring-2 focus:ring-[rgba(99,102,241,0.5)] focus:border-transparent transition-all duration-200 backdrop-blur-lg"
                />
              </div>
            </div>
          )}

          {/* Actions and Profile */}
          <div className="flex items-center space-x-3">
            {/* Create Button */}
            <Link href="/campaign-generator">
              <Button className="fab-style rounded-2xl px-6 py-3 font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </Link>

            {/* Notifications */}
            {showNotifications && (
              <Button variant="ghost" size="icon" className="rounded-2xl w-12 h-12 glass-surface hover:glass-elevated text-glass-text-primary hover:text-glass-text-primary transition-all duration-200">
                <Bell className="w-5 h-5" />
              </Button>
            )}

            {/* Settings */}
            <Button variant="ghost" size="icon" className="rounded-2xl w-12 h-12 glass-surface hover:glass-elevated text-glass-text-primary hover:text-glass-text-primary transition-all duration-200">
              <Settings className="w-5 h-5" />
            </Button>

            {/* Profile Avatar */}
            <Avatar className="w-10 h-10 ring-2 ring-glass-border ring-offset-2 ring-offset-transparent">
              <AvatarImage src="/api/placeholder/32/32" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-[rgba(99,102,241,0.3)] to-[rgba(236,72,153,0.3)] text-glass-text-primary backdrop-blur-lg font-medium">
                AI
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}