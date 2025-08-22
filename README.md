# Android MDM (Mobile Device Management) System

## Docker deployment

This repo includes a docker-compose setup to run the stack locally:

- PostgreSQL 15 (port 5434 on host)
- Backend API (Node/Express) on port 3000
- Flutter Admin Web served via nginx on port 8080

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

### Environment notes
- The admin container is built with `API_BASE_URL=http://localhost:3000` so your browser calls the host API directly.
- CORS is allowed for `http://localhost:8080` by default via `ALLOWED_ORIGINS`.
- Database credentials are development defaults. Change them for production.

A comprehensive Mobile Device Management solution built with Kotlin, Flutter, and Node.js.

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

### 2. Flutter Admin Panel (`flutter-admin-panel/`)
- **Framework**: Flutter
- **Purpose**: Cross-platform admin interface for managing devices
- **Features**: Device dashboard, policy management, monitoring

### 3. Backend Server (`backend-server/`)
- **Language**: Node.js with Express
- **Database**: PostgreSQL
- **Features**: REST API, FCM integration, device management

## Key Features

### Device Management
- ✅ Device enrollment via QR code
- ✅ Device profile registration
- ✅ Remote device identification

### App Management
- ✅ Silent app installation/uninstallation
- ✅ Permission management
- ✅ App whitelist/blacklist

### Security Policies
- ✅ Remote device lock
- ✅ Remote wipe
- ✅ Password policy enforcement
- ✅ Hardware restrictions (camera, USB, Play Store)

### Monitoring & Compliance
- ✅ Real-time location tracking
- ✅ Device health monitoring
- ✅ Battery status reporting
- ✅ Compliance reports

### Communication
- ✅ Firebase Cloud Messaging (FCM)
- ✅ Real-time command execution
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

3. **Flutter Admin Panel**
   ```bash
   cd flutter-admin-panel
   flutter pub get
   flutter run
   ```

## Development

Each component has its own README with detailed setup instructions:
- [Android Agent README](./android-mdm-agent/README.md)
- [Flutter Admin Panel README](./flutter-admin-panel/README.md)
- [Backend Server README](./backend-server/README.md)

## Security Considerations

- Device Owner privileges required for silent app management
- Android Enterprise enrollment recommended
- End-to-end encryption for sensitive commands
- Proper authentication and authorization

## License

MIT License - see LICENSE file for details


run admin => cd /Users/phirun/Projects/mdm_project/flutter-admin-panel && flutter run -d chrome --dart-define=API_BASE_URL=ht
tp://localhost:3000

run server => npm run dev --prefix /Users/phirun/Projects/mdm_project/backend-server

# Backend
cd /Users/phirun/Projects/mdm_project/backend-server
node src/index.js &

# Flutter Web
cd /Users/phirun/Projects/mdm_project/flutter-admin-panel  
flutter run -d web-server --web-port 8080

# Database
docker start mdm-postgres