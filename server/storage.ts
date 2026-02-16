import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  sessions, sharedItems, 
  type Session, type SharedItem, 
  type CreateSessionRequest, type CreateSharedItemRequest 
} from "@shared/schema";

export interface IStorage {
  // Session operations
  createSession(code: string): Promise<Session>;
  getSessionByCode(code: string): Promise<Session | undefined>;
  
  // Item operations
  createSharedItem(item: CreateSharedItemRequest): Promise<SharedItem>;
  getSharedItems(sessionId: number): Promise<SharedItem[]>;
}

export class DatabaseStorage implements IStorage {
  async createSession(code: string): Promise<Session> {
    // 24 hour expiry for sessions
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const [session] = await db.insert(sessions)
      .values({ code, expiresAt })
      .returning();
    return session;
  }

  async getSessionByCode(code: string): Promise<Session | undefined> {
    const [session] = await db.select()
      .from(sessions)
      .where(eq(sessions.code, code));
    
    // Check if expired
    if (session && session.expiresAt < new Date()) {
      return undefined;
    }
    
    return session;
  }

  async createSharedItem(item: CreateSharedItemRequest): Promise<SharedItem> {
    const [newItem] = await db.insert(sharedItems)
      .values(item)
      .returning();
    return newItem;
  }

  async getSharedItems(sessionId: number): Promise<SharedItem[]> {
    return await db.select()
      .from(sharedItems)
      .where(eq(sharedItems.sessionId, sessionId))
      .orderBy(desc(sharedItems.createdAt));
  }
}

export const storage = new DatabaseStorage();
