import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './config/swagger';
import { env } from './config/env';
import router from './routes';
import { errorHandler, notFound } from './middlewares/error';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost in development
    if (env.nodeEnv === 'development' && origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return callback(null, true);
    }
    
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: env.rateLimitWindow,
  max: env.rateLimitMax,
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: Math.ceil(env.rateLimitWindow / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API documentation
setupSwagger(app);

// API routes
app.use('/api', router);

// Catch 404 and forward to error handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
