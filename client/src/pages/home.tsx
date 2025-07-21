import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  Sparkles,
  Image,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { type Campaign } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'generating': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'failed': return <Clock className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssetCount = (campaign: Campaign) => {
    return campaign.generatedAssets?.length || 0;
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || campaign.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-4 h-4" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Campaign AI Gen</h1>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                BETA
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaigns.slice(0, 5).map((campaign) => (
                  <Link key={campaign.id} href={`/output/${campaign.id}`}>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {campaign.name || 'Untitled Campaign'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No projects yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/campaign-generator">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <Sparkles className="w-4 h-4 mr-3" />
                    Campaign Generator
                  </Button>
                </Link>
                <Link href="/catalog-generator">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <FileText className="w-4 h-4 mr-3" />
                    Catalog Generator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* New Design Section */}
            <Card className="mb-6 bg-gradient-to-r from-primary to-blue-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Start a new design</h2>
                    <p className="text-blue-100 mb-6">
                      Create stunning marketing campaigns and product catalogs with AI assistance
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <Link href="/campaign-generator">
                        <Button className="bg-white text-primary hover:bg-gray-100">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Campaign Generator
                        </Button>
                      </Link>
                      <Link href="/catalog-generator">
                        <Button variant="outline" className="border-white text-white hover:bg-white/10">
                          <FileText className="w-4 h-4 mr-2" />
                          Catalog Builder
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-16 h-16 text-white/80" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="generating">In Progress</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/output/${campaign.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-4">
                        {/* Thumbnail */}
                        <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 relative overflow-hidden group-hover:scale-105 transition-transform">
                          {campaign.sourceImageUrl ? (
                            <img 
                              src={campaign.sourceImageUrl} 
                              alt={campaign.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </div>
                        </div>
                        
                        {/* Project Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {campaign.name || 'Untitled Campaign'}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</span>
                            </span>
                            <span>{getAssetCount(campaign)} assets</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{campaign.brandTone}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || filterType !== "all" 
                      ? "Try adjusting your search or filters"
                      : "Create your first AI-powered marketing campaign"
                    }
                  </p>
                  <Link href="/campaign-generator">
                    <Button className="bg-primary text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Project
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
