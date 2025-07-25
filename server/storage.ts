import { type GraphSession, type InsertGraphSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Graph session methods (for future persistence)
  getGraphSession(id: string): Promise<GraphSession | undefined>;
  createGraphSession(session: InsertGraphSession): Promise<GraphSession>;
  updateGraphSession(id: string, session: Partial<InsertGraphSession>): Promise<GraphSession | undefined>;
  deleteGraphSession(id: string): Promise<boolean>;
  listGraphSessions(): Promise<GraphSession[]>;
}

export class MemStorage implements IStorage {
  private graphSessions: Map<string, GraphSession>;

  constructor() {
    this.graphSessions = new Map();
  }

  async getGraphSession(id: string): Promise<GraphSession | undefined> {
    return this.graphSessions.get(id);
  }

  async createGraphSession(insertSession: InsertGraphSession): Promise<GraphSession> {
    const id = randomUUID();
    const session: GraphSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.graphSessions.set(id, session);
    return session;
  }

  async updateGraphSession(id: string, updates: Partial<InsertGraphSession>): Promise<GraphSession | undefined> {
    const existing = this.graphSessions.get(id);
    if (!existing) return undefined;

    const updated: GraphSession = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.graphSessions.set(id, updated);
    return updated;
  }

  async deleteGraphSession(id: string): Promise<boolean> {
    return this.graphSessions.delete(id);
  }

  async listGraphSessions(): Promise<GraphSession[]> {
    return Array.from(this.graphSessions.values());
  }
}

export const storage = new MemStorage();
