import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Target, Globe } from "lucide-react";
// Using any type for campaign since we need to handle the campaign data structure
interface CampaignData {
  id: number;
  name: string;
  campaignFocus?: string;
  description?: string;
  targetPlatforms?: string[];
  campaignGoals?: string[];
  brandTone?: string;
}

interface CampaignConfigCardProps {
  campaign: CampaignData;
  className?: string;
}

export default function CampaignConfigCard({ campaign, className = "" }: CampaignConfigCardProps) {
  return (
    <Card className={`glass-surface border-glass-border w-80 h-96 overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(99,102,241,0.2)] flex items-center justify-center">
            <Settings className="w-4 h-4 text-[#6366f1]" />
          </div>
          <div>
            <h3 className="font-medium text-glass-text-primary">Campaign Configuration</h3>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-glass-text-muted">ready</span>
              <span className="text-xs text-glass-text-muted ml-2">v1</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {campaign.campaignFocus && (
          <div>
            <h4 className="text-sm font-medium text-glass-text-primary mb-2">Description</h4>
            <p className="text-sm text-glass-text-secondary leading-relaxed">
              {campaign.campaignFocus}
            </p>
          </div>
        )}

        {/* Prompt */}
        {campaign.description && (
          <div>
            <h4 className="text-sm font-medium text-glass-text-primary mb-2">Prompt</h4>
            <p className="text-sm text-glass-text-secondary leading-relaxed bg-[rgba(255,255,255,0.03)] rounded-lg p-3 border border-glass-border">
              {campaign.description}
            </p>
          </div>
        )}

        {/* Platforms Tags */}
        {campaign.targetPlatforms && campaign.targetPlatforms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-glass-text-primary mb-2 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Platforms
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {campaign.targetPlatforms.map((platform, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-[rgba(99,102,241,0.1)] text-[#6366f1] border border-[rgba(99,102,241,0.2)] hover:bg-[rgba(99,102,241,0.15)]"
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Goals Tags */}
        {campaign.campaignGoals && campaign.campaignGoals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-glass-text-primary mb-2 flex items-center gap-2">
              <Target className="w-3 h-3" />
              Goals
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {campaign.campaignGoals.map((goal, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-[rgba(34,197,94,0.1)] text-green-600 border border-[rgba(34,197,94,0.2)] hover:bg-[rgba(34,197,94,0.15)]"
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Brand Tone */}
        {campaign.brandTone && (
          <div>
            <h4 className="text-sm font-medium text-glass-text-primary mb-2">Brand Tone</h4>
            <Badge 
              variant="outline" 
              className="text-xs border-glass-border text-glass-text-secondary bg-[rgba(255,255,255,0.02)]"
            >
              {campaign.brandTone}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}