import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/user/user.model';

export const roleMiddleware = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User not authenticated'
            });
        }

        const { role } = req.user;

        // Super admins have access to all system pages/routes
        if (role === UserRole.SUPER_ADMIN) {
            return next();
        }

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions for this role'
            });
        }

        next();
    };
};
