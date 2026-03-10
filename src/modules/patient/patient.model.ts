import { Schema, model, Document } from 'mongoose';

export interface IPatient extends Document {
    patientId: string;
    name: string;
    mobile: string;
    gender?: string;
    age?: number;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
}

const patientSchema = new Schema<IPatient>({
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true, index: true },
    mobile: { type: String, required: true, index: true },
    gender: { type: String },
    age: { type: Number },
    email: { type: String },
}, { timestamps: true });

//  text index for search
patientSchema.index({ name: 'text', mobile: 'text', patientId: 'text' });

export const Patient = model<IPatient>('Patient', patientSchema);
