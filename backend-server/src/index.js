const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const policyRoutes = require('./routes/policies');
const appRoutes = require('./routes/apps');
const commandRoutes = require('./routes/commands');
const monitoringRoutes = require('./routes/monitoring');
const dashboardRoutes = require('./routes/dashboard');

const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS
// Allow configured origins, and by default allow localhost/127.0.0.1 on any port in development
const explicitAllowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin without an Origin header
    if (!origin) return callback(null, true);

    // Explicit allow list from env
    if (explicitAllowed.includes(origin)) return callback(null, true);

    // Dev-friendly default: allow any localhost port
    if (localhostRegex.test(origin)) return callback(null, true);

    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
// Explicitly handle preflight
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Aggressive rate limiting for polling requests
const pollingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per 5 minutes for polling
  message: 'Polling requests are rate limited. Please reduce request frequency.',
  keyGenerator: (req) => `${req.ip}-${req.get('User-Agent') || 'unknown'}`
});

app.use('/api/', limiter);
app.use('/rest/notification/polling/*', pollingLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'MDM Backend Server'
  });
});

// Friendly root endpoint for convenience
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'MDM Backend Server',
    message: 'API is running',
    health: '/health',
    docs: 'Use /api/* endpoints (e.g., /api/auth/login, /api/devices/enroll)'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/devices', authenticateToken, deviceRoutes);
app.use('/api/policies', authenticateToken, policyRoutes);
app.use('/api/apps', authenticateToken, appRoutes);
app.use('/api/commands', authenticateToken, commandRoutes);
app.use('/api/monitoring', authenticateToken, monitoringRoutes);

// Block unwanted polling requests (likely from misconfigured external systems)
app.all('/rest/notification/polling/*', (req, res) => {
  console.log(`⚠️  Blocking polling request: ${req.method} ${req.originalUrl} from ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
  res.status(410).json({
    error: 'Polling endpoint discontinued',
    message: 'This endpoint is no longer available. Please update your configuration to use /api/* endpoints.',
    documentation: '/api/docs'
  });
});

// Block any other /rest/* requests
app.all('/rest/*', (req, res) => {
  console.log(`⚠️  Blocking REST request: ${req.method} ${req.originalUrl} from ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
  res.status(410).json({
    error: 'REST endpoint discontinued',
    message: 'REST endpoints are no longer available. Please use /api/* endpoints instead.',
    migration: {
      old: '/rest/*',
      new: '/api/*'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MDM Backend Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
