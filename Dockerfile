# Multi-stage build for GraphVerse
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and config
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./
COPY drizzle.config.ts ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY client/ ./client/
COPY server/ ./server/  
COPY shared/ ./shared/

# Build the application
RUN npm run build

# -----------------------------
# Production Stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built app from builder
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./

# Copy any other runtime files that might be needed
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Use non-root user
USER nextjs

# Expose app port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
              const options = { host: 'localhost', port: 5000, path: '/health', timeout: 2000 }; \
              const req = http.request(options, (res) => { \
                if (res.statusCode === 200) process.exit(0); \
                else process.exit(1); \
              }); \
              req.on('error', () => process.exit(1)); \
              req.end();"

# Start app with proper init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]