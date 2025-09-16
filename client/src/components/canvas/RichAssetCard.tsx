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

  const formatSummary = (summary: string | undefined) => {
    if (!summary) return '';
    // Convert **bold** text to bold spans
    return summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const activeCollaborators = (card.collaborators || []).filter(c => c.active);
  const displayCollaborators = (card.collaborators || []).slice(0, 3);
  const overflowCount = Math.max(0, (card.collaborators || []).length - 3);

  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="md-card md-state-layer w-80 min-h-fit p-4 cursor-pointer"
        onClick={onExpand}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${card.title}, ${card.status}, ${(card.counts?.comments || 0)} comments, edited ${card.lastEditedAt ? formatDistanceToNow(new Date(card.lastEditedAt)) : 'recently'} ago`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-4 h-4" style={{ color: 'var(--md-sys-color-primary)' }} />
            <span className="md-typescale-title-medium text-gray-900 truncate">{card.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(card.status)} text-white text-xs px-2 py-1`}>
              {card.status}
            </Badge>
            <span className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>v{card.version}</span>
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

        {/* Preview Image */}
        <div className="mb-3 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }}>
          <img 
            src={card.thumbnailUrl || "/api/placeholder/320/120"}
            alt={`${card.type} preview`}
            className="w-full h-20 object-cover"
          />
        </div>

        {/* Status Indicator */}
        {card.status === "generating" && (
          <div className="mb-3 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400 mr-2" />
            <span className="text-xs text-sky-400">Generating...</span>
          </div>
        )}
        {card.status === "error" && (
          <div className="mb-3 flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onRetry?.();
              }}
              className="text-rose-400 hover:text-rose-300 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Summary */}
        <div className="mb-3">
          <p 
            className="md-typescale-body-medium line-clamp-2 leading-relaxed"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            dangerouslySetInnerHTML={{ __html: formatSummary(card.summary) }}
          />
        </div>

        {/* Badges Row */}
        <div className="flex items-center space-x-3 mb-3 md-typescale-body-medium">
          <div className="flex items-center space-x-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            <Image className="w-3 h-3" />
            <span>{card.counts?.images || 0}</span>
          </div>
          <div className="flex items-center space-x-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            <Layers className="w-3 h-3" />
            <span>{card.counts?.sections || 0}</span>
          </div>
          <div className="flex items-center space-x-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            <Type className="w-3 h-3" />
            <span>{formatCount(card.counts?.words || 0)}</span>
          </div>
          <div className="flex items-center space-x-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            <GitBranch className="w-3 h-3" />
            <span>{card.counts?.variants || 0}</span>
          </div>
          <div className="flex items-center space-x-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            <Sparkles className="w-3 h-3" />
            <span>{card.counts?.aiEdits || 0}</span>
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
            {(card.counts?.comments || 0) > 0 && (
              <div className="flex items-center space-x-1 text-gray-600">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">{card.counts?.comments || 0}</span>
              </div>
            )}
          </div>

          {/* Last Edited */}
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">
              {card.lastEditedAt ? formatDistanceToNow(new Date(card.lastEditedAt), { addSuffix: true }) : 'recently'}
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