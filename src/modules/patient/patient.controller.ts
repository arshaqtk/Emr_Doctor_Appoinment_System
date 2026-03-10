import { Request, Response } from 'express';
import { patientService } from './patient.service';

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
