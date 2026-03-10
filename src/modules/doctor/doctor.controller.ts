import { Request, Response, NextFunction } from 'express';
import { doctorService } from './doctor.service';
import { Doctor } from './doctor.model';


export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newDoctor = await doctorService.createDoctor(req.body);

        res.status(201).json({
            success: true,
            message: 'Doctor profile created successfully',
            data: newDoctor
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const getMyDoctorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;   // JWT TokenPayload uses 'userId', not '_id'
        const doctor = await Doctor.findOne({ user: userId })
            .populate('user', 'name email phone')
            .lean();
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found for this user' });
        }
        res.status(200).json({ success: true, data: doctor });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const department = req.query.department as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await doctorService.getDoctors(department, page, limit);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error: any) {
        next(error);
    }
};


export const getDoctorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const doctor = await doctorService.getDoctorById(id);

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};


export const updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const doctor = await doctorService.updateDoctor(id, req.body);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
            data: doctor
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const { slotDuration, workingHours, breakTimes, availableDays } = req.body;

        const doctor = await doctorService.updateAvailability(id, slotDuration, workingHours, breakTimes, availableDays);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor schedule updated successfully',
            data: doctor
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
