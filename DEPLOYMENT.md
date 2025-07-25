# GraphVerse Deployment Guide

This document provides comprehensive instructions for deploying GraphVerse independently without relying on Replit.

## 🐳 Docker & CI/CD Implementation

### Prerequisites
- Docker and Docker Compose installed
- GitHub account
- Docker Hub account
- Git repository

### 1. Local Development with Docker

```bash
# Clone the repository
git clone <your-repo-url>
cd graphverse

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials

# Build and run with Docker Compose
docker-compose up --build

# The application will be available at http://localhost:5000
```

### 2. GitHub Actions CI/CD Setup

#### Step 1: Configure Repository Secrets
In your GitHub repository, go to Settings → Secrets and variables → Actions, then add:

- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub access token (not password!)

#### Step 2: Create Docker Hub Access Token
1. Log in to Docker Hub
2. Go to Account Settings → Security → Access Tokens
3. Create a new token with Read/Write permissions
4. Use this token as `DOCKER_PASSWORD` secret

#### Step 3: Push to GitHub
The CI/CD pipeline will automatically:
- Run tests on every push/PR
- Build and push Docker images to Docker Hub on main branch
- Deploy the application (configure deployment target)

```bash
git add .
git commit -m "Add Docker and CI/CD pipeline"
git push origin main
```

## 🚀 Production Deployment Options

### Option 1: AWS ECS/Fargate

```bash
# Install AWS CLI and configure credentials
aws configure

# Create ECS cluster
aws ecs create-cluster --cluster-name graphverse-cluster

# Create task definition (create task-definition.json first)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service --cluster graphverse-cluster --service-name graphverse-service --task-definition graphverse --desired-count 1
```

### Option 2: Google Cloud Run

```bash
# Install gcloud CLI and authenticate
gcloud auth login

# Deploy to Cloud Run
gcloud run deploy graphverse \
  --image docker.io/yourusername/graphverse:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=your_database_url
```

### Option 3: Digital Ocean Apps

```yaml
# Create .do/app.yaml
name: graphverse
services:
- name: web
  source_dir: /
  github:
    repo: your-username/graphverse
    branch: main
  run_command: node dist/index.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 5000
  env:
  - key: DATABASE_URL
    value: ${DATABASE_URL}
databases:
- name: graphverse-db
  engine: PG
  version: "15"
```

### Option 4: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 5: Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `node dist/index.js`
5. Add environment variables

## 🔧 Environment Variables

### Required Variables
```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
```

### Database Setup
For production, use managed PostgreSQL services:
- **AWS RDS PostgreSQL**
- **Google Cloud SQL**
- **Digital Ocean Managed Databases**
- **Railway PostgreSQL**
- **Neon (Serverless PostgreSQL)**

## 📊 Monitoring & Health Checks

### Health Check Endpoint
The application includes a health check at `/health`:

```bash
curl http://your-domain.com/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-25T16:00:00.000Z",
  "version": "1.0.0"
}
```

### Docker Health Checks
The Dockerfile includes built-in health checks that monitor application status.

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database Security**: Use strong passwords and SSL connections
3. **Container Security**: Run as non-root user (already configured)
4. **Network Security**: Use HTTPS in production
5. **Access Control**: Implement authentication if needed

## 🏗️ Build Process

### Local Build
```bash
npm install
npm run build
```

### Docker Build
```bash
docker build -t graphverse .
docker run -p 5000:5000 -e DATABASE_URL=your_db_url graphverse
```

### Multi-architecture Build
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t yourusername/graphverse:latest --push .
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database URL format
   echo $DATABASE_URL
   # Test connection
   npm run db:push
   ```

2. **Docker Build Fails**
   ```bash
   # Check Dockerfile syntax
   docker build --no-cache .
   # Check .dockerignore
   ```

3. **CI/CD Pipeline Fails**
   - Verify GitHub secrets are set correctly
   - Check Docker Hub token permissions
   - Review GitHub Actions logs

### Logs and Debugging
```bash
# Docker logs
docker logs container_name

# Application logs in production
# Configure logging service (CloudWatch, DataDog, etc.)
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancers (AWS ALB, Google Cloud Load Balancer)
- Deploy multiple container instances
- Implement database connection pooling

### Vertical Scaling
- Increase container resources (CPU/Memory)
- Optimize database performance
- Use CDN for static assets

## 🔄 Updates and Maintenance

### Rolling Updates
```bash
# Update Docker image
docker pull yourusername/graphverse:latest
docker stop graphverse-container
docker run -d --name graphverse-container yourusername/graphverse:latest
```

### Database Migrations
```bash
# Apply schema changes
npm run db:push
```

This deployment guide ensures your GraphVerse application can be deployed independently on any cloud platform with Docker support, meeting the hackathon's Phase 2 requirements.