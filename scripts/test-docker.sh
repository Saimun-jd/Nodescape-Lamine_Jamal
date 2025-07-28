#!/bin/bash

# GraphVerse Docker Test Script
# This script helps test the Docker implementation locally

set -e  # Exit on any error

echo "🐳 GraphVerse Docker Test Script"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

echo "🏗️  Building Docker image..."
docker build -t graphverse .

echo "🧪 Testing Docker image..."
# Test that the image can start
docker run --rm -d --name graphverse-test -p 5001:5000 \
    -e DATABASE_URL="postgresql://test:test@localhost:5432/test" \
    graphverse

# Wait a moment for the container to start
sleep 5

# Test health endpoint
echo "🔍 Testing health endpoint..."
if curl -f http://localhost:5001/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi

# Stop test container
docker stop graphverse-test

echo "🚀 Testing with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Test the full application
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Docker Compose deployment successful"
    echo "🌐 Application is running at http://localhost:5000"
else
    echo "❌ Docker Compose deployment failed"
    docker-compose logs
fi

echo ""
echo "📋 Next Steps:"
echo "1. Visit http://localhost:5000 to test the application"
echo "2. Create some graph nodes and test BFS/DFS algorithms"
echo "3. Check that graph sessions are persisted in the database"
echo "4. Run 'docker-compose down' when finished testing"
echo ""
echo "🚀 For deployment, see DEPLOYMENT.md for detailed instructions"