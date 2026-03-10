import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
    user: Types.ObjectId;
    specialization: string;
    department: string;
    experience: number;
    qualification: string;
    consultationFee: number;
    slotDuration: number;
    workingHours: {
        start: string;
        end: string;
    };
    breakTimes: Array<{
        start: string;
        end: string;
    }>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true, index: true },
    experience: { type: Number, required: true },
    qualification: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    slotDuration: { type: Number, required: true, default: 30 },
    workingHours: {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    availableDays: { type: [String], required: true, default: [] },
    breakTimes: [{
        start: { type: String, required: true },
        end: { type: String, required: true }
    }],
    isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export const Doctor = model<IDoctor>('Doctor', doctorSchema);
