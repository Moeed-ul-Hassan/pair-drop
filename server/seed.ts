import { storage } from "./storage";
import { sessions } from "@shared/schema";
import { db } from "./db";

export async function seedDatabase() {
  const code = "123456";
  const existing = await storage.getSessionByCode(code);
  
  if (!existing) {
    // Manually create a session with a fixed code for testing
    // Expiry in 24h
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.insert(sessions).values({ code, expiresAt });
    console.log("Seeded session with code:", code);
  }
}

// Execute seed function
seedDatabase().catch(console.error);
