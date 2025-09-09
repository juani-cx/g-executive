import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Sparkles, 
  Download, 
  MessageCircle, 
  Users, 
  GitBranch, 
  Save,
  X
} from "lucide-react";
import { CanvasCard } from "@/types/canvas";
import { formatDistanceToNow } from "date-fns";

interface AssetDrawerProps {
  card: CanvasCard | null;
  open: boolean;
  onClose: () => void;
  onApplyAI?: (prompt: string) => void;
  onSaveManual?: (data: any) => void;
  onExport?: () => void;
}

export default function AssetDrawer({ 
  card, 
  open, 
  onClose, 
  onApplyAI, 
  onSaveManual, 
  onExport 
}: AssetDrawerProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");

  if (!card) return null;

  const handleApplyAI = () => {
    if (aiPrompt.trim()) {
      onApplyAI?.(aiPrompt);
      setAiPrompt("");
    }
  };

  const handleSave = () => {
    onSaveManual?.({ title, content });
  };

  const activeCollaborators = card.collaborators.filter(c => c.active);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto bg-slate-900/95 backdrop-blur border-slate-700">
        <SheetHeader className="sticky top-0 bg-slate-900/95 backdrop-blur pb-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SheetTitle className="text-slate-100 text-lg">
                {card.title}
              </SheetTitle>
              <Badge className={`${
                card.status === "generating" ? "bg-sky-500/80" :
                card.status === "ready" ? "bg-violet-500/80" :
                card.status === "draft" ? "bg-slate-500/80" :
                "bg-rose-500/80"
              } text-white`}>
                {card.status}
              </Badge>
              <span className="text-sm text-slate-400">v{card.version}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <SheetDescription className="text-slate-400">
              Last edited {formatDistanceToNow(new Date(card.lastEditedAt), { addSuffix: true })} by {card.lastEditedBy}
            </SheetDescription>
            
            {/* Active Collaborators */}
            {activeCollaborators.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-400" />
                <div className="flex items-center -space-x-1">
                  {activeCollaborators.map((collaborator) => (
                    <Avatar 
                      key={collaborator.id} 
                      className="w-6 h-6 border-2 border-violet-400 ring-2 ring-violet-400/30"
                      title={`${collaborator.name} (active)`}
                    >
                      <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} />
                      <AvatarFallback className="text-xs bg-slate-700">
                        {collaborator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue="ai-edit" className="mt-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 text-slate-300">
            <TabsTrigger value="ai-edit" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              AI Edit
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Manual
            </TabsTrigger>
            <TabsTrigger value="versions" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Versions
            </TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Comments
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-edit" className="space-y-4 mt-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200">
                AI Edit Prompt
              </label>
              <Textarea
                placeholder="Describe how you want to modify this asset..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400 min-h-[120px]"
                rows={4}
              />
              <Button 
                onClick={handleApplyAI}
                disabled={!aiPrompt.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Apply AI Changes
              </Button>
            </div>

            {/* Current Content Preview */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200">
                Current Content
              </label>
              <div className="p-4 bg-slate-800 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
                <p className="text-sm text-slate-300 whitespace-pre-wrap">
                  {card.summary || "No content generated yet"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Title</label>
                <Input 
                  value={title || card.title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-slate-100"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Content</label>
                <Textarea 
                  value={content || card.summary}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-slate-100 min-h-[200px]"
                  rows={8}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleSave}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="versions" className="space-y-4 mt-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-200">Version History</span>
              </div>
              
              <div className="space-y-2">
                {Array.from({ length: card.version }, (_, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg border ${
                      i === 0 ? 'bg-violet-900/20 border-violet-600' : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">
                        Version {card.version - i} {i === 0 && '(Current)'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(Date.now() - i * 3600000), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      AI edit: Enhanced content structure and readability
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-200">
                  Comments ({card.counts.comments})
                </span>
              </div>

              {/* Comment Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  rows={3}
                />
                <Button 
                  size="sm"
                  disabled={!comment.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Post Comment
                </Button>
              </div>

              {/* Existing Comments */}
              <div className="space-y-3">
                {Array.from({ length: card.counts.comments }, (_, i) => (
                  <div key={i} className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="/api/placeholder/32/32" />
                        <AvatarFallback className="text-xs bg-slate-700">A</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-200">Ana Martinez</span>
                      <span className="text-xs text-slate-400">2h ago</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      This looks great! Can we make the CTA button more prominent?
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-200">Export Options</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-800"
                  onClick={onExport}
                >
                  <Download className="w-6 h-6 mb-2" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-800"
                  onClick={onExport}
                >
                  <Download className="w-6 h-6 mb-2" />
                  PNG
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-800"
                  onClick={onExport}
                >
                  <Download className="w-6 h-6 mb-2" />
                  PPTX
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-slate-600 text-slate-300 hover:bg-slate-800"
                  onClick={onExport}
                >
                  <Download className="w-6 h-6 mb-2" />
                  HTML
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}