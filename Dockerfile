# Backend Dockerfile
# 
# WHAT: Containerizes the Node.js backend
# WHY: Ensures consistent environment across dev/production
# 
# Build: docker build -t student-management-backend .
# Run: docker run -p 3000:3000 student-management-backend

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory for temporary files
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/auth/login', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the server
CMD ["node", "server.js"]
