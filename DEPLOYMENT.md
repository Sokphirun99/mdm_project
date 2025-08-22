# MDM Project Deployment Guide

This guide explains how to deploy the MDM (Mobile Device Management) project to a production environment.

## Components

- **Backend Server**: Node.js Express API with PostgreSQL database
- **Admin Panel**: React.js web interface for managing devices
- **Android Agent**: Kotlin-based device client (deployed separately)

## Prerequisites

- Docker and Docker Compose installed on the server
- Domain name(s) configured with DNS records
- SSL certificates for HTTPS
- Optionally: Nginx/Apache for reverse proxy

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Sokphirun99/mdm_project.git
cd mdm_project
```

### 2. Configure Environment

Run the deployment script to create an initial environment file:

```bash
./deploy.sh
```

Edit the generated `.env` file with your production settings:

```
# Database settings
DB_NAME=mdm_database
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server settings
SERVER_URL=https://mdm.yourdomain.com
API_BASE_URL=https://mdm.yourdomain.com/api

# Security
JWT_SECRET=your_random_secret_key

# Admin credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure_admin_password
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User

# Allow frontend domains
ALLOWED_ORIGINS=https://admin.yourdomain.com,https://mdm.yourdomain.com

# Set to true to enable SSL for DB
DB_SSL=true
```

### 3. Deploy the Stack

Run the deployment script again to build and start the containers:

```bash
./deploy.sh
```

This will:
- Build all required Docker images
- Start the containers in detached mode
- Verify that services are running correctly

### 4. Configure Reverse Proxy (Optional but Recommended)

For production environments, you should use a reverse proxy like Nginx to:
- Manage SSL certificates
- Handle HTTPS traffic
- Route requests to appropriate services

Sample Nginx configurations are provided at the end of the deployment script.

### 5. Android Agent Distribution

The Android MDM Agent app should be:
1. Built with your production API endpoint (`SERVER_URL`)
2. Signed with your production keystore
3. Distributed to devices through Google Play Store or other means

## Monitoring and Maintenance

- **Database Backups**: Set up regular backups of the PostgreSQL database
- **Log Management**: Use `docker-compose -f docker-compose.prod.yml logs` to view service logs
- **Updates**: Pull latest changes and redeploy using the deployment script

## Security Considerations

- Always use HTTPS in production
- Change default admin passwords
- Use strong, randomly generated JWT secrets
- Consider enabling database encryption
- Review and restrict network access to services

## Troubleshooting

If services are not running correctly:

1. Check container logs:
   ```
   docker-compose -f docker-compose.prod.yml logs backend
   ```

2. Verify database connectivity:
   ```
   docker-compose -f docker-compose.prod.yml exec backend npm run db:test
   ```

3. Check network configurations:
   ```
   docker-compose -f docker-compose.prod.yml exec backend curl -v http://db:5432
   ```
