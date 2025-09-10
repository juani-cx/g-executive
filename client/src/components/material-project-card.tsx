import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Image
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type Campaign } from "@shared/schema";

interface MaterialProjectCardProps {
  campaign: Campaign;
  className?: string;
}

export default function MaterialProjectCard({ campaign, className = "" }: MaterialProjectCardProps) {
  const [, navigate] = useLocation();

  const getAssetCount = (campaign: Campaign) => {
    return campaign.generatedAssets?.length || 0;
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

  const handleCardClick = () => {
    navigate(`/canvas/${campaign.id}`);
  };

  return (
    <Card 
      className={`glass-surface border-glass-border hover:glass-elevated transition-all duration-300 group overflow-hidden cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Hero Image with Gray Overlay */}
      <div className="h-32 relative overflow-hidden">
        <img 
          src={campaign.sourceImageUrl || "/api/placeholder/320/180"} 
          alt={campaign.name}
          className="w-full h-full object-cover transition-all duration-300"
        />
        {/* Gray overlay that disappears on hover */}
        <div className="absolute inset-0 bg-gray-500/70 group-hover:bg-transparent transition-all duration-300"></div>

        {/* Asset Count Overlay */}
        {getAssetCount(campaign) > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs">
              {getAssetCount(campaign)} assets
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-base text-glass-text-primary truncate group-hover:text-[#6366f1] transition-colors duration-200">
            {campaign.name}
          </h3>
          
          <div className="flex items-center text-xs text-glass-text-muted">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}