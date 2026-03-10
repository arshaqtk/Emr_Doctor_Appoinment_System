import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import { globalLimiter, authLimiter } from './middlewares/rateLimit.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import doctorRoutes from './modules/doctor/doctor.routes';
import appointmentRoutes from './modules/appointment/appointment.routes';
import slotRoutes from './modules/slots/slot.routes';
import patientRoutes from './modules/patient/patient.routes';
import morgan from 'morgan';
dotenv.config();

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/refresh', authLimiter);
app.use(morgan("dev"))

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'EMR API is running' });
});

// Route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/patients', patientRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
