#!/bin/bash
# MDM Project Deployment Script

set -e

echo "=== MDM Project Deployment ==="
echo "This script will deploy the MDM project to production."

# Check if .env file exists, if not, create it
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOF
# Database settings
DB_NAME=mdm_database
DB_USER=postgres
DB_PASSWORD=mdm_secure_password

# Server settings
SERVER_URL=https://mdm.yourdomain.com
API_BASE_URL=https://mdm.yourdomain.com/api

# Security
JWT_SECRET=$(openssl rand -hex 32)

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin1234
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User

# Allow frontend domains
ALLOWED_ORIGINS=https://admin.yourdomain.com,https://mdm.yourdomain.com

# Set to true to enable SSL for DB
DB_SSL=true
EOF
  echo "Please edit the .env file to set your production credentials and domain."
  echo "Then run this script again."
  exit 0
fi

# Build the images
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

# Stop any running containers
echo "Stopping any running containers..."
docker-compose -f docker-compose.prod.yml down

# Start the containers
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Show container status
echo "Container status:"
docker-compose -f docker-compose.prod.yml ps

# Check if services are up
echo "Checking service health..."
sleep 5

# Check database
if docker-compose -f docker-compose.prod.yml exec db pg_isready -U postgres > /dev/null 2>&1; then
  echo "✅ Database is running"
else
  echo "❌ Database is not responding"
fi

# Check backend
if curl -s http://localhost:3000/health | grep -q "OK"; then
  echo "✅ Backend API is running"
else
  echo "❌ Backend API is not responding"
fi

# Check admin panel
if curl -s -I http://localhost:8080 | grep -q "200 OK"; then
  echo "✅ Admin panel is running"
else
  echo "❌ Admin panel is not responding"
fi

echo ""
echo "=== Deployment Complete ==="
echo "You may need to configure a reverse proxy (Nginx/Apache) to expose"
echo "your services securely with HTTPS."
echo ""
echo "Example Nginx configuration for reverse proxy:"
cat << EOF
server {
    listen 80;
    server_name mdm.yourdomain.com;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name mdm.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/certificate.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name admin.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/certificate.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
