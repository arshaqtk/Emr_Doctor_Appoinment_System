import { Patient, IPatient } from './patient.model';
import { ClientSession } from 'mongoose';

export const patientService = {
    createPatient: async (patientData: Partial<IPatient>, session?: ClientSession) => {
        const count = await Patient.countDocuments().session(session || null);
        const patientId = `PAT-${1000 + count + 1}`;

        const patient = new Patient({
            ...patientData,
            patientId
        });

        return await patient.save({ session });
    },

    getPatients: async (query?: string, page = 1, limit = 20) => {
        const filter: any = query
            ? {
                $or: [
                    { name: new RegExp(query, 'i') },
                    { mobile: new RegExp(query, 'i') },
                    { patientId: new RegExp(query, 'i') }
                ]
            }
            : {};

        const [data, total] = await Promise.all([
            Patient.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Patient.countDocuments(filter)
        ]);

        return { data, total, page, limit };
    },

    searchPatients: async (query: string) => {
        const regex = new RegExp(query, 'i');
        return await Patient.find({
            $or: [
                { name: regex },
                { mobile: regex },
                { patientId: regex }
            ]
        }).limit(10);
    },

    getPatientById: async (id: string) => {
        return await Patient.findById(id);
    },

    getPatientByPatientId: async (patientId: string) => {
        return await Patient.findOne({ patientId });
    }
};
