import dotenv from 'dotenv';
import path from 'path';
// Load environment variables before any other imports that may depend on them
dotenv.config({ path: path.join(__dirname, '.env') });
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './Utils/swagger';
import { logRequestToFile } from './Middleware/LoggerMid';
import { router as authRouter } from './Routers/Authentication/AuthenticationRouter';
import { router as adminRouter } from './Routers/AdminRouter';
import { router as userRouter } from './Routers/UsersRouter';
import { errorHandler } from './Middleware/ErrorHandlerMid'
import { MyDB } from './Utils/ConnectDB';
import cors from 'cors';

const app = express();

// --- CORS ---
app.use(cors());
// --- END CORS ---
app.use(express.json());

// Initialize the database connection (singleton — safe to call multiple times)
MyDB.getDB();

// Log every incoming request to a daily rotating log file
app.use(logRequestToFile);

// Route registration
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);

// Swagger API documentation — available at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler — must be registered last so it catches errors from all routes
app.use(errorHandler);

export default app;