import { AuditLog } from './audit.model';
import { UserRole } from '../../constants/roles';

interface LogOptions {
    userId: string;
    role: string | UserRole;
    action: string;
    entity: string;
    entityId?: string;
    description?: string;
    ip?: string;
    userAgent?: string;
}

export const auditService = {
    log: async (options: LogOptions) => {
        try {
            const auditEntry = new AuditLog({
                ...options,
                timestamp: new Date()
            });
            await auditEntry.save();
        } catch (error) {
            console.error('Audit Log Error:', error);
        }
    }
};
