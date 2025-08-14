import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  Copy, 
  Link, 
  Users, 
  Shield, 
  RefreshCw,
  Eye,
  Edit3
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasId: number;
}

interface ShareSettings {
  enabled: boolean;
  role: "edit" | "view";
  linkToken: string;
  accessCode?: string;
  maxCollaborators: number;
}

export default function ShareModal({ open, onOpenChange, canvasId }: ShareModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<ShareSettings>({
    enabled: false,
    role: "view",
    linkToken: "",
    maxCollaborators: 10
  });
  const [shareUrl, setShareUrl] = useState<string>("");
  const [emailInvites, setEmailInvites] = useState<string>("");

  // Get current collaboration state
  const { data: collaborationState } = useQuery({
    queryKey: [`/api/campaigns/${canvasId}/collaboration`],
    enabled: open
  });

  // Update share settings
  const updateShareMutation = useMutation({
    mutationFn: async (newSettings: Partial<ShareSettings>) => {
      const response = await apiRequest('POST', `/api/campaigns/${canvasId}/share`, newSettings);
      return await response.json();
    },
    onSuccess: (data) => {
      setSettings(prev => ({ ...prev, ...data.shareSettings }));
      setShareUrl(data.shareUrl || "");
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${canvasId}/collaboration`] });
      toast({
        title: "Share settings updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      console.error('Error updating share settings:', error);
      toast({
        title: "Error",
        description: "Failed to update share settings.",
        variant: "destructive",
      });
    }
  });

  const handleToggleSharing = (enabled: boolean) => {
    const newSettings = { ...settings, enabled };
    updateShareMutation.mutate(newSettings);
  };

  const handleRoleChange = (role: "edit" | "view") => {
    const newSettings = { ...settings, role };
    updateShareMutation.mutate(newSettings);
  };

  const handleMaxCollaboratorsChange = (maxCollaborators: number) => {
    const newSettings = { ...settings, maxCollaborators };
    updateShareMutation.mutate(newSettings);
  };

  const handleAccessCodeChange = (accessCode: string) => {
    const newSettings = { ...settings, accessCode: accessCode || undefined };
    updateShareMutation.mutate(newSettings);
  };

  const handleRegenerateLink = () => {
    updateShareMutation.mutate({ enabled: true, ...settings });
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Share & Collaborate
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Invite others to collaborate on this canvas in real-time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Enable Sharing Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 font-medium">
                Enable Collaboration
              </Label>
              <p className="text-sm text-gray-600">
                Allow others to join this canvas
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={handleToggleSharing}
              disabled={updateShareMutation.isPending}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Access Level */}
              <div className="space-y-2">
                <Label className="text-gray-900">Access Level</Label>
                <Select value={settings.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="bg-white/90 border border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Can view
                      </div>
                    </SelectItem>
                    <SelectItem value="edit">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Can edit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  {settings.role === "edit" 
                    ? "Collaborators can edit cards and elements" 
                    : "Collaborators can only view the canvas"
                  }
                </p>
              </div>

              {/* Share Link */}
              <div className="space-y-2">
                <Label className="text-gray-900">Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="bg-white/90 border border-gray-300 flex-1"
                    placeholder="Generate link to share..."
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    disabled={!shareUrl}
                    className="bg-white/90 border border-gray-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRegenerateLink}
                    disabled={updateShareMutation.isPending}
                    className="bg-white/90 border border-gray-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Max Collaborators */}
              <div className="space-y-2">
                <Label className="text-glass-text-primary">Max Collaborators</Label>
                <Select 
                  value={settings.maxCollaborators.toString()} 
                  onValueChange={(value) => handleMaxCollaboratorsChange(parseInt(value))}
                >
                  <SelectTrigger className="glass-surface border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 5, 10, 15, 25, 50].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} collaborators
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {collaborationState && (
                  <p className="text-xs text-glass-text-muted">
                    Currently: {collaborationState.currentUserCount}/{settings.maxCollaborators} active
                  </p>
                )}
              </div>

              {/* Access Code (Optional) */}
              <div className="space-y-2">
                <Label className="text-glass-text-primary flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Access Code (Optional)
                </Label>
                <Input
                  placeholder="Leave empty for open access"
                  value={settings.accessCode || ""}
                  onChange={(e) => handleAccessCodeChange(e.target.value)}
                  className="glass-surface border-glass-border"
                />
                <p className="text-xs text-glass-text-muted">
                  Require a code for additional security
                </p>
              </div>

              {/* Email Invitations (Optional) */}
              <div className="space-y-2">
                <Label className="text-glass-text-primary">Invite by Email (Optional)</Label>
                <Textarea
                  placeholder="Enter email addresses separated by commas"
                  value={emailInvites}
                  onChange={(e) => setEmailInvites(e.target.value)}
                  className="glass-surface border-glass-border"
                  rows={3}
                />
                <Button 
                  variant="outline" 
                  className="glass-surface border-glass-border"
                  disabled={!emailInvites.trim()}
                >
                  Send Invitations
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}