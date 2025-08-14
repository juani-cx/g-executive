import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { type Presence, type LiveCursor } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CollaborationHookProps {
  canvasId: number;
  linkToken?: string;
  accessCode?: string;
  displayName: string;
  userId?: string;
  enabled?: boolean;
}

interface CollaborationState {
  socket: Socket | null;
  isConnected: boolean;
  presences: Presence[];
  cursors: Map<string, LiveCursor>;
  currentUserEphemeralId: string | null;
  role: "edit" | "view";
  connectionStatus: "connecting" | "connected" | "reconnecting" | "disconnected";
}

export function useCollaboration({
  canvasId,
  linkToken,
  accessCode,
  displayName,
  userId,
  enabled = true
}: CollaborationHookProps) {
  const { toast } = useToast();
  const [state, setState] = useState<CollaborationState>({
    socket: null,
    isConnected: false,
    presences: [],
    cursors: new Map(),
    currentUserEphemeralId: null,
    role: "view",
    connectionStatus: "disconnected"
  });

  const socketRef = useRef<Socket | null>(null);
  const cursorThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const lastCursorUpdate = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || !canvasId) return;

    // Initialize socket connection
    const socket = io({
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to collaboration server');
      setState(prev => ({ ...prev, isConnected: true, connectionStatus: "connecting" }));
      
      // Join canvas room
      socket.emit('join-canvas', {
        canvasId,
        linkToken,
        accessCode,
        displayName,
        userId
      });
    });

    socket.on('canvas-joined', (data: {
      ephemeralId: string;
      role: "edit" | "view";
      presences: Presence[];
      shareSettings: any;
    }) => {
      console.log('Successfully joined canvas:', data);
      setState(prev => ({
        ...prev,
        currentUserEphemeralId: data.ephemeralId,
        role: data.role,
        presences: data.presences,
        connectionStatus: "connected"
      }));

      toast({
        title: "Connected",
        description: "You're now collaborating in real-time!",
      });
    });

    socket.on('join-error', (error: { message: string; maxCollaborators?: number }) => {
      console.error('Failed to join canvas:', error);
      setState(prev => ({ ...prev, connectionStatus: "disconnected" }));
      
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    });

    socket.on('user-joined', (presence: Presence) => {
      setState(prev => ({
        ...prev,
        presences: [...prev.presences, presence]
      }));

      toast({
        title: "User Joined",
        description: `${presence.displayName} joined the canvas`,
      });
    });

    socket.on('user-left', (data: { ephemeralId: string }) => {
      setState(prev => {
        const newCursors = new Map(prev.cursors);
        newCursors.delete(data.ephemeralId);
        
        return {
          ...prev,
          presences: prev.presences.filter(p => p.ephemeralId !== data.ephemeralId),
          cursors: newCursors
        };
      });
    });

    socket.on('cursor-update', (data: { ephemeralId: string; cursor: { x: number; y: number } }) => {
      setState(prev => {
        const presence = prev.presences.find(p => p.ephemeralId === data.ephemeralId);
        if (!presence) return prev;

        const newCursors = new Map(prev.cursors);
        newCursors.set(data.ephemeralId, {
          x: data.cursor.x,
          y: data.cursor.y,
          ephemeralId: data.ephemeralId,
          displayName: presence.displayName,
          color: presence.color
        });

        return { ...prev, cursors: newCursors };
      });
    });

    socket.on('selection-update', (data: { ephemeralId: string; selection: string | null }) => {
      setState(prev => ({
        ...prev,
        presences: prev.presences.map(p =>
          p.ephemeralId === data.ephemeralId
            ? { ...p, selection: data.selection }
            : p
        )
      }));
    });

    socket.on('card-locked', (data: { cardId: string; lockedBy: string }) => {
      // Handle card lock events in parent component
      window.dispatchEvent(new CustomEvent('card-locked', { detail: data }));
    });

    socket.on('card-unlocked', (data: { cardId: string }) => {
      // Handle card unlock events in parent component
      window.dispatchEvent(new CustomEvent('card-unlocked', { detail: data }));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        connectionStatus: "disconnected",
        cursors: new Map()
      }));
    });

    socket.on('reconnect', () => {
      console.log('Reconnected to collaboration server');
      setState(prev => ({ ...prev, connectionStatus: "reconnecting" }));
    });

    setState(prev => ({ ...prev, socket }));

    return () => {
      if (cursorThrottleRef.current) {
        clearTimeout(cursorThrottleRef.current);
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [canvasId, linkToken, accessCode, displayName, userId, enabled, toast]);

  // Cursor movement handler with throttling
  const updateCursor = (x: number, y: number) => {
    if (!state.socket?.connected || state.role !== "edit") return;

    lastCursorUpdate.current = { x, y };

    if (cursorThrottleRef.current) return;

    cursorThrottleRef.current = setTimeout(() => {
      if (state.socket?.connected) {
        state.socket.emit('cursor-move', lastCursorUpdate.current);
      }
      cursorThrottleRef.current = null;
    }, 1000 / 24); // 24fps limit
  };

  // Card selection handler
  const selectCard = (cardId: string | null) => {
    if (!state.socket?.connected) return;
    state.socket.emit('card-select', { cardId });
  };

  // Card locking handlers
  const lockCard = (cardId: string) => {
    if (!state.socket?.connected || state.role !== "edit") return;
    state.socket.emit('card-lock', { cardId });
  };

  const unlockCard = (cardId: string) => {
    if (!state.socket?.connected || state.role !== "edit") return;
    state.socket.emit('card-unlock', { cardId });
  };

  return {
    ...state,
    updateCursor,
    selectCard,
    lockCard,
    unlockCard
  };
}