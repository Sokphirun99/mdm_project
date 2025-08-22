# Android MDM (Mobile Device Management) System

## Docker deployment

This repo includes a docker-compose setup to run the stack locally:

- PostgreSQL 15 (port 5435 on host)
- Backend API (Node/Express) on port 3000
- React Admin Web Panel served via nginx on port 8080

### Prereqs
- Docker and Docker Compose installed

### Start
1. Copy `backend-server/.env.example` to `backend-server/.env` and adjust if needed (optional; defaults are provided via compose).
2. From the repo root, run:
   - `docker compose up --build`

After a few moments:
- API: http://localhost:3000
- Admin UI: http://localhost:8080

The backend runs DB migrations automatically on start.

### Default Admin Credentials
- Email: admin@example.com
- Password: admin1234

### Environment notes
- The admin container is built with `API_BASE_URL=http://localhost:3000/api` so your browser calls the host API directly.
- CORS is allowed for `http://localhost:8080` by default via `ALLOWED_ORIGINS`.
- Database credentials are development defaults. Change them for production.

A comprehensive Mobile Device Management solution built with React.js, Node.js, and PostgreSQL.

## Architecture Overview

```
Android Device App (Kotlin)
          │
          ▼
     REST API / FCM
          │
          ▼
   Backend Server (Node.js)
          │
          ▼
   Database (PostgreSQL)
```

## Components

### 1. Android MDM Agent (`android-mdm-agent/`)
- **Language**: Kotlin
- **Features**: Device enrollment, app management, security policies, monitoring
- **Communication**: REST API + FCM for real-time commands

### 2. React Admin Panel (`react-admin-panel/`)
- **Framework**: React.js + TypeScript
- **UI**: TailwindCSS + Lucide React Icons
- **Purpose**: Modern web admin interface for managing devices
- **Features**: Device dashboard, policy management, monitoring, responsive design

### 3. Backend Server (`backend-server/`)
- **Language**: Node.js with Express
- **Database**: PostgreSQL
- **Features**: REST API, FCM integration, device management

## Key Features

### Device Management
- ✅ Device enrollment via QR code (Implemented)
- ⚠️ Device profile registration (Basic registration only)
- ❌ Remote device identification (Not implemented)

### App Management
- ✅ Silent app installation/uninstallation (Backend implemented)
- ⚠️ Permission management (Partial - app permissions only)
- ✅ App whitelist/blacklist (Install type controls)

### Security Policies
- ✅ Remote device lock (Command implemented)
- ✅ Remote wipe (Command implemented with confirmation)
- ✅ Password policy enforcement (Policy system implemented)
- ❌ Hardware restrictions (camera, USB, Play Store) (Not implemented)

### Monitoring & Compliance
- ❌ Real-time location tracking (Not implemented)
- ⚠️ Device health monitoring (Basic device status only)
- ❌ Battery status reporting (Not implemented)
- ❌ Compliance reports (Not implemented)

### Communication
- ✅ Firebase Cloud Messaging (FCM) (Backend setup complete)
- ✅ Real-time command execution (Command system implemented)
- ✅ Status reporting

## Quick Start

### Prerequisites
- Android Studio (for Android agent)
- Flutter SDK (for admin panel)
- Node.js 18+ (for backend)
- PostgreSQL database

### Setup Instructions

1. **Backend Server**
   ```bash
   cd backend-server
   npm install
   npm run dev
   ```

2. **Android Agent**
   - Open `android-mdm-agent` in Android Studio
   - Build and install on target devices

3. **React Admin Panel**
   ```bash
   cd react-admin-panel
   npm install
   npm run dev    # Development server
   npm run build  # Production build
   ```

## Development

Each component has its own README with detailed setup instructions:
- [Android Agent README](./android-mdm-agent/README.md)
- [React Admin Panel](./react-admin-panel/) - Modern TypeScript + TailwindCSS interface
- [Backend Server README](./backend-server/README.md)

## Security Considerations

- Device Owner privileges required for silent app management
- Android Enterprise enrollment recommended
- End-to-end encryption for sensitive commands
- Proper authentication and authorization

## License

MIT License - see LICENSE file for details

## Quick Start Commands

```bash
# Start all services with Docker
docker-compose up -d

# Or run individually:

# Backend Server
npm run dev --prefix /Users/phirun/Projects/mdm_project/backend-server

# React Admin Panel (Development)
cd /Users/phirun/Projects/mdm_project/react-admin-panel && npm run dev

# Access Points:
# - Admin Panel: http://localhost:8080 (Docker) or http://localhost:5173 (Dev)
# - Backend API: http://localhost:3000
# - Database: localhost:5435
```

# Backend
cd /Users/phirun/Projects/mdm_project/backend-server
node src/index.js &

# Flutter Web
cd /Users/phirun/Projects/mdm_project/flutter-admin-panel  
flutter run -d web-server --web-port 8080

# Database
docker start mdm-postgres