import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGraphSessionSchema } from "@shared/schema";
import { GraphClassifier } from "./ml/graph-classifier";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize ML classifier
  const graphClassifier = new GraphClassifier();
  
  // Health check endpoint for Docker
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0"
    });
  });

  // ML Graph Classification API
  app.post("/api/classify-graph", async (req, res) => {
    try {
      const { graphData } = req.body;
      
      if (!graphData || !graphData.nodes || !graphData.edges) {
        return res.status(400).json({ 
          message: "Invalid graph data. Must include nodes and edges arrays." 
        });
      }

      const result = graphClassifier.classify(graphData);
      res.json(result);
    } catch (error) {
      console.error("Graph classification error:", error);
      res.status(500).json({ 
        message: "Failed to classify graph",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get ML model information
  app.get("/api/ml-model-info", (req, res) => {
    try {
      const modelInfo = graphClassifier.getModelInfo();
      res.json(modelInfo);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get model information",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Train ML model endpoint (for manual retraining)
  app.post("/api/train-model", (req, res) => {
    try {
      graphClassifier.trainModel();
      res.json({ 
        message: "Model trained successfully",
        modelInfo: graphClassifier.getModelInfo()
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to train model",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Graph sessions API routes
  app.get("/api/graph-sessions", async (req, res) => {
    try {
      const sessions = await storage.listGraphSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch graph sessions" });
    }
  });

  app.get("/api/graph-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getGraphSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Graph session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch graph session" });
    }
  });

  app.post("/api/graph-sessions", async (req, res) => {
    try {
      const validatedData = insertGraphSessionSchema.parse(req.body);
      const session = await storage.createGraphSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid graph session data" });
    }
  });

  app.put("/api/graph-sessions/:id", async (req, res) => {
    try {
      const validatedData = insertGraphSessionSchema.partial().parse(req.body);
      const session = await storage.updateGraphSession(req.params.id, validatedData);
      if (!session) {
        return res.status(404).json({ message: "Graph session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid graph session data" });
    }
  });

  app.delete("/api/graph-sessions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGraphSession(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Graph session not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete graph session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
