import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../../constants/roles';
export { UserRole };

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.RECEPTIONIST,
        index: true
    },
    phone: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
