# Flutter Web Dockerfile: build with Flutter, serve with Nginx

# 1) Build stage
FROM ghcr.io/cirruslabs/flutter:stable as build
WORKDIR /app

# Enable faster pub get by caching deps
COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get

# Copy rest of the project
COPY . .

# Build web with API base URL injected
ARG API_BASE_URL=http://localhost:3000
RUN flutter build web \
    --release \
    --dart-define=API_BASE_URL=${API_BASE_URL}

# 2) Runtime stage
FROM nginx:alpine as runtime
COPY --from=build /app/build/web /usr/share/nginx/html

# Replace default nginx config with a simple SPA-friendly one
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
