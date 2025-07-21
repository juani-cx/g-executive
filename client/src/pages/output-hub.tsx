import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Share2, Edit, Eye, FileText, Image, Video, Mail, Copy, BarChart3 } from "lucide-react";
import { type Campaign } from "@shared/schema";

export default function OutputHub() {
  const { campaignId } = useParams();

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', campaignId],
    enabled: !!campaignId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Campaign not found</h2>
          <p className="text-on-surface-variant">The requested campaign could not be found.</p>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (campaign?.shareableLink) {
      navigator.clipboard.writeText(campaign.shareableLink);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'copy': return <FileText className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const socialMediaAssets = campaign?.generatedAssets?.filter(asset => 
    ['Instagram', 'TikTok', 'Facebook', 'Twitter'].includes(asset.platform)
  ) || [];

  const marketingCopyAssets = campaign?.generatedAssets?.filter(asset => 
    ['LinkedIn', 'Email'].includes(asset.platform) || asset.type === 'copy'
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-primary/5">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold text-on-surface mb-4">Campaign Generated Successfully!</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
            Your AI-powered marketing campaign "{campaign?.name}" is ready. Download individual assets or share the complete campaign with your team.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-12">
          <Button className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-semibold hover:shadow-lg">
            <Download className="w-5 h-5" />
            <span>Download All Assets</span>
          </Button>
          <Button 
            variant="outline"
            onClick={handleCopyLink}
            className="flex items-center space-x-3 px-8 py-4 border-outline-variant rounded-2xl font-semibold hover:bg-surface/50"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Campaign</span>
          </Button>
          <Button 
            variant="outline"
            className="flex items-center space-x-3 px-8 py-4 border-outline-variant rounded-2xl font-semibold hover:bg-surface/50"
          >
            <Edit className="w-5 h-5" />
            <span>Make Changes</span>
          </Button>
        </div>

        {/* Asset Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Social Media Assets */}
          <Card className="shadow-lg border border-outline-variant">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Image className="text-secondary w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-on-surface">Social Media Assets</h3>
              </div>
              
              <div className="space-y-4">
                {socialMediaAssets.length > 0 ? socialMediaAssets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-outline-variant rounded-xl hover:bg-surface/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getAssetIcon(asset.type)}
                      <div>
                        <span className="text-sm font-medium block">{asset.title}</span>
                        <span className="text-xs text-on-surface-variant">{asset.platform}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-on-surface-variant">No social media assets generated</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Copy */}
          <Card className="shadow-lg border border-outline-variant">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <FileText className="text-accent w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-on-surface">Marketing Copy</h3>
              </div>
              
              <div className="space-y-4">
                {marketingCopyAssets.length > 0 ? marketingCopyAssets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-outline-variant rounded-xl hover:bg-surface/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getAssetIcon(asset.type)}
                      <div>
                        <span className="text-sm font-medium block">{asset.title}</span>
                        <span className="text-xs text-on-surface-variant">{asset.platform}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-on-surface-variant">No marketing copy generated</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Executive Sharing */}
          <Card className="shadow-lg border border-outline-variant">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Share2 className="text-primary w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-on-surface">Executive Sharing</h3>
              </div>
              
              <div className="border border-outline-variant rounded-xl p-4 mb-4 bg-surface/30">
                <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-3 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-on-surface-variant" />
                </div>
                <h4 className="font-semibold text-on-surface text-sm mb-2">Campaign Overview</h4>
                <p className="text-xs text-on-surface-variant">Executive-friendly view with download options</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-outline-variant rounded-xl">
                  <span className="text-sm font-medium">Shareable Link</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-outline-variant rounded-xl">
                  <span className="text-sm font-medium">PDF Report</span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-outline-variant rounded-xl">
                  <span className="text-sm font-medium">Analytics Dashboard</span>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Metrics */}
        <Card className="shadow-lg border border-outline-variant">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-on-surface mb-6">Campaign Performance Forecast</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-surface rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">12.4K</div>
                <div className="text-sm text-on-surface-variant">Estimated Reach</div>
              </div>
              <div className="text-center p-6 bg-surface rounded-xl">
                <div className="text-3xl font-bold text-secondary mb-2">8.7%</div>
                <div className="text-sm text-on-surface-variant">Engagement Rate</div>
              </div>
              <div className="text-center p-6 bg-surface rounded-xl">
                <div className="text-3xl font-bold text-accent mb-2">324</div>
                <div className="text-sm text-on-surface-variant">Expected Conversions</div>
              </div>
              <div className="text-center p-6 bg-surface rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">4.2x</div>
                <div className="text-sm text-on-surface-variant">ROI Projection</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
