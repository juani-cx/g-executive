import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3,
  List,
  TrendingUp,
  Sparkles,
  Zap,
  FileText,
  Paperclip
} from "lucide-react";
import { type Campaign } from "@shared/schema";

import MaterialHeader from "@/components/material-header";
import MaterialSidebar from "@/components/material-sidebar";
import MaterialProjectCard from "@/components/material-project-card";
import GlassBackground from "@/components/glass-background";
import { MainMenu } from "@/components/main-menu";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaignPrompt, setCampaignPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"campaign" | "catalog">("campaign");
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [, navigate] = useLocation();

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || campaign.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleStartCampaign = () => {
    if (campaignPrompt.trim()) {
      // Store the prompt in localStorage to pass to canvas
      localStorage.setItem('campaignPrompt', campaignPrompt.trim());
      // Navigate directly to canvas (instant redirect)
      navigate('/canvas');
    }
  };

  return (
    <div className="min-h-screen relative">
      <GlassBackground />
      <MaterialHeader onToggleMainMenu={() => setShowMainMenu(!showMainMenu)} />
      <div className="flex h-[calc(100vh-120px)]">
        <MaterialSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-[1280px] mx-auto w-full">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="font-bold text-glass-text-primary mb-6 text-center text-[24px]">
                Welcome back
              </h1>

              {/* Google Stitch Style Input Section */}
              <div className="mb-8">
                

                <div className="glass-elevated border-glass-border rounded-3xl p-8 max-w-4xl mx-auto">
                  {/* Main text area */}
                  <div className="mb-6">
                    <textarea
                      placeholder="Describe your design"
                      value={campaignPrompt}
                      onChange={(e) => setCampaignPrompt(e.target.value)}
                      className="w-full h-32 glass-surface border-0 rounded-2xl text-base p-6 text-glass-text-primary placeholder:text-glass-text-muted focus:ring-2 focus:ring-[rgba(99,102,241,0.3)] focus:border-transparent bg-[rgba(255,255,255,0.05)] backdrop-blur-md resize-none"
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey && campaignPrompt.trim()) {
                          handleStartCampaign();
                        }
                      }}
                    />
                  </div>

                  {/* Bottom bar with tabs and generate button */}
                  <div className="flex items-center justify-between">
                    {/* Left: Tab buttons */}
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant={activeTab === "campaign" ? "default" : "ghost"}
                        className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                          activeTab === "campaign" 
                            ? "bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.3)]" 
                            : "text-glass-text-secondary hover:bg-[rgba(99,102,241,0.1)] hover:text-[#6366f1]"
                        }`}
                        onClick={() => setActiveTab("campaign")}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Campaign
                      </Button>
                      <Button 
                        variant={activeTab === "catalog" ? "default" : "ghost"}
                        className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                          activeTab === "catalog" 
                            ? "bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.3)]" 
                            : "text-glass-text-secondary hover:bg-[rgba(99,102,241,0.1)] hover:text-[#6366f1]"
                        }`}
                        onClick={() => setActiveTab("catalog")}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Catalog
                      </Button>
                    </div>

                    {/* Right: Attachment button and Generate designs button */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 text-glass-text-muted hover:text-[#6366f1] hover:bg-[rgba(99,102,241,0.1)] rounded-lg"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          // Handle file upload logic here
                          console.log('File selected:', e.target.files?.[0]);
                        }}
                      />
                      
                      <Button 
                        className="bg-[rgba(139,92,246,0.9)] hover:bg-[rgba(139,92,246,1)] text-white rounded-2xl px-6 py-2 text-sm font-medium transition-all duration-200"
                        onClick={handleStartCampaign}
                        disabled={!campaignPrompt.trim()}
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate designs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Section - Reduced opacity until hover */}
            <div className="opacity-60 hover:opacity-100 transition-opacity duration-300 border-t border-glass-border pt-8 mt-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-glass-text-secondary">
                  Recent Campaigns
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`w-7 h-7 ${viewMode === "grid" ? "bg-glass-elevated" : ""}`}
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`w-7 h-7 ${viewMode === "list" ? "bg-glass-elevated" : ""}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse glass-surface">
                    <div className="h-40 bg-[rgba(255,255,255,0.1)] rounded-t-2xl"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-md-sys-color-surface-container rounded mb-2"></div>
                      <div className="h-3 bg-md-sys-color-surface-container rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCampaigns.length > 0 ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredCampaigns.map((campaign) => (
                  <MaterialProjectCard
                    key={campaign.id}
                    campaign={campaign}
                    className={viewMode === "list" ? "flex-row" : ""}
                  />
                ))}
              </div>
            ) : (
              <Card className="surface-elevation-1 border-md-sys-color-outline-variant">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-md-sys-color-surface-container flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-md-sys-color-on-surface-variant" />
                  </div>
                  <h3 className="text-lg font-semibold text-md-sys-color-on-surface mb-2">
                    No campaigns yet
                  </h3>
                  <p className="text-md-sys-color-on-surface-variant mb-6">
                    Create your first marketing campaign to get started
                  </p>
                  <Link href="/campaign-generator">
                    <Button className="fab-style rounded-2xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      
      {/* Main Menu */}
      <MainMenu isOpen={showMainMenu} onOpenChange={setShowMainMenu} />
    </div>
  );
}