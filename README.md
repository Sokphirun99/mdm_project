# Android MDM (Mobile Device Management) System

Modern MDM stack with a React + Tailwind admin, Node/Express API, and PostgreSQL.

## Docker (recommended)

This repo includes a Docker Compose setup for local development:

- PostgreSQL 15 (host port 5435)
- Backend API (Node/Express) on http://localhost:3000
- React Admin Panel (served by Nginx) on http://localhost:8080

### Prerequisites
- Docker and Docker Compose plugin installed

### Start the stack
Option A — helper script

```bash
./dev.sh start
```

Option B — raw Docker Compose

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

After a few moments:
- API: http://localhost:3000
- Admin UI: http://localhost:8080

The backend automatically runs database migrations and seeds on start.

### Manage services

```bash
./dev.sh logs      # Tail combined logs
./dev.sh restart   # Restart all services
./dev.sh stop      # Stop and remove containers
```

### Default Admin Credentials
- Email: admin@example.com
- Password: admin1234

### Environment notes
- The admin image is built with `API_BASE_URL=http://localhost:3000/api`, so your browser calls the host API directly.
- CORS allows `http://localhost:8080` (and localhost dev ports) via `ALLOWED_ORIGINS`.
- Database persists in the `mdm_project_db_data_dev` Docker volume (host port `5435`).

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

### 1) Android MDM Agent (`android-mdm-agent/`)
- Language: Kotlin
- Features: Device enrollment, app management, security policies, monitoring
- Communication: REST API + FCM for real-time commands

### 2) React Admin Panel (`react-admin-panel/`)
- Framework: React + TypeScript, Vite
- UI: TailwindCSS v3 + Lucide icons
- Purpose: Modern admin interface for managing devices

### 3) Backend Server (`backend-server/`)
- Language: Node.js (Express)
- Database: PostgreSQL (Knex)
- Features: REST API, FCM integration, device/policy/app/command management

## Key Features

### Device Management
- ✅ Device enrollment via QR code (Implemented)
- ⚠️ Device profile registration (Basic registration only)
- ❌ Remote device identification (Not implemented)

### App Management
- ✅ Silent app install/uninstall (Backend implemented)
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

## Local development (without Docker)

Backend:
```bash
cd backend-server
npm install
npm run dev
```

React Admin Panel:
```bash
cd react-admin-panel
npm install
# point the UI to your API if needed
VITE_API_BASE_URL=http://localhost:3000/api npm run dev
```

Build the admin UI:
```bash
cd react-admin-panel
npm run build
```

## Migrations & data

- The backend runs `npm run migrate` and `npm run seed` automatically in Docker.
- Run manually if needed:
   ```bash
   docker exec mdm_backend_dev npm run migrate
   docker exec mdm_backend_dev npm run seed
   ```
- To reset the database (dangerous): stop services and remove the `mdm_project_db_data_dev` volume.

## Troubleshooting

- 500 on login or "relation \"users\" does not exist": migrations/seeds did not run.
   ```bash
   docker exec mdm_backend_dev npm run migrate
   docker exec mdm_backend_dev npm run seed
   ```
- Admin UI missing styles: ensure Tailwind v3 is used and rebuild the admin image.
   ```bash
   docker compose -f docker-compose.dev.yml build admin
   docker compose -f docker-compose.dev.yml up -d
   ```

## Development docs

Each component has its own README:
- [Android Agent README](./android-mdm-agent/README.md)
- [React Admin Panel](./react-admin-panel/)
- [Backend Server README](./backend-server/README.md)

## Security Considerations

- Device Owner privileges required for silent app management
- Android Enterprise enrollment recommended
- End-to-end encryption for sensitive commands
- Proper authentication and authorization

## License

MIT License — see LICENSE for details