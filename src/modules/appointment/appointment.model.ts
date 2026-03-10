import { Schema, model, Document, Types } from 'mongoose';

export enum AppointmentStatus {
    BOOKED = 'BOOKED',
    ARRIVED = 'ARRIVED',
    IN_CONSULTATION = 'IN_CONSULTATION',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW'
}

export interface IAppointment extends Document {
    doctor: Types.ObjectId;
    patient: Types.ObjectId;
    date: string; // Format: YYYY-MM-DD
    time: string; // Format: HH:mm
    purpose?: string;
    notes?: string;
    status: AppointmentStatus;
    arrivalTime?: Date;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    purpose: { type: String },
    notes: { type: String },
    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.BOOKED,
        index: true
    },
    arrivalTime: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Compound unique index for double booking prevention
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);
