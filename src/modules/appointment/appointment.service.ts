import mongoose from 'mongoose';
import { Appointment, IAppointment, AppointmentStatus } from './appointment.model';
import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';
import { patientService } from '../patient/patient.service';
import { generateSlots } from '../slots/slot.service';

export const appointmentService = {
    createAppointment: async (data: any, createdBy: string) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { doctorId, date, time, patientType, patientId, patientData, purpose, notes } = data;

            const doctor = await Doctor.findById(doctorId).session(session);
            if (!doctor || !doctor.isActive) {
                throw new Error('Doctor not found or inactive');
            }

            const availableSlots = await generateSlots(doctorId, date);
            const requestedSlot = availableSlots.find(s => s.time === time);

            if (!requestedSlot) {
                throw new Error('Requested slot is not available or is in the past/break');
            }
            if (requestedSlot.isBooked) {
                throw new Error('Slot already booked');
            }

            let finalPatientId;

            if (patientType === 'NEW') {
                if (!patientData || !patientData.name || !patientData.mobile) {
                    throw new Error('Patient name and mobile are required for new registration');
                }
                const newPatient = await patientService.createPatient(patientData, session);
                finalPatientId = newPatient._id;
            } else if (patientType === 'EXISTING') {
                if (!patientId) {
                    throw new Error('Patient ID is required for existing patient');
                }
                const patient = await Patient.findOne({ patientId }).session(session);
                if (!patient) {
                    throw new Error('Patient not found with the provided patientId');
                }
                finalPatientId = patient._id;
            } else {
                throw new Error('Invalid patient type');
            }

            const appointment = new Appointment({
                doctor: doctorId,
                patient: finalPatientId,
                date,
                time,
                purpose,
                notes,
                status: AppointmentStatus.BOOKED,
                createdBy
            });

            await appointment.save({ session });

            await session.commitTransaction();
            session.endSession();

            return appointment; 
        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            if (error.code === 11000) {
                const err: any = new Error('Slot already booked');
                err.status = 409;
                throw err;
            }
            throw error;
        }
    },

    getAppointments: async (filters: any) => {
        const { doctorId, date, status, page = 1, limit = 10 } = filters;
        const query: any = {};
        if (doctorId) query.doctor = doctorId;
        if (date) query.date = date;
        if (status) query.status = status;

        const [data, total] = await Promise.all([
            Appointment.find(query)
                .populate({
                    path: 'doctor',
                    populate: { path: 'user', select: 'name email phone' }
                })
                .populate('patient', 'name mobile patientId')
                .sort({ time: 1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean(),
            Appointment.countDocuments(query)
        ]);

        return { data, total, page: Number(page), limit: Number(limit) };
    },

    updateAppointment: async (id: string, updateData: any) => {
        const { purpose, notes } = updateData;
        return await Appointment.findByIdAndUpdate(
            id,
            { $set: { purpose, notes } }, 
            { new: true }
        );
    },

    deleteAppointment: async (id: string) => {
        return await Appointment.findByIdAndDelete(id);
    },

    markArrived: async (id: string) => {
        return await Appointment.findByIdAndUpdate(
            id,
            {
                $set: { 
                    status: AppointmentStatus.ARRIVED,
                    arrivalTime: new Date()
                }
            },
            { new: true }
        );
    } 
};