import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Graph node definition
export const GraphNode = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  label: z.string(),
});

// Graph edge definition
export const GraphEdge = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
});

// Graph state definition
export const GraphState = z.object({
  nodes: z.array(GraphNode),
  edges: z.array(GraphEdge),
  nextNodeId: z.number(),
});

// Graph sessions table for potential future persistence
export const graphSessions = pgTable("graph_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  graphData: jsonb("graph_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGraphSessionSchema = createInsertSchema(graphSessions).pick({
  name: true,
  graphData: true,
});

export type InsertGraphSession = z.infer<typeof insertGraphSessionSchema>;
export type GraphSession = typeof graphSessions.$inferSelect;
export type GraphNodeType = z.infer<typeof GraphNode>;
export type GraphEdgeType = z.infer<typeof GraphEdge>;
export type GraphStateType = z.infer<typeof GraphState>;
