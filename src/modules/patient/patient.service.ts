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
