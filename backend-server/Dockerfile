# Backend Dockerfile
FROM node:20-alpine AS base

WORKDIR /app
ENV NODE_ENV=production

# Install dependencies first
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY src ./src
COPY knexfile.js ./
COPY migrations ./migrations
COPY seeds ./seeds

# Expose port
EXPOSE 3000

# Run migrations and seeds on container start then start server
COPY init.sh ./
RUN chmod +x init.sh
CMD ["./init.sh"]
