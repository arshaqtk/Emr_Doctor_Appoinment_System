import { Schema, model, Document, Types } from 'mongoose';
import { UserRole } from '../../constants/roles';

export interface IAuditLog extends Document {
    userId: Types.ObjectId | string;
    role: UserRole | string;
    action: string;
    entity: string;
    entityId?: string;
    description?: string;
    timestamp: Date;
    ip?: string;
    userAgent?: string;
}

const auditLogSchema = new Schema<IAuditLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, required: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String },
    description: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
    ip: { type: String },
    userAgent: { type: String }
}, { timestamps: false });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
