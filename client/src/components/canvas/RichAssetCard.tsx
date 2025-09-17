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
    <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-xl">
      <div className="p-8">
        {/* Image */}
        <div className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
          <img 
            src={card.thumbnailUrl || "/api/placeholder/320/192"}
            alt={`${card.type} preview`}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* Style Badge */}
        <div className="mb-4">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl text-gray-800 mb-4" style={{ fontWeight: '475' }}>
          {card.title}
        </h3>
        
        {/* Description */}
        <p className="text-base text-gray-600 mb-6" style={{ fontWeight: '400' }}>
          {card.summary}
        </p>
        
        {/* Learn More Button */}
        <Button 
          variant="outline" 
          className="text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}