import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: 'Access token missing. Please log in.'
        });
    }

    const decoded = verifyAccessToken(accessToken);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired access token.'
        });
    }

    req.user = decoded;
    next();
};
