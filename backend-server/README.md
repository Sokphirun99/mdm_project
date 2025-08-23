# MDM Backend Server

Modern TypeScript backend for Mobile Device Management (MDM) system built with:

- **TypeScript** for type safety
- **Prisma** for database ORM and migrations
- **Express.js** for REST API
- **PostgreSQL** for data storage
- **JWT** for authentication
- **Swagger/OpenAPI** for API documentation

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker (optional)

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other config
   ```

3. **Set up database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed initial data (admin user)
   npm run prisma:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:3000

### API Documentation

- **Swagger UI:** http://localhost:3000/api-docs
- **OpenAPI Spec:** http://localhost:3000/api-docs.json

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:deploy    # Deploy migrations (production)
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database with initial data
npm run lint         # Run ESLint
npm run test         # Run tests
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile

### Devices
- `GET /api/devices` - List devices
- `POST /api/devices` - Enroll new device
- `GET /api/devices/:id` - Get device details
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `POST /api/devices/:id/wipe` - Send wipe command
- `POST /api/devices/:id/lock` - Send lock command
- `POST /api/devices/:id/unlock` - Send unlock command
- `GET /api/devices/:id/commands` - Get device commands

### System
- `GET /api/health` - Health check

## Database

The system uses PostgreSQL with Prisma ORM. The schema includes:

- **Users** - Admin users with role-based access
- **Organizations** - Multi-tenant support
- **Devices** - Mobile devices under management
- **Policies** - Security and configuration policies
- **Commands** - Remote commands sent to devices
- **Events** - Audit log and monitoring events

## Environment Variables

```bash
# Application
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5435/mdm_database?schema=public"

# Security
JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173

# Admin User (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin1234
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User

# Firebase (optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100        # Max requests per window
```

## Docker

### Development
```bash
# Using the main docker-compose.dev.yml
docker compose -f ../docker-compose.dev.yml up -d
```

### Production Build
```bash
# Build the image
docker build -t mdm-backend .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  mdm-backend
```

## Security Features

- JWT-based authentication
- Role-based access control (ADMIN, MANAGER, VIEWER)
- Rate limiting on API endpoints
- Input validation with Zod
- CORS protection
- Helmet security headers
- Password hashing with bcrypt

## Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_new_feature

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## License

MIT
