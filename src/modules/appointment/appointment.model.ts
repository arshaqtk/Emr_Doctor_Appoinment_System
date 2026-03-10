import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    reason: { type: String },
    notes: { type: String },
}, { timestamps: true });

export const Appointment = model('Appointment', appointmentSchema);
