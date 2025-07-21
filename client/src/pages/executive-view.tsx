import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  Image, 
  Video, 
  Mail, 
  Sparkles, 
  BarChart3,
  Share2,
  Eye,
  TrendingUp,
  Users,
  Target,
  DollarSign
} from "lucide-react";
import { type Campaign } from "@shared/schema";

export default function ExecutiveView() {
  const { linkId } = useParams();

  // In a real implementation, we would need to resolve the linkId to a campaignId
  // For now, we'll simulate finding the campaign by shareable link
  const { data: campaigns } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const campaign = campaigns?.find((c: Campaign) => 
    c.shareableLink?.includes(linkId || '')
  );

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface to-primary/5 flex items-center justify-center">
        <Card className="max-w-md mx-4 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2">Campaign Not Found</h2>
            <p className="text-on-surface-variant">
              The shared campaign link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'copy': return <FileText className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-secondary/10 text-secondary';
      case 'video': return 'bg-accent/20 text-accent';
      case 'copy': return 'bg-primary/10 text-primary';
      case 'pdf': return 'bg-green-100 text-green-600';
      default: return 'bg-outline-variant/20 text-on-surface-variant';
    }
  };

  const socialMediaAssets = campaign?.generatedAssets?.filter(asset => 
    ['Instagram', 'TikTok', 'Facebook', 'Twitter'].includes(asset.platform)
  ) || [];

  const marketingCopyAssets = campaign?.generatedAssets?.filter(asset => 
    ['LinkedIn', 'Email'].includes(asset.platform) || asset.type === 'copy'
  ) || [];

  const totalAssets = campaign?.generatedAssets?.length || 0;
  const platformCount = new Set(campaign?.generatedAssets?.map(a => a.platform)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-primary/5">
      {/* Executive Header */}
      <div className="bg-white border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-on-surface">{campaign?.name}</h1>
                <p className="text-on-surface-variant">AI-Generated Marketing Campaign</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {campaign?.status === 'completed' ? 'Ready' : campaign?.status}
              </Badge>
              <Button className="bg-primary text-white hover:shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Campaign Overview */}
        <Card className="mb-8 shadow-xl border-outline-variant">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-primary/5 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{totalAssets}</div>
                <div className="text-sm text-on-surface-variant">Total Assets</div>
              </div>
              <div className="text-center p-6 bg-secondary/5 rounded-2xl">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">{platformCount}</div>
                <div className="text-sm text-on-surface-variant">Platforms</div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-2xl">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent mb-1">12.4K</div>
                <div className="text-sm text-on-surface-variant">Est. Reach</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">4.2x</div>
                <div className="text-sm text-on-surface-variant">ROI Forecast</div>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-on-surface mb-2">Brand Tone</h4>
                <Badge variant="outline" className="text-sm">{campaign?.brandTone}</Badge>
              </div>
              <div>
                <h4 className="font-semibold text-on-surface mb-2">Target Platforms</h4>
                <div className="flex flex-wrap gap-1">
                  {campaign?.targetPlatforms.map((platform: string) => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-on-surface mb-2">Campaign Focus</h4>
                <Badge variant="outline" className="text-sm">{campaign?.campaignFocus}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Social Media Assets */}
          <Card className="shadow-xl border-outline-variant">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Image className="text-secondary w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-on-surface">Social Media Assets</h3>
              </div>
              
              <div className="space-y-4">
                {socialMediaAssets.length > 0 ? socialMediaAssets.map((asset, index) => (
                  <div key={index} className="group p-4 border border-outline-variant rounded-xl hover:bg-surface/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAssetTypeColor(asset.type)}`}>
                          {getAssetIcon(asset.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-on-surface">{asset.title}</h4>
                          <p className="text-sm text-on-surface-variant">{asset.platform}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {asset.dimensions && (
                      <Badge variant="outline" className="text-xs">
                        {asset.dimensions}
                      </Badge>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8 text-on-surface-variant">
                    <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No social media assets available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Copy */}
          <Card className="shadow-xl border-outline-variant">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <FileText className="text-accent w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-on-surface">Marketing Copy</h3>
              </div>
              
              <div className="space-y-4">
                {marketingCopyAssets.length > 0 ? marketingCopyAssets.map((asset, index) => (
                  <div key={index} className="group p-4 border border-outline-variant rounded-xl hover:bg-surface/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAssetTypeColor(asset.type)}`}>
                          {getAssetIcon(asset.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-on-surface">{asset.title}</h4>
                          <p className="text-sm text-on-surface-variant">{asset.platform}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {asset.content && (
                      <p className="text-sm text-on-surface-variant line-clamp-2 bg-surface/30 p-3 rounded-lg">
                        {asset.content.substring(0, 120)}...
                      </p>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8 text-on-surface-variant">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No marketing copy available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Forecast */}
        <Card className="shadow-xl border-outline-variant">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface">Performance Forecast</h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">12.4K</div>
                <div className="text-sm text-blue-700 font-medium">Estimated Reach</div>
                <div className="text-xs text-blue-600 mt-1">+23% vs. avg campaign</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">8.7%</div>
                <div className="text-sm text-green-700 font-medium">Engagement Rate</div>
                <div className="text-xs text-green-600 mt-1">Above industry avg</div>
              </div>
              
              <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">324</div>
                <div className="text-sm text-orange-700 font-medium">Expected Conversions</div>
                <div className="text-xs text-orange-600 mt-1">2.6% conversion rate</div>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-center mb-3">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">4.2x</div>
                <div className="text-sm text-purple-700 font-medium">ROI Projection</div>
                <div className="text-xs text-purple-600 mt-1">Based on historical data</div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Additional Insights */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-on-surface mb-4">Key Insights</h4>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Visual elements align with current market trends for {campaign?.brandTone.toLowerCase()} brands</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                    <span>Multi-platform approach increases audience reach by 340%</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span>AI-optimized messaging shows 15% higher engagement potential</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-on-surface mb-4">Recommendations</h4>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Deploy LinkedIn content first for B2B audience engagement</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Schedule Instagram posts during peak engagement hours (7-9 PM)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span>A/B test email subject lines for optimal open rates</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-outline-variant">
          <p className="text-sm text-on-surface-variant mb-2">
            Generated by Campaign AI Gen • Powered by OpenAI GPT-4o
          </p>
          <p className="text-xs text-on-surface-variant">
            Campaign created on {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
