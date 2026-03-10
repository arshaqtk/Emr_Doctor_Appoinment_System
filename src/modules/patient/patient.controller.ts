import { Request, Response } from 'express';
import { patientService } from './patient.service';
import { auditService } from '../audit/audit.service';

export const searchPatients = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({ message: 'Query parameter q is required' });
            return;
        }
        const patients = await patientService.searchPatients(q);
        res.status(200).json(patients);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createPatient = async (req: Request, res: Response) => {
    try {
        const patient = await patientService.createPatient(req.body);

        // Log patient creation
        await auditService.log({
            userId: (req as any).user?.userId,
            role: (req as any).user?.role,
            action: 'PATIENT_CREATE',
            entity: 'Patient',
            entityId: patient._id.toString(),
            description: `Registered patient ${patient.name} (${patient.patientId})`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(201).json(patient);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getPatients = async (req: Request, res: Response) => {
    try {
        const { q, page = '1', limit = '20' } = req.query;
        const patients = await patientService.getPatients(
            q as string | undefined,
            Number(page),
            Number(limit)
        );
        res.status(200).json(patients);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPatientById = async (req: Request, res: Response) => {
    try {
        const patient = await patientService.getPatientById(req.params.id as string);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
