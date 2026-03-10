import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { UserRole } from '../../constants/roles';
import { auditService } from '../audit/audit.service';


export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body, UserRole.DOCTOR);

        // Log doctor user creation
        await auditService.log({
            userId: (req as any).user?.userId,
            role: (req as any).user?.role,
            action: 'USER_CREATE_DOCTOR',
            entity: 'User',
            entityId: user._id.toString(),
            description: `Doctor account created for ${user.email}`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(201).json({
            success: true,
            message: 'Doctor account created successfully',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createReceptionist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body, UserRole.RECEPTIONIST);

        // Log receptionist creation
        await auditService.log({
            userId: (req as any).user?.userId,
            role: (req as any).user?.role,
            action: 'USER_CREATE_RECEPTIONIST',
            entity: 'User',
            entityId: user._id.toString(),
            description: `Receptionist account created for ${user.email}`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(201).json({
            success: true,
            message: 'Receptionist account created successfully',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            users
        });
    } catch (error: any) {
        next(error);
    }
};


export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id as string;
        const user = await userService.updateUser(userId, req.body);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
