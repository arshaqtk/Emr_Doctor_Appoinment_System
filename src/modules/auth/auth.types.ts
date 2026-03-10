import { IUser } from '../user/user.model';

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}
