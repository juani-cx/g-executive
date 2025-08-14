import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Presence } from "@shared/schema";

interface PresenceIndicatorsProps {
  presences: Presence[];
  currentUserEphemeralId?: string;
  maxVisible?: number;
}

export default function PresenceIndicators({ 
  presences, 
  currentUserEphemeralId, 
  maxVisible = 5 
}: PresenceIndicatorsProps) {
  const otherUsers = presences.filter(p => p.ephemeralId !== currentUserEphemeralId);
  const visibleUsers = otherUsers.slice(0, maxVisible);
  const hiddenCount = Math.max(0, otherUsers.length - maxVisible);

  if (otherUsers.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {visibleUsers.map((presence) => (
            <Tooltip key={presence.ephemeralId}>
              <TooltipTrigger asChild>
                <Avatar 
                  className="w-8 h-8 border-2 border-white cursor-pointer transition-transform hover:scale-110"
                  style={{ borderColor: presence.color }}
                >
                  <AvatarFallback 
                    style={{ backgroundColor: presence.color }}
                    className="text-white text-xs font-medium"
                  >
                    {presence.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="glass-surface border-glass-border">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: presence.color }}
                  />
                  <span>{presence.displayName}</span>
                  <Badge 
                    variant={presence.status === "online" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {presence.status}
                  </Badge>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {hiddenCount > 0 && (
            <Avatar className="w-8 h-8 border-2 border-white bg-gray-100">
              <AvatarFallback className="text-xs font-medium text-gray-600">
                +{hiddenCount}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        
        <Badge variant="outline" className="text-xs bg-white/10 border-white/20">
          {otherUsers.length} collaborator{otherUsers.length !== 1 ? 's' : ''}
        </Badge>
      </div>
    </TooltipProvider>
  );
}

// Live cursor component
interface LiveCursorProps {
  cursor: { x: number; y: number };
  displayName: string;
  color: string;
  isVisible: boolean;
}

export function LiveCursor({ cursor, displayName, color, isVisible }: LiveCursorProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-100"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Cursor Icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-lg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      
      {/* Name Tag */}
      <div
        className="ml-4 -mt-1 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap drop-shadow-lg"
        style={{ backgroundColor: color }}
      >
        {displayName}
      </div>
    </div>
  );
}