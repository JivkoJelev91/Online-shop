import dotenv from 'dotenv';
// Load environment variables from .env
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import productsRouter from './routes/products.routes';
import cartRouter from './routes/cart.routes';
import authRouter from './routes/auth.routes';
import orderRouter from './routes/order.routes';

// Validate required environment variables
const requiredEnvVars = ['PORT', 'JWT_SECRET', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const app = express();

// Enhanced security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
}));

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:4000', // Allow only this origin for now
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
}));

app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(morgan('dev'));

// Different rate limits for different routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/auth', authLimiter);
app.use('/products', apiLimiter);
app.use('/cart', apiLimiter);
app.use('/orders', apiLimiter);

// Routes
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);

// Enhanced error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  const errorResponse = {
    status: err.status || 500,
    message: err.status === 500 ? 'Internal Server Error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(errorResponse.status).json(errorResponse);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Gracefully shutdown the server
  process.exit(1);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

