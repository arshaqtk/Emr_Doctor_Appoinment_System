import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { auditService } from '../audit/audit.service';


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const data = await authService.login(email, password);

        res.cookie('accessToken', data.accessToken, {
            httpOnly: true,
            secure: true, // Always true for cross-site cookies
            sameSite: 'none', // Required for cross-site cookies between Render and Vercel
            maxAge: Number(process.env.ACCESS_COOKIE_MAXAGE) || 15 * 60 * 1000
        });

        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: true, // Always true for cross-site cookies
            sameSite: 'none', // Required for cross-site cookies between Render and Vercel
            maxAge: Number(process.env.REFRESH_COOKIE_MAXAGE) || 7 * 24 * 60 * 60 * 1000
        });

        // Log successful login
        await auditService.log({
            userId: data.user.id,
            role: data.user.role,
            action: 'LOGIN_SUCCESS',
            entity: 'User',
            entityId: data.user.id,
            description: `User logged in: ${data.user.email}`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: data.user
        });
    } catch (error: any) {
        // Log failed login attempt if possible
        const email = req.body?.email;
        if (email) {
            await auditService.log({
                userId: '000000000000000000000000', // System/Unknown
                role: 'GUEST',
                action: 'LOGIN_FAILURE',
                entity: 'User',
                description: `Failed login attempt for email: ${email}. Error: ${error.message}`,
                ip: req.ip,
                userAgent: req.get('user-agent')
            });
        }
        res.status(401).json({ success: false, message: error.message });
    }
};


export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token is required' });
        }

        const data = await authService.refresh(refreshToken);

        res.cookie('accessToken', data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: Number(process.env.ACCESS_COOKIE_MAXAGE) || 15 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully'
        });
    } catch (error: any) {
        res.status(401).json({ success: false, message: error.message });
    }
};

/**
 * Handle user logout, clear cookies and invalidate refresh token
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        // Clear cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        // Log logout
        if (req.user) {
            await auditService.log({
                userId: req.user.userId,
                role: req.user.role,
                action: 'LOGOUT',
                entity: 'User',
                entityId: req.user.userId,
                description: `User logged out`,
                ip: req.ip,
                userAgent: req.get('user-agent')
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error: any) {
        next(error);
    }
};
