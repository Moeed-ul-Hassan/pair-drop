import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Sessions for pairing devices
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // The 4-6 digit code for pairing
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Messages/Content shared within a session
export const sharedItems = pgTable("shared_items", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(), // Foreign key to sessions
  type: text("type").notNull(), // 'text' or 'file'
  content: text("content"), // The text content or file description
  fileUrl: text("file_url"), // URL if it's a file
  fileName: text("file_name"), // Original filename
  fileSize: integer("file_size"), // Size in bytes
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, createdAt: true });
export const insertSharedItemSchema = createInsertSchema(sharedItems).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Session = typeof sessions.$inferSelect;
export type SharedItem = typeof sharedItems.$inferSelect;

// Request types
export type CreateSessionRequest = {
  // potentially empty if code is auto-generated
};

export type JoinSessionRequest = {
  code: string;
};

export type CreateSharedItemRequest = {
  sessionId: number;
  type: 'text' | 'file';
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
};

// Response types
export type SessionResponse = Session;
export type SharedItemResponse = SharedItem;

// WebSocket message types for signaling
export const WS_EVENTS = {
  JOIN: 'join',
  LEAVE: 'leave',
  NEW_ITEM: 'new_item',
  ERROR: 'error',
} as const;

export interface WsMessage<T = unknown> {
  type: keyof typeof WS_EVENTS;
  payload: T;
}
