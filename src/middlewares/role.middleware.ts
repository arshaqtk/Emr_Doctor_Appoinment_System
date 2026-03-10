import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles';


export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. User context missing.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Role '${req.user.role}' does not have access to this resource.`
            });
        }

        next();
    };
};
