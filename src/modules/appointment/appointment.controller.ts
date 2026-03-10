import { Request, Response } from 'express';
import { appointmentService } from './appointment.service';
import { auditService } from '../audit/audit.service';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const createdBy = (req as any).user?.userId;
        const appointment = await appointmentService.createAppointment(req.body, createdBy);

        // Log appointment creation
        await auditService.log({
            userId: createdBy,
            role: (req as any).user?.role,
            action: 'APPOINTMENT_CREATE',
            entity: 'Appointment',
            entityId: appointment._id.toString(),
            description: `Appointment created for patient date ${appointment.date} ${appointment.time}`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(201).json(appointment);
    } catch (error: any) {
        const status = error.status || 400;
        res.status(status).json({ message: error.message });
    }
};

export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await appointmentService.getAppointments(req.query);
        res.status(200).json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.updateAppointment(req.params.id as string, req.body);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Log update
        await auditService.log({
            userId: (req as any).user?.userId,
            role: (req as any).user?.role,
            action: 'APPOINTMENT_UPDATE',
            entity: 'Appointment',
            entityId: appointment._id.toString(),
            description: `Appointment updated for ID: ${req.params.id}`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(200).json(appointment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.deleteAppointment(req.params.id as string);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Log deletion
        await auditService.log({
            userId: (req as any).user?.userId,
            role: (req as any).user?.role,
            action: 'APPOINTMENT_DELETE',
            entity: 'Appointment',
            entityId: req.params.id,
            description: `Appointment cancelled/deleted`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(200).json({ message: 'Appointment cancelled', appointment });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const arriveAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.markArrived(req.params.id as string);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.status(200).json(appointment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
