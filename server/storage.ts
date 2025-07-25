import { users, graphSessions, type User, type InsertUser, type GraphSession, type InsertGraphSession } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Graph session methods
  getGraphSession(id: string): Promise<GraphSession | undefined>;
  createGraphSession(session: InsertGraphSession): Promise<GraphSession>;
  updateGraphSession(id: string, session: Partial<InsertGraphSession>): Promise<GraphSession | undefined>;
  deleteGraphSession(id: string): Promise<boolean>;
  listGraphSessions(): Promise<GraphSession[]>;
  listGraphSessionsByUser(userId: number): Promise<GraphSession[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getGraphSession(id: string): Promise<GraphSession | undefined> {
    const [session] = await db.select().from(graphSessions).where(eq(graphSessions.id, id));
    return session || undefined;
  }

  async createGraphSession(insertSession: InsertGraphSession): Promise<GraphSession> {
    const [session] = await db
      .insert(graphSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateGraphSession(id: string, updates: Partial<InsertGraphSession>): Promise<GraphSession | undefined> {
    const [session] = await db
      .update(graphSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(graphSessions.id, id))
      .returning();
    return session || undefined;
  }

  async deleteGraphSession(id: string): Promise<boolean> {
    const result = await db.delete(graphSessions).where(eq(graphSessions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async listGraphSessions(): Promise<GraphSession[]> {
    return await db.select().from(graphSessions);
  }

  async listGraphSessionsByUser(userId: number): Promise<GraphSession[]> {
    return await db.select().from(graphSessions).where(eq(graphSessions.userId, userId));
  }
}

export const storage = new DatabaseStorage();
