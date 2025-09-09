import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Presentation, 
  Globe, 
  Linkedin, 
  Instagram, 
  Image, 
  Layers, 
  Type, 
  GitBranch, 
  Sparkles, 
  MessageCircle, 
  Users, 
  Clock, 
  MoreVertical, 
  Maximize2,
  Copy,
  Download,
  Trash2,
  Loader2,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CanvasCard, CardType } from "@/types/canvas";
import { formatDistanceToNow } from "date-fns";

interface RichAssetCardProps {
  card: CanvasCard;
  onExpand: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  onRetry?: () => void;
}

const getCardIcon = (type: CardType) => {
  switch (type) {
    case "slides": return Presentation;
    case "landing": return Globe;
    case "linkedin": return Linkedin;
    case "instagram": return Instagram;
    default: return Presentation;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "generating": return "bg-sky-500/80";
    case "ready": return "bg-violet-500/80";
    case "draft": return "bg-slate-500/80";
    case "error": return "bg-rose-500/80";
    default: return "bg-slate-500/80";
  }
};

const formatCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
};

export default function RichAssetCard({ 
  card, 
  onExpand, 
  onDuplicate, 
  onExport, 
  onDelete, 
  onRetry 
}: RichAssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getCardIcon(card.type);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onExpand();
    }
  };

  const formatSummary = (summary: string) => {
    // Convert **bold** text to bold spans
    return summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const activeCollaborators = card.collaborators.filter(c => c.active);
  const displayCollaborators = card.collaborators.slice(0, 3);
  const overflowCount = Math.max(0, card.collaborators.length - 3);

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-80 h-64 rounded-2xl shadow-xl bg-gradient-to-br from-white/90 to-white/80 backdrop-blur border border-gray-200 text-gray-900 p-4 cursor-pointer transition-all duration-200"
        onClick={onExpand}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${card.title}, ${card.status}, ${card.counts.comments} comments, edited ${formatDistanceToNow(new Date(card.lastEditedAt))} ago`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-4 h-4 text-violet-600" />
            <span className="font-medium text-sm truncate">{card.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(card.status)} text-white text-xs px-2 py-1`}>
              {card.status}
            </Badge>
            <span className="text-xs text-gray-600">v{card.version}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Preview Strip */}
        <div className="mb-3">
          {card.status === "generating" ? (
            <div className="w-full h-16 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            </div>
          ) : card.status === "error" ? (
            <div className="w-full h-16 bg-rose-900/20 rounded-lg flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry?.();
                }}
                className="text-rose-400 hover:text-rose-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : (
            <div className="w-full h-16 bg-gradient-to-r from-violet-500/20 to-sky-500/20 rounded-lg flex items-center justify-center">
              {card.thumbnailUrl ? (
                <img 
                  src={card.thumbnailUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <IconComponent className="w-8 h-8 text-gray-600" />
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mb-3">
          <p 
            className="text-xs text-gray-700 line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatSummary(card.summary) }}
          />
        </div>

        {/* Badges Row */}
        <div className="flex items-center space-x-3 mb-3 text-xs">
          <div className="flex items-center space-x-1 text-gray-600">
            <Image className="w-3 h-3" />
            <span>{card.counts.images}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Layers className="w-3 h-3" />
            <span>{card.counts.sections}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Type className="w-3 h-3" />
            <span>{formatCount(card.counts.words)}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <GitBranch className="w-3 h-3" />
            <span>{card.counts.variants}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Sparkles className="w-3 h-3" />
            <span>{card.counts.aiEdits}</span>
          </div>
          
          {/* Social Extras */}
          {card.hashtags && card.hashtags.length > 0 && (
            <div className="flex items-center space-x-1">
              {card.hashtags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs px-1 py-0 text-sky-400 border-sky-400/30">
                  {tag}
                </Badge>
              ))}
              {card.hashtags.length > 2 && (
                <span className="text-xs text-gray-500">+{card.hashtags.length - 2}</span>
              )}
            </div>
          )}
          
          {card.aspect && (
            <Badge variant="outline" className="text-xs px-1 py-0 text-violet-400 border-violet-400/30">
              {card.aspect}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Collaborators */}
            <div className="flex items-center -space-x-1">
              {displayCollaborators.map((collaborator, i) => (
                <Avatar 
                  key={collaborator.id} 
                  className={`w-6 h-6 border-2 ${
                    collaborator.active 
                      ? 'border-violet-400 ring-2 ring-violet-400/30' 
                      : 'border-gray-400'
                  } transition-all duration-200`}
                >
                  <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} />
                  <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                    {collaborator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {overflowCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{overflowCount}</span>
                </div>
              )}
            </div>

            {/* Comments */}
            {card.counts.comments > 0 && (
              <div className="flex items-center space-x-1 text-gray-600">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">{card.counts.comments}</span>
              </div>
            )}
          </div>

          {/* Last Edited */}
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">
              {formatDistanceToNow(new Date(card.lastEditedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && card.status !== "generating" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/80 backdrop-blur rounded-full px-3 py-1"
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 text-xs text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              Expand
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 text-xs text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.();
              }}
            >
              <Copy className="w-3 h-3 mr-1" />
              Duplicate
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 text-xs text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onExport?.();
              }}
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}