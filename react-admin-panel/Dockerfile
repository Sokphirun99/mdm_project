# React Admin Panel Dockerfile: build with Node.js, serve with Nginx

# 1) Build stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the React app
ARG API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${API_BASE_URL}
RUN npm run build

# 2) Runtime stage
FROM nginx:alpine as runtime

# Copy built React app to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
