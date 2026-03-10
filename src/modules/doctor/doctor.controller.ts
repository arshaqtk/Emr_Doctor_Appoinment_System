import { Request, Response, NextFunction } from 'express';
import { doctorService } from './doctor.service';


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


export const getDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const department = req.query.department as string;
        const doctors = await doctorService.getDoctors(department);

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
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
