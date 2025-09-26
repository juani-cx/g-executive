import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  Link, 
  Clock, 
  RefreshCw,
  FileText,
  Instagram,
  Linkedin,
  Presentation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Array<{
    id: string;
    type: string;
    title: string;
    status: "ready" | "generating" | "error";
  }>;
}

interface ExportLink {
  url: string;
  expiresAt: string;
}

export default function DownloadModal({ open, onOpenChange, assets }: DownloadModalProps) {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<"png" | "pdf" | "zip">("png");
  const [linkDuration, setLinkDuration] = useState<"1h" | "24h" | "7d">("24h");
  const [exportLinks, setExportLinks] = useState<Record<string, ExportLink>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "slides": return <Presentation className="w-4 h-4" />;
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "linkedin": return <Linkedin className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const generateDownloadLink = async (assetId: string) => {
    setIsGenerating(prev => ({ ...prev, [assetId]: true }));
    
    try {
      // Simulate API call to generate expirable download link
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const expirationHours = linkDuration === "1h" ? 1 : linkDuration === "24h" ? 24 : 168;
      const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
      
      const exportLink: ExportLink = {
        url: `${window.location.origin}/download/${assetId}?format=${exportFormat}&token=temp-token`,
        expiresAt: expiresAt.toISOString()
      };
      
      setExportLinks(prev => ({ ...prev, [assetId]: exportLink }));
      
      toast({
        title: "Download link generated",
        description: `Link expires in ${linkDuration === "1h" ? "1 hour" : linkDuration === "24h" ? "24 hours" : "7 days"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate download link",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [assetId]: false }));
    }
  };

  const copyLinkToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Download link has been copied to clipboard.",
    });
  };

  const downloadDirect = (assetId: string) => {
    // Direct download without expirable link
    const downloadUrl = `/api/assets/${assetId}/download?format=${exportFormat}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `asset-${assetId}.${exportFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your asset download has started.",
    });
  };

  const readyAssets = assets.filter(asset => asset.status === "ready");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ fontSize: '24px', lineHeight: 1, fontWeight: 500, margin: '16px 0 8px' }}>
            <Download className="w-5 h-5" />
            Download Assets
          </DialogTitle>
          <DialogDescription>
            Download your generated assets or create expirable links for sharing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: "png" | "pdf" | "zip") => setExportFormat(value)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG Image</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="zip">ZIP Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="duration">Link Duration</Label>
              <Select value={linkDuration} onValueChange={(value: "1h" | "24h" | "7d") => setLinkDuration(value)}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assets List */}
          <div className="space-y-3">
            <Label>Available Assets ({readyAssets.length})</Label>
            
            {readyAssets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No assets ready for download</p>
                <p className="text-sm">Wait for assets to finish generating</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {readyAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAssetIcon(asset.type)}
                      <div>
                        <div className="font-medium text-sm">{asset.title}</div>
                        <div className="text-xs text-gray-500 capitalize">{asset.type}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {exportLinks[asset.id] && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-gray-500">
                            Expires {new Date(exportLinks[asset.id].expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadDirect(asset.id)}
                        className="h-8 px-2"
                        title="Direct Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      {exportLinks[asset.id] ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyLinkToClipboard(exportLinks[asset.id].url)}
                          className="h-8 px-2"
                          title="Copy Share Link"
                        >
                          <Link className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateDownloadLink(asset.id)}
                          disabled={isGenerating[asset.id]}
                          className="h-8 px-2"
                          title="Generate Share Link"
                        >
                          {isGenerating[asset.id] ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Link className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Download All */}
          {readyAssets.length > 0 && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  readyAssets.forEach(asset => downloadDirect(asset.id));
                }}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All Assets ({readyAssets.length})
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}