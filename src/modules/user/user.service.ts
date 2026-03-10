import { User, IUser } from './user.model';
import { UserRole } from '../../constants/roles';
import { hashPassword } from '../../utils/password';

export const userService = {
    
    createUser: async (userData: any, role: UserRole): Promise<IUser> => {
        const { email, password, name, phone } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User with this email already exists.');
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            phone,
            role,
            isActive: true
        });

        return newUser;
    },

    getAllUsers: async (): Promise<IUser[]> => {
        return await User.find({role: {$ne: UserRole.SUPER_ADMIN}}).select('-password').sort({ createdAt: -1 });
    },


    updateUser: async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        return updatedUser;
    },

    getUserById: async (userId: string): Promise<IUser | null> => {
        return await User.findById(userId).select('-password');
    }
};
