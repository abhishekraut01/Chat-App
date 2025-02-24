import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import errorHandler from './middlewares/globelErrorhandler.middleware';
import ApiError from './utils/ApiError';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use routes
import authRoute from './routes/auth.routes';
import messageRoutes from './routes/message.routes';


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/message', messageRoutes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route Not Found'));
});

// Global Error Handler
app.use(errorHandler);
export default app;