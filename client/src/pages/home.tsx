import { Link } from "wouter";
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
  Zap
} from "lucide-react";
import { type Campaign } from "@shared/schema";

import MaterialHeader from "@/components/material-header";
import MaterialSidebar from "@/components/material-sidebar";
import MaterialProjectCard from "@/components/material-project-card";
import GlassBackground from "@/components/glass-background";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || campaign.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen relative">
      <GlassBackground />
      <MaterialHeader />
      
      <div className="flex h-[calc(100vh-80px)]">
        <MaterialSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-glass-text-primary mb-2">
                    Welcome back
                  </h1>
                  <p className="text-glass-text-secondary text-lg">
                    Continue working on your marketing campaigns and catalogs
                  </p>
                </div>
                
                {/* Quick Stats */}
                <div className="hidden md:flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[rgba(99,102,241,0.9)]">
                      {campaigns.length}
                    </div>
                    <div className="text-sm text-glass-text-muted">
                      Total Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[rgba(139,92,246,0.9)]">
                      {campaigns.filter(c => c.status === 'completed').length}
                    </div>
                    <div className="text-sm text-glass-text-muted">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[rgba(236,72,153,0.9)]">
                      {campaigns.reduce((acc, c) => acc + (c.generatedAssets?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-glass-text-muted">
                      Assets Created
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link href="/campaign-generator">
                  <Card className="glass-elevated hover:glass-high transition-all duration-200 cursor-pointer group border-glass-border animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-glass-text-primary">
                            Generate Campaign
                          </h3>
                          <p className="text-sm text-glass-text-secondary">
                            Create visual assets
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/catalog-generator">
                  <Card className="surface-elevation-1 hover:surface-elevation-2 transition-all duration-200 cursor-pointer group border-md-sys-color-outline-variant">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-md-sys-color-on-surface">
                            Build Catalog
                          </h3>
                          <p className="text-sm text-md-sys-color-on-surface-variant">
                            Enhance products
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="surface-elevation-1 hover:surface-elevation-2 transition-all duration-200 cursor-pointer group border-md-sys-color-outline-variant">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-md-sys-color-on-surface">
                          Analytics
                        </h3>
                        <p className="text-sm text-md-sys-color-on-surface-variant">
                          Track performance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-elevation-1 hover:surface-elevation-2 transition-all duration-200 cursor-pointer group border-md-sys-color-outline-variant">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-md-sys-color-on-surface">
                          Templates
                        </h3>
                        <p className="text-sm text-md-sys-color-on-surface-variant">
                          Browse library
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Projects Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-md-sys-color-on-surface">
                  Recent Campaigns
                </h2>
                <p className="text-md-sys-color-on-surface-variant">
                  {filteredCampaigns.length} project{filteredCampaigns.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-md-sys-color-on-surface-variant w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-md-sys-color-surface-container-highest border-md-sys-color-outline-variant rounded-2xl"
                  />
                </div>

                {/* Filter */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32 bg-md-sys-color-surface-container-highest border-md-sys-color-outline-variant rounded-2xl">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="generating">Generating</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center bg-md-sys-color-surface-container-highest rounded-2xl p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-xl"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-xl"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse surface-elevation-1">
                    <div className="h-40 bg-md-sys-color-surface-container rounded-t-2xl"></div>
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
    </div>
  );
}