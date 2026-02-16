import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { WS_EVENTS, type WsMessage } from "@shared/schema";

// Helper to generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Registers all REST and WebSocket routes for the application.
 * @param httpServer The underlying Node.js HTTP server (needed for WS)
 * @param app The Express application instance
 */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- REST API ---

  // Create a session
  app.post(api.sessions.create.path, async (req, res) => {
    try {
      // Generate a unique 6-digit numeric code for the session.
      // This serves as the pairing key between devices.
      let code = generateCode();
      let existing = await storage.getSessionByCode(code);
      while (existing) {
        code = generateCode();
        existing = await storage.getSessionByCode(code);
      }

      const session = await storage.createSession(code);
      res.status(201).json(session);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Get session by code
  app.get(api.sessions.getByCode.path, async (req, res) => {
    const code = req.params.code;
    const session = await storage.getSessionByCode(code);
    if (!session) {
      return res.status(404).json({ message: "Session not found or expired" });
    }
    res.json(session);
  });

  // Get items for a session
  app.get(api.sessions.getItems.path, async (req, res) => {
    const code = req.params.code;
    const session = await storage.getSessionByCode(code);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const items = await storage.getSharedItems(session.id);
    res.json(items);
  });

  // Add item to session
  app.post(api.sessions.addItem.path, async (req, res) => {
    try {
      const code = req.params.code;
      const session = await storage.getSessionByCode(code);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Validate input
      const input = api.sessions.addItem.input.parse(req.body);
      
      const item = await storage.createSharedItem({
        ...input,
        sessionId: session.id
      });

      // Broadcast to all connected WebSocket clients in this specific session.
      // This triggers a real-time update on all paired devices.
      broadcastToSession(code, {
        type: WS_EVENTS.NEW_ITEM,
        payload: item
      });

      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- WebSocket Server ---
  
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<WebSocket, string>(); // ws -> sessionCode

  wss.on('connection', (ws, req) => {
    // Extract the session code from the query parameter (e.g., /ws?code=123456)
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const code = url.searchParams.get('code');

    if (!code) {
      ws.close(1008, 'Code required');
      return;
    }

    // Verify session exists
    storage.getSessionByCode(code).then(session => {
      if (!session) {
        ws.close(1008, 'Session not found');
        return;
      }

      clients.set(ws, code);
      
      // Notify others in session? (Optional)
      // broadcastToSession(code, { type: WS_EVENTS.JOIN, payload: { count: ... } });

      ws.on('close', () => {
        clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('WebSocket error:', err);
      });
    });
  });

  /**
   * Sends a message to all active WebSocket clients belonging to a specific session.
   * This is the core signaling mechanism for real-time synchronization.
   */
  function broadcastToSession(code: string, message: WsMessage) {
    const payload = JSON.stringify(message);
    for (const [client, clientCode] of clients.entries()) {
      if (clientCode === code && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  return httpServer;
}
