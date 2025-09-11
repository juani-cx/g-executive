import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Calendar,
  Image,
  MoreHorizontal,
  MessageCircle,
  Share2,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type Campaign } from "@shared/schema";
import { useState } from "react";

interface MaterialProjectCardProps {
  campaign: Campaign;
  className?: string;
}

export default function MaterialProjectCard({ campaign, className = "" }: MaterialProjectCardProps) {
  const [, navigate] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const getAssetCount = (campaign: Campaign) => {
    return campaign.generatedAssets?.length || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_approval':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'finished':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'in_approval':
        return 'In Approval';
      case 'approved':
        return 'Approved';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  // Generate a gradient background based on campaign name
  const generateGradient = (name: string) => {
    const gradients = [
      'from-purple-400 via-pink-400 to-red-400',
      'from-blue-400 via-cyan-400 to-teal-400',
      'from-green-400 via-lime-400 to-yellow-400',
      'from-orange-400 via-red-400 to-pink-400',
      'from-indigo-400 via-purple-400 to-pink-400',
      'from-cyan-400 via-blue-400 to-indigo-400'
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    navigate(`/canvas/${campaign.id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
    console.log('Share campaign:', campaign.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
    console.log('Delete campaign:', campaign.id);
  };

  return (
    <Card 
      className={`glass-surface border-glass-border hover:glass-elevated transition-all duration-300 group overflow-hidden cursor-pointer relative ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hero Image with Gray Overlay */}
      <div className="h-32 relative overflow-hidden">
        <img 
          src={campaign.sourceImageUrl || "/api/placeholder/320/180"} 
          alt={campaign.name}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            console.log('Image failed to load:', e.currentTarget.src);
            e.currentTarget.src = "/api/placeholder/320/180";
          }}
        />
        {/* Gray overlay that disappears on hover */}
        <div className="absolute inset-0 bg-gray-500/70 group-hover:bg-transparent transition-all duration-300"></div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <Badge className={`text-xs font-medium border backdrop-blur-sm ${getStatusColor(campaign.status)}`}>
            {getStatusLabel(campaign.status)}
          </Badge>
        </div>

        {/* Asset Count Overlay */}
        {getAssetCount(campaign) > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs">
              {getAssetCount(campaign)} assets
            </Badge>
          </div>
        )}

        {/* 3-dots Menu - Always rendered, visibility controlled by CSS */}
        <div className={`absolute top-3 left-3 transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`} data-dropdown-trigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border border-white/20 hover:border-white/40 backdrop-blur-md rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                data-testid="campaign-menu-button"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-surface border-glass-border">
              <DropdownMenuItem onClick={handleShare} data-testid="share-campaign">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="text-red-400 focus:text-red-300"
                data-testid="delete-campaign"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base text-glass-text-primary truncate group-hover:text-[#6366f1] transition-colors duration-200 flex-1 mr-2">
              {campaign.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between text-xs text-glass-text-muted">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            {/* Comments Count */}
            {campaign.commentsCount > 0 && (
              <div className="flex items-center" data-testid="comments-count">
                <MessageCircle className="w-3 h-3 mr-1" />
                <span>{campaign.commentsCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}