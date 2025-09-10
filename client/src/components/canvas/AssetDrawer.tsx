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
import UnifiedContentEditor from "./UnifiedContentEditor";
import CardPreview from "./CardPreview";

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
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto bg-white/80 backdrop-blur border-gray-200">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SheetTitle className="text-gray-900 text-lg">
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
              <span className="text-sm text-gray-600">v{card.version}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <SheetDescription className="text-gray-600">
              Last edited {formatDistanceToNow(new Date(card.lastEditedAt), { addSuffix: true })} by {card.lastEditedBy}
            </SheetDescription>
            
            {/* Active Collaborators */}
            {activeCollaborators.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <div className="flex items-center -space-x-1">
                  {activeCollaborators.map((collaborator) => (
                    <Avatar 
                      key={collaborator.id} 
                      className="w-6 h-6 border-2 border-violet-400 ring-2 ring-violet-400/30"
                      title={`${collaborator.name} (active)`}
                    >
                      <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} />
                      <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                        {collaborator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue="preview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 text-gray-700">
            <TabsTrigger value="preview" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Preview
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Edit
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

          <TabsContent value="preview" className="space-y-4 mt-6">
            <CardPreview card={card} />
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 mt-6">
            <UnifiedContentEditor 
              card={card}
              onSave={onSaveManual}
              onApplyAI={onApplyAI}
            />
          </TabsContent>

          <TabsContent value="versions" className="space-y-4 mt-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Version History</span>
              </div>
              
              <div className="space-y-2">
                {Array.from({ length: card.version }, (_, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg border ${
                      i === 0 ? 'bg-violet-100 border-violet-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Version {card.version - i} {i === 0 && '(Current)'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(Date.now() - i * 3600000), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
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
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Comments ({card.counts.comments})
                </span>
              </div>

              {/* Comment Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
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
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="/api/placeholder/32/32" />
                        <AvatarFallback className="text-xs bg-gray-200 text-gray-700">A</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">Ana Martinez</span>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-700">
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
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Export Options</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onExport}
                >
                  <Download className="w-6 h-6 mb-2" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onExport}
                >
                  <Download className="w-6 h-6 mb-2" />
                  PNG
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onExport}
                >
                  <Download className="w-6 h-6 mb-2" />
                  PPTX
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-gray-300 text-gray-700 hover:bg-gray-50"
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