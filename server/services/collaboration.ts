import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { storage } from "../storage";
import { LiveCursor, type Presence, type InsertPresence } from "@shared/schema";
import { createHash } from "crypto";

interface CollaborationRoom {
  canvasId: number;
  presences: Map<string, Presence>;
  lastActivity: number;
}

export class CollaborationService {
  private io: SocketIOServer;
  private rooms: Map<number, CollaborationRoom> = new Map();
  private userColors: string[] = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", 
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D2B4DE"
  ];

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.setupEventHandlers();
    
    // Cleanup inactive rooms every 5 minutes
    setInterval(() => this.cleanupInactiveRooms(), 5 * 60 * 1000);
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on("join-canvas", async (data) => {
        await this.handleJoinCanvas(socket, data);
      });

      socket.on("cursor-move", (data) => {
        this.handleCursorMove(socket, data);
      });

      socket.on("card-select", (data) => {
        this.handleCardSelect(socket, data);
      });

      socket.on("card-lock", (data) => {
        this.handleCardLock(socket, data);
      });

      socket.on("card-unlock", (data) => {
        this.handleCardUnlock(socket, data);
      });

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private async handleJoinCanvas(socket: any, data: {
    canvasId: number;
    linkToken?: string;
    accessCode?: string;
    displayName: string;
    userId?: string;
  }) {
    try {
      const { canvasId, linkToken, accessCode, displayName, userId } = data;
      
      // Verify access permissions
      const campaign = await storage.getCampaign(canvasId);
      if (!campaign) {
        socket.emit("join-error", { message: "Canvas not found" });
        return;
      }

      const shareSettings = campaign.shareSettings;
      if (!shareSettings?.enabled || (linkToken && shareSettings.linkToken !== linkToken)) {
        socket.emit("join-error", { message: "Invalid access link" });
        return;
      }

      if (shareSettings.accessCode && shareSettings.accessCode !== accessCode) {
        socket.emit("join-error", { message: "Access code required" });
        return;
      }

      // Check collaborator limit
      const room = this.rooms.get(canvasId) || this.createRoom(canvasId);
      if (room.presences.size >= shareSettings.maxCollaborators) {
        socket.emit("join-error", { 
          message: "Canvas is full", 
          maxCollaborators: shareSettings.maxCollaborators 
        });
        return;
      }

      // Generate ephemeral ID and assign color
      const ephemeralId = this.generateEphemeralId(socket.id);
      const color = this.assignUserColor(ephemeralId);
      
      // Create presence record
      const presence: Presence = {
        id: 0, // Will be set by database
        canvasId,
        userId: userId || null,
        ephemeralId,
        displayName,
        color,
        cursor: null,
        selection: null,
        status: "online",
        joinedAt: new Date(),
        lastPingAt: new Date()
      };

      // Store in database
      const savedPresence = await storage.createPresence(presence);
      
      // Add to room
      room.presences.set(ephemeralId, savedPresence);
      room.lastActivity = Date.now();

      // Join socket room
      socket.join(`canvas-${canvasId}`);
      socket.data = { canvasId, ephemeralId, role: shareSettings.role };

      // Send current state to joining user
      socket.emit("canvas-joined", {
        ephemeralId,
        role: shareSettings.role,
        presences: Array.from(room.presences.values()),
        shareSettings
      });

      // Notify others of new user
      socket.to(`canvas-${canvasId}`).emit("user-joined", savedPresence);

      console.log(`User ${displayName} joined canvas ${canvasId}`);

    } catch (error) {
      console.error("Error handling join canvas:", error);
      socket.emit("join-error", { message: "Failed to join canvas" });
    }
  }

  private handleCursorMove(socket: any, data: { x: number; y: number }) {
    const { canvasId, ephemeralId } = socket.data;
    if (!canvasId || !ephemeralId) return;

    const room = this.rooms.get(canvasId);
    if (!room) return;

    const presence = room.presences.get(ephemeralId);
    if (!presence) return;

    // Update cursor position
    presence.cursor = { x: data.x, y: data.y };
    presence.lastPingAt = new Date();

    // Broadcast to others in room (throttled on client side)
    socket.to(`canvas-${canvasId}`).emit("cursor-update", {
      ephemeralId,
      cursor: presence.cursor
    });
  }

  private handleCardSelect(socket: any, data: { cardId: string | null }) {
    const { canvasId, ephemeralId } = socket.data;
    if (!canvasId || !ephemeralId) return;

    const room = this.rooms.get(canvasId);
    if (!room) return;

    const presence = room.presences.get(ephemeralId);
    if (!presence) return;

    presence.selection = data.cardId;
    
    socket.to(`canvas-${canvasId}`).emit("selection-update", {
      ephemeralId,
      selection: data.cardId
    });
  }

  private async handleCardLock(socket: any, data: { cardId: string }) {
    const { canvasId, ephemeralId, role } = socket.data;
    if (!canvasId || !ephemeralId || role !== "edit") return;

    try {
      // Update card lock in database
      await storage.lockCard(canvasId, data.cardId, ephemeralId);
      
      // Broadcast lock status
      this.io.to(`canvas-${canvasId}`).emit("card-locked", {
        cardId: data.cardId,
        lockedBy: ephemeralId
      });
    } catch (error) {
      console.error("Error locking card:", error);
    }
  }

  private async handleCardUnlock(socket: any, data: { cardId: string }) {
    const { canvasId, ephemeralId } = socket.data;
    if (!canvasId || !ephemeralId) return;

    try {
      await storage.unlockCard(canvasId, data.cardId, ephemeralId);
      
      this.io.to(`canvas-${canvasId}`).emit("card-unlocked", {
        cardId: data.cardId
      });
    } catch (error) {
      console.error("Error unlocking card:", error);
    }
  }

  private async handleDisconnect(socket: any) {
    const { canvasId, ephemeralId } = socket.data;
    if (!canvasId || !ephemeralId) return;

    try {
      const room = this.rooms.get(canvasId);
      if (room) {
        room.presences.delete(ephemeralId);
        
        // Update database
        await storage.removePresence(ephemeralId);
        
        // Notify others
        socket.to(`canvas-${canvasId}`).emit("user-left", { ephemeralId });
        
        // Clean up empty rooms
        if (room.presences.size === 0) {
          this.rooms.delete(canvasId);
        }
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  private createRoom(canvasId: number): CollaborationRoom {
    const room: CollaborationRoom = {
      canvasId,
      presences: new Map(),
      lastActivity: Date.now()
    };
    this.rooms.set(canvasId, room);
    return room;
  }

  private generateEphemeralId(socketId: string): string {
    return createHash('sha256').update(socketId + Date.now()).digest('hex').substring(0, 16);
  }

  private assignUserColor(ephemeralId: string): string {
    // Use hash of ephemeralId to consistently assign colors
    const hash = createHash('sha256').update(ephemeralId).digest('hex');
    const index = parseInt(hash.substring(0, 2), 16) % this.userColors.length;
    return this.userColors[index];
  }

  private cleanupInactiveRooms() {
    const now = Date.now();
    const INACTIVE_THRESHOLD = 10 * 60 * 1000; // 10 minutes

    for (const [canvasId, room] of this.rooms.entries()) {
      if (now - room.lastActivity > INACTIVE_THRESHOLD) {
        console.log(`Cleaning up inactive room: ${canvasId}`);
        this.rooms.delete(canvasId);
      }
    }
  }

  // Public methods for external use
  public async generateShareLink(canvasId: number): Promise<string> {
    const linkToken = createHash('sha256').update(`${canvasId}-${Date.now()}-${Math.random()}`).digest('hex').substring(0, 32);
    await storage.updateCampaignShareSettings(canvasId, { linkToken });
    return linkToken;
  }

  public async getCollaborationState(canvasId: number): Promise<any> {
    const room = this.rooms.get(canvasId);
    const campaign = await storage.getCampaign(canvasId);
    
    return {
      presences: room ? Array.from(room.presences.values()) : [],
      currentUserCount: room ? room.presences.size : 0,
      maxCollaborators: campaign?.shareSettings?.maxCollaborators || 10,
      shareSettings: campaign?.shareSettings || null
    };
  }
}