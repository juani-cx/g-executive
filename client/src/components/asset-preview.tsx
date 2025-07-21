import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, RefreshCw } from "lucide-react";
import { type GeneratedAsset } from "@shared/schema";

interface AssetPreviewProps {
  assets: GeneratedAsset[];
  isLoading?: boolean;
  onRegenerateAsset?: (asset: GeneratedAsset) => void;
  onPreviewAsset?: (asset: GeneratedAsset) => void;
  className?: string;
}

export default function AssetPreview({ 
  assets, 
  isLoading = false, 
  onRegenerateAsset, 
  onPreviewAsset, 
  className 
}: AssetPreviewProps) {
  
  if (isLoading) {
    return (
      <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-outline-variant">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-outline-variant rounded animate-pulse" />
                  <div className="h-4 bg-outline-variant rounded w-24 animate-pulse" />
                </div>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg animate-shimmer" />
                <div className="space-y-2">
                  <div className="h-3 bg-outline-variant/30 rounded animate-pulse" />
                  <div className="h-3 bg-outline-variant/30 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const groupedAssets = assets.reduce((acc, asset) => {
    const key = asset.platform;
    if (!acc[key]) acc[key] = [];
    acc[key].push(asset);
    return acc;
  }, {} as Record<string, GeneratedAsset[]>);

  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {Object.entries(groupedAssets).map(([platform, platformAssets]) => (
        <Card key={platform} className="border border-outline-variant">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {platform}
                  </Badge>
                  <span className="text-sm font-medium">{platformAssets[0]?.title}</span>
                </div>
                <div className="flex space-x-1">
                  {onPreviewAsset && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewAsset(platformAssets[0])}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  )}
                  {onRegenerateAsset && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRegenerateAsset(platformAssets[0])}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {platformAssets[0]?.type === 'image' ? (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg relative overflow-hidden">
                  {platformAssets[0]?.url ? (
                    <img 
                      src={platformAssets[0].url} 
                      alt={platformAssets[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                      Asset Preview
                    </div>
                  )}
                  {platformAssets[0]?.dimensions && (
                    <Badge className="absolute bottom-2 right-2 text-xs">
                      {platformAssets[0].dimensions}
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="bg-surface rounded-lg p-4 min-h-24">
                  <p className="text-sm text-on-surface-variant line-clamp-3">
                    {platformAssets[0]?.content?.substring(0, 200)}
                    {(platformAssets[0]?.content?.length || 0) > 200 && '...'}
                  </p>
                </div>
              )}

              {platformAssets.length > 1 && (
                <div className="text-xs text-on-surface-variant">
                  +{platformAssets.length - 1} more variants
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
