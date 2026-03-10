import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import doctorRoutes from './modules/doctor/doctor.routes';
import appointmentRoutes from './modules/appointment/appointment.routes';

dotenv.config();

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'EMR API is running' });
});

// Route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
