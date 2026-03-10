import { Schema, model } from 'mongoose';

const doctorSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    qualification: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    availability: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        startTime: { type: String },
        endTime: { type: String }
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Doctor = model('Doctor', doctorSchema);
