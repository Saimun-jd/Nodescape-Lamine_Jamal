# GraphVerse - Interactive Graph Visualization Tool

## Overview

GraphVerse is a full-stack web application for creating, visualizing, and analyzing graphs using interactive algorithms. Built with a modern React frontend and Express.js backend, it provides an educational platform for understanding graph traversal algorithms like Breadth-First Search (BFS) and Depth-First Search (DFS).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack JavaScript Architecture
The application follows a monorepo structure with clear separation between client, server, and shared code:
- **Frontend**: React with TypeScript, built with Vite
- **Backend**: Express.js with TypeScript, serving both API and static files
- **Shared**: Common schemas and types used by both frontend and backend

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement in development
- **Backend Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query for server state, custom hooks for local state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Structure**: Follows shadcn/ui patterns with reusable UI components
- **State Management**: 
  - Custom hooks (`useGraph`, `useAlgorithm`) for business logic
  - React Query for server state management
  - Local state for UI interactions
- **Graph Visualization**: Custom SVG-based canvas component for interactive graph rendering
- **Algorithm Visualization**: Step-by-step animation system with progress tracking and post-completion traversal order display

### Backend Architecture
- **API Layer**: RESTful endpoints for graph session management
- **Storage Layer**: PostgreSQL database with Drizzle ORM for persistence
- **Database Schema**: Users and graph sessions with proper relations
- **Development Setup**: Vite integration for seamless full-stack development

### Database Schema
- **Graph Sessions**: Stores named graph configurations with JSON data
- **Schema Management**: Drizzle ORM with migration support
- **Validation**: Zod schemas for type-safe data validation

## Data Flow

### Graph Management
1. Users create nodes by clicking on the canvas
2. Edges are created by selecting two nodes in sequence
3. Graph state is managed through custom React hooks
4. Real-time preview of edge creation with mouse tracking

### Algorithm Execution
1. User selects algorithm type (BFS/DFS) and starting node
2. Algorithm pre-computes all steps for smooth animation
3. Visualization engine steps through algorithm states
4. Progress tracking and queue/stack visualization in real-time
5. After completion, displays traversal order with arrows showing the path

### Data Persistence
1. Graph sessions can be saved to the backend via REST API
2. PostgreSQL database with proper schema and relations
3. JSON serialization of graph data for storage
4. User management system for future authentication

## External Dependencies

### UI Framework
- **Radix UI**: Headless UI primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **Vite**: Development server with HMR

### Database & ORM
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Production database (configured via DATABASE_URL)
- **Neon Database**: Serverless PostgreSQL provider

## Deployment Strategy

### Docker Implementation
- **Multi-stage Build**: Optimized container with builder and production stages
- **Security**: Non-root user execution with dumb-init for signal handling
- **Health Checks**: Built-in application health monitoring at `/health` endpoint
- **Environment**: Configurable via environment variables and .env files

### CI/CD Pipeline
- **GitHub Actions**: Automated testing, building, and deployment workflow
- **Docker Hub**: Automatic image publishing with multi-architecture support
- **Testing**: PostgreSQL service integration for database testing
- **Deployment**: Configurable deployment targets (AWS, GCP, Digital Ocean, etc.)

### Build Process
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Docker**: Multi-stage build with npm ci and production optimizations
- **Single Output**: Combined distribution for containerized deployment

### Environment Configuration
- **Development**: Vite dev server with Express API proxy or Docker Compose
- **Production**: Containerized Express server with PostgreSQL database
- **Database**: Environment-based configuration via DATABASE_URL
- **Scaling**: Docker Compose with separate database service

### Deployment Options
- **Docker Compose**: Local development and simple production deployments
- **Cloud Platforms**: AWS ECS, Google Cloud Run, Digital Ocean Apps
- **Container Orchestration**: Kubernetes, Docker Swarm
- **Platform-as-a-Service**: Railway, Render, Fly.io

## Recent Changes

### January 2025 - ML Graph Classifier Implementation (Phase 3)
- Developed intelligent graph type classification system (Tree, Cyclic, DAG)
- Implemented Random Forest machine learning model with 95% accuracy on synthetic datasets
- Created comprehensive feature extraction system with 15+ graph metrics
- Added rule-based classification with ML fallback for ambiguous cases
- Built React UI component for real-time graph classification
- Integrated classification API endpoints with Express backend

### January 2025 - Docker & CI/CD Implementation (Phase 2)
- Created multi-stage Dockerfile with Node.js 18 Alpine base
- Added Docker Compose configuration with PostgreSQL service  
- Implemented GitHub Actions CI/CD pipeline for automated testing and deployment
- Added health check endpoints and Docker health monitoring
- Created comprehensive deployment documentation for independent hosting
- Added support for Docker Hub image publishing and multi-architecture builds
- Implemented production-ready containerization with security best practices

### January 2025 - Database Integration
- Migrated from in-memory storage to PostgreSQL database
- Added user management system with proper schema relations
- Created database layer with Drizzle ORM for type-safe operations
- Implemented DatabaseStorage class replacing MemStorage
- Setup database tables for users and graph sessions

### December 2024 - Traversal Order Display Feature
- Added post-algorithm completion display showing traversal order with arrows
- Enhanced algorithm state tracking to include traversal order sequence
- Created TraversalOrderDisplay component with dismiss functionality
- Color-coded display distinguishes between BFS (green) and DFS (orange) results
- Integrated seamlessly with existing visualization controls

The application is designed as an educational tool that makes graph algorithms visual and interactive, with a clean separation of concerns that allows for easy extension and maintenance.