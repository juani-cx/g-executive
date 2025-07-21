import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, Eye, RefreshCw, FileText, Image } from "lucide-react";
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
  const [previewAsset, setPreviewAsset] = useState<GeneratedAsset | null>(null);
  
  const handleDownloadAsset = async (asset: GeneratedAsset) => {
    const filename = `${asset.platform}_${asset.type}_${asset.title.replace(/\s+/g, '_')}.${asset.type === 'image' ? 'jpg' : 'txt'}`;
    
    if (asset.type === 'image' && asset.url) {
      // Download image from URL via proxy
      try {
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(asset.url)}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download image via proxy:', error);
        // Fallback to opening direct URL in new tab
        window.open(asset.url, '_blank');
      }
    } else {
      // Download text content
      const content = asset.content || '';
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAll = () => {
    assets.forEach(asset => {
      setTimeout(() => handleDownloadAsset(asset), 100);
    });
  };

  const handlePreview = (asset: GeneratedAsset) => {
    setPreviewAsset(asset);
    if (onPreviewAsset) {
      onPreviewAsset(asset);
    }
  };
  
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(platformAssets[0])}
                    title="Preview asset"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadAsset(platformAssets[0])}
                    title="Download asset"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  {onRegenerateAsset && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRegenerateAsset(platformAssets[0])}
                      title="Regenerate asset"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {platformAssets[0]?.type === 'image' ? (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg relative overflow-hidden">
                  {platformAssets[0]?.url ? (
                    <img 
                      src={`/api/image-proxy?url=${encodeURIComponent(platformAssets[0].url)}`} 
                      alt={platformAssets[0].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error, trying direct URL:', platformAssets[0]?.url);
                        const target = e.target as HTMLImageElement;
                        // Try direct URL as fallback
                        target.src = platformAssets[0]?.url || '';
                        target.onerror = () => {
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'w-full h-full flex flex-col items-center justify-center text-on-surface-variant text-center p-4';
                            errorDiv.innerHTML = `
                              <div class="text-sm font-medium mb-2">Generated Image Available</div>
                              <div class="text-xs mb-3">Click to view full size</div>
                              <button onclick="window.open('${platformAssets[0]?.url}', '_blank')" 
                                      class="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                                Open Image
                              </button>
                            `;
                            parent.appendChild(errorDiv);
                          }
                        };
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully via proxy:', platformAssets[0]?.url);
                      }}
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
      
      {/* Download All Button */}
      {assets.length > 0 && (
        <div className="col-span-full flex justify-center mt-6">
          <Button onClick={handleDownloadAll} className="bg-primary text-white">
            <Download className="w-4 h-4 mr-2" />
            Download All Assets
          </Button>
        </div>
      )}
      
      {/* Preview Dialog */}
      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {previewAsset?.type === 'image' ? (
                <Image className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
              <span>{previewAsset?.title} - {previewAsset?.platform}</span>
            </DialogTitle>
            <DialogDescription>
              Preview of the generated {previewAsset?.type === 'image' ? 'image' : 'content'} asset for {previewAsset?.platform}
            </DialogDescription>
          </DialogHeader>
          
          {previewAsset && (
            <div className="space-y-4">
              {previewAsset.type === 'image' && previewAsset.url ? (
                <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={`/api/image-proxy?url=${encodeURIComponent(previewAsset.url)}`} 
                    alt={previewAsset.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Preview image load error, trying direct URL:', previewAsset.url);
                      const target = e.target as HTMLImageElement;
                      // Try direct URL as fallback
                      target.src = previewAsset.url || '';
                      target.onerror = () => {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'w-full h-full flex flex-col items-center justify-center text-gray-600 text-center p-4';
                          errorDiv.innerHTML = `
                            <div class="text-sm font-medium mb-2">Generated Image Available</div>
                            <div class="text-xs mb-3">Click to view full size</div>
                            <button onclick="window.open('${previewAsset.url}', '_blank')" 
                                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                              Open Full Size Image
                            </button>
                          `;
                          parent.appendChild(errorDiv);
                        }
                      };
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {previewAsset.content}
                  </pre>
                </div>
              )}
              
              {previewAsset.dimensions && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {previewAsset.dimensions}
                  </Badge>
                  <Badge variant="outline">
                    {previewAsset.type}
                  </Badge>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadAsset(previewAsset)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setPreviewAsset(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
