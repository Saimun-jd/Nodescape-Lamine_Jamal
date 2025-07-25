# GraphVerse - Interactive Graph Visualization Tool

An interactive web application for creating, visualizing, and analyzing graphs using BFS and DFS algorithms. Built for the Hackathon Phase 1 & 2 requirements with full Docker containerization and CI/CD pipeline.

![GraphVerse Screenshot](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=GraphVerse+Graph+Visualization)

## 🚀 Features

- **Interactive Graph Creation**: Click to create nodes and edges dynamically
- **Algorithm Visualization**: Step-by-step BFS and DFS traversal with real-time highlighting
- **Traversal Order Display**: Visual arrows showing the complete algorithm path after completion
- **Persistent Storage**: PostgreSQL database with graph session management
- **Responsive Design**: Modern UI with dark/light theme support
- **Docker Ready**: Full containerization with multi-stage builds
- **CI/CD Pipeline**: Automated testing, building, and deployment via GitHub Actions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **DevOps**: Docker + GitHub Actions + Docker Hub

## 🎯 Hackathon Phase Completion

### ✅ Phase 1: Graph Traversal Visualization
- Interactive UI for user-defined graphs
- BFS and DFS algorithm implementations
- Clear visualization of node visit order
- Real-time algorithm state tracking

### ✅ Phase 2: Docker & CI/CD
- Complete application containerization
- Multi-stage Docker builds for optimization
- GitHub Actions CI/CD pipeline
- Automated Docker Hub image publishing
- Health checks and monitoring

### 🔄 Phase 3: ML Graph Classifier (Coming Next)
- Graph type classification (Tree, Cyclic, DAG)
- Machine learning model integration
- Prediction API endpoints

## 🏃‍♂️ Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd graphverse

# Run with Docker Compose
docker-compose up --build

# Access the application
open http://localhost:5000
```

### Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Push database schema
npm run db:push

# Start development server
npm run dev
```

## 🐳 Docker Hub

The application is automatically built and published to Docker Hub via GitHub Actions:

```bash
# Pull the latest image
docker pull yourusername/graphverse:latest

# Run the container
docker run -p 5000:5000 -e DATABASE_URL=your_db_url yourusername/graphverse:latest
```

## 📚 API Documentation

### Graph Sessions

```http
GET    /api/graph-sessions     # List all graph sessions
GET    /api/graph-sessions/:id # Get specific session
POST   /api/graph-sessions     # Create new session
PUT    /api/graph-sessions/:id # Update session
DELETE /api/graph-sessions/:id # Delete session
```

### Health Check

```http
GET /health # Application health status
```

Example Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-25T16:00:00.000Z",
  "version": "1.0.0"
}
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server  │    │   PostgreSQL    │
│                 │    │                  │    │                 │
│ - Graph Canvas  │◄──►│ - REST API       │◄──►│ - Graph Sessions│
│ - Algorithm UI  │    │ - Static Serving │    │ - User Data     │
│ - State Hooks   │    │ - Health Checks  │    │ - Relations     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Environment Variables

```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
```

## 🧪 Testing

```bash
# Run type checking
npm run build

# Test with Docker
docker build -t graphverse-test .
docker run --rm graphverse-test npm test
```

## 📊 CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **Test**: Runs type checking and builds
2. **Build**: Creates optimized Docker images  
3. **Push**: Publishes to Docker Hub
4. **Deploy**: Ready for production deployment

Pipeline triggers on:
- Push to `main` branch
- Pull requests

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:

- AWS ECS/Fargate
- Google Cloud Run
- Digital Ocean Apps
- Railway/Render
- Self-hosted options

## 🏆 Hackathon Requirements Compliance

### Phase 1 Requirements ✅
- [x] Frontend technology (React)
- [x] Dynamic graph input (user-provided)
- [x] Clear visualization of visited nodes order
- [x] BFS and DFS algorithm implementations

### Phase 2 Requirements ✅
- [x] Docker containerization of complete application
- [x] CI/CD pipeline using GitHub Actions
- [x] Build, test, and push to Docker Hub
- [x] Automated deployment pipeline
- [x] Multi-retry build handling
- [x] Documentation and deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

The CI/CD pipeline will automatically test your changes.

## 📝 License

This project is created for the hackathon. See individual component licenses for details.

## 🔗 Links

- **Live Demo**: [Your deployed URL]
- **Docker Hub**: https://hub.docker.com/r/yourusername/graphverse
- **GitHub Actions**: [Your repo]/actions
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Built with ❤️ for the Graph Visualization Hackathon**