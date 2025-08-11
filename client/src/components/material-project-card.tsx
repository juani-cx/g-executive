import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Calendar,
  Image,
  FileText,
  CheckCircle,
  Clock,
  PlayCircle,
  Download,
  Share,
  Edit
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type Campaign } from "@shared/schema";

interface MaterialProjectCardProps {
  campaign: Campaign;
  className?: string;
}

export default function MaterialProjectCard({ campaign, className = "" }: MaterialProjectCardProps) {
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
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'generating': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

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

  return (
    <Card className={`surface-elevation-2 border-md-sys-color-outline-variant hover:surface-elevation-3 transition-all duration-300 group overflow-hidden ${className}`}>
      {/* Hero Image/Gradient */}
      <div className={`h-40 bg-gradient-to-br ${generateGradient(campaign.name)} relative overflow-hidden`}>
        {campaign.sourceImageUrl ? (
          <img 
            src={campaign.sourceImageUrl} 
            alt={campaign.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Image className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-4 right-4">
          <Badge className={`${getStatusColor(campaign.status)} border-0 shadow-lg backdrop-blur-sm`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(campaign.status)}
              <span className="capitalize font-medium">{campaign.status}</span>
            </div>
          </Badge>
        </div>

        {/* Asset Count Overlay */}
        {getAssetCount(campaign) > 0 && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
              {getAssetCount(campaign)} assets
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-md-sys-color-on-surface truncate group-hover:text-md-sys-color-primary transition-colors duration-200">
              {campaign.name}
            </h3>
            <p className="text-sm text-md-sys-color-on-surface-variant mt-1 line-clamp-2">
              {campaign.campaignFocus || "AI-generated marketing campaign with dynamic assets"}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <MoreVertical className="w-4 h-4 text-md-sys-color-on-surface-variant" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Campaign Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-md-sys-color-on-surface-variant">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
            </span>
          </div>

          {campaign.brandTone && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-md-sys-color-on-surface-variant">Tone:</span>
              <Badge variant="outline" className="text-xs border-md-sys-color-outline-variant text-md-sys-color-on-surface-variant">
                {campaign.brandTone}
              </Badge>
            </div>
          )}

          {campaign.targetPlatforms && campaign.targetPlatforms.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-md-sys-color-on-surface-variant">Platforms:</span>
              {campaign.targetPlatforms.slice(0, 2).map((platform, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {platform}
                </Badge>
              ))}
              {campaign.targetPlatforms.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{campaign.targetPlatforms.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-md-sys-color-outline-variant">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 rounded-xl hover:bg-md-sys-color-primary-container hover:text-md-sys-color-on-primary-container transition-colors duration-200"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          {campaign.status === 'completed' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl hover:bg-md-sys-color-secondary-container hover:text-md-sys-color-on-secondary-container transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl hover:bg-md-sys-color-tertiary-container hover:text-md-sys-color-on-tertiary-container transition-colors duration-200"
              >
                <Share className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}