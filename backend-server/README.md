# MDM Backend Server

Node.js backend server for the Android MDM (Mobile Device Management) system.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Device Management**: Enrollment, status tracking, remote commands
- **Policy Management**: Security policies, app policies, device restrictions
- **App Management**: Silent app installation/uninstallation, app whitelisting/blacklisting
- **Real-time Communication**: Firebase Cloud Messaging (FCM) for instant commands
- **Monitoring**: Location tracking, compliance reporting, device health
- **REST API**: Comprehensive RESTful API for all operations

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Authentication**: JWT with bcryptjs
- **Push Notifications**: Firebase Admin SDK
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, rate limiting

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Firebase project with FCM enabled

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/mdm_database
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   
   # Firebase (get from Firebase Console)
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb mdm_database
   
   # Run migrations
   npm run migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Documentation

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-uuid",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

#### POST /api/auth/register
Register a new user.

### Device Management

#### GET /api/devices
List all devices with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by device status
- `organizationId`: Filter by organization
- `search`: Search device names/models

#### POST /api/devices/enroll
Enroll a new device.

**Request:**
```json
{
  "deviceId": "android-device-id",
  "deviceName": "John's Phone",
  "model": "Pixel 7",
  "manufacturer": "Google",
  "androidVersion": "13",
  "fcmToken": "fcm-token-here"
}
```

#### GET /api/devices/:id
Get detailed device information including status, location, and recent commands.

### Command Management

#### POST /api/commands/send
Send commands to devices.

**Request:**
```json
{
  "deviceIds": ["device-uuid-1", "device-uuid-2"],
  "type": "lock_device",
  "parameters": {
    "message": "Device locked by administrator"
  },
  "priority": "high"
}
```

**Supported Commands:**
- `lock_device`: Lock the device screen
- `unlock_device`: Unlock the device
- `wipe_device`: Factory reset the device
- `reboot_device`: Reboot the device
- `install_app`: Install an application
- `uninstall_app`: Remove an application
- `get_location`: Request current location
- `disable_camera`: Disable camera access
- `set_password_policy`: Update password requirements

#### POST /api/commands/bulk/lock
Bulk lock multiple devices.

#### POST /api/commands/bulk/wipe
Bulk wipe multiple devices (requires confirmation).

### Policy Management

#### GET /api/policies
List all policies with filtering.

#### POST /api/policies
Create a new policy.

**Security Policy Example:**
```json
{
  "name": "Strong Password Policy",
  "description": "Enforce strong password requirements",
  "type": "security",
  "settings": {
    "minLength": 8,
    "requireUppercase": true,
    "requireNumbers": true,
    "maxFailedAttempts": 5
  }
}
```

#### POST /api/policies/:id/apply
Apply policy to devices.

### App Management

#### GET /api/apps
List all managed applications.

#### POST /api/apps
Add a new application to management.

#### POST /api/apps/:id/install
Install app on specified devices.

#### POST /api/apps/:id/uninstall
Uninstall app from specified devices.

### Monitoring

#### GET /api/monitoring/dashboard
Get dashboard overview data.

#### GET /api/monitoring/location/:deviceId
Get device location history.

#### GET /api/monitoring/compliance/:deviceId
Get device compliance reports.

#### GET /api/monitoring/alerts
Get monitoring alerts (offline devices, low battery, etc.).

## Database Schema

### Core Tables

- **users**: Admin users with role-based access
- **organizations**: Multi-tenant organization support
- **devices**: Enrolled device information
- **policies**: Security and management policies
- **apps**: Managed applications
- **commands**: Remote commands sent to devices

### Monitoring Tables

- **device_status**: Device health and system info
- **device_locations**: GPS location history
- **compliance_reports**: Policy compliance status
- **device_policies**: Policy assignments to devices
- **device_apps**: App installation status per device

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin, Manager, Viewer roles
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Joi schema validation for all inputs
- **SQL Injection Protection**: Parameterized queries with Knex.js
- **CORS Protection**: Configurable CORS policies

## Firebase Cloud Messaging

The server uses Firebase Cloud Messaging to send real-time commands to enrolled devices:

1. **Command Delivery**: Instant command delivery to devices
2. **Offline Support**: Commands queued for offline devices
3. **Delivery Confirmation**: Track command delivery status
4. **High Priority**: Critical commands sent with high priority

## Development

### Project Structure
```
src/
├── config/          # Database and app configuration
├── middleware/      # Authentication, error handling
├── routes/          # API route handlers
├── services/        # Business logic and external services
└── index.js         # Main application entry point

migrations/          # Database migrations
```

### Running Tests
```bash
npm test
```

### Database Operations
```bash
# Create new migration
npx knex migrate:make migration_name

# Run migrations
npm run migrate

# Rollback migration
npx knex migrate:rollback
```

## Deployment

### Environment Variables
Ensure these environment variables are set in production:

- `NODE_ENV=production`
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong secret for JWT signing
- Firebase configuration variables
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## API Rate Limits

- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: Additional rate limiting for security

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resources)
- `500`: Internal Server Error

## Support

For issues or questions about the backend server, please check:

1. Environment variable configuration
2. Database connection and migrations
3. Firebase service account setup
4. Network connectivity for FCM
