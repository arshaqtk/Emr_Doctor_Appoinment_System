import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRole } from '../constants/roles';

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface TokenPayload {
    userId: string;
    role: UserRole;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_SECRET as jwt.Secret, { expiresIn: ACCESS_EXPIRY });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, REFRESH_SECRET as jwt.Secret, { expiresIn: REFRESH_EXPIRY });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, ACCESS_SECRET as jwt.Secret) as TokenPayload;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, REFRESH_SECRET as jwt.Secret) as TokenPayload;
    } catch (error) {
        return null;
    }
};
