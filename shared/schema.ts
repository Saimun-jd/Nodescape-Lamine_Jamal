import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Graph sessions table for persistence
export const graphSessions = pgTable("graph_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  graphData: jsonb("graph_data").notNull(),
  userId: integer("user_id").references(() => users.id).default(1), // Default to user 1 for now
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  graphSessions: many(graphSessions),
}));

export const graphSessionsRelations = relations(graphSessions, ({ one }) => ({
  user: one(users, {
    fields: [graphSessions.userId],
    references: [users.id],
  }),
}));

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGraphSessionSchema = createInsertSchema(graphSessions).pick({
  name: true,
  graphData: true,
}).extend({
  userId: z.number().optional().default(1), // Default to user 1 for now
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGraphSession = z.infer<typeof insertGraphSessionSchema>;
export type GraphSession = typeof graphSessions.$inferSelect;
export type GraphNodeType = z.infer<typeof GraphNode>;
export type GraphEdgeType = z.infer<typeof GraphEdge>;
export type GraphStateType = z.infer<typeof GraphState>;
