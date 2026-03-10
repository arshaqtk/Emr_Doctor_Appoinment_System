import { Doctor, IDoctor } from './doctor.model';

export const doctorService = {

    createDoctor: async (doctorData: any): Promise<IDoctor> => {

        const existingDoctor = await Doctor.findOne({ user: doctorData.user });
        if (existingDoctor) {
            throw new Error('Doctor profile already exists for this user.');
        }

        const newDoctor = await Doctor.create(doctorData);
        return newDoctor;
    },


    getDoctors: async (department?: string, page: number = 1, limit: number = 10) => {
        const query: any = { isActive: true };

        if (department) {
            query.department = { $regex: new RegExp(`^${department}$`, 'i') };
        }

        const [data, total] = await Promise.all([
            Doctor.find(query)
                .populate('user', 'name email phone')
                .skip((page - 1) * limit)
                .limit(limit)
                .lean()
                .exec(),
            Doctor.countDocuments(query)
        ]);

        return { data, total, page, limit };
    },


    getDoctorById: async (doctorId: string) => {
        const doctor = await Doctor.findById(doctorId)
            .populate('user', 'name email phone')
            .lean()
            .exec();

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        return doctor;
    },


    updateDoctor: async (doctorId: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> => {

        delete updateData.workingHours;
        delete updateData.breakTimes;
        delete updateData.slotDuration;
        delete updateData.availableDays;
        delete updateData.user;

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('user', 'name email phone').exec();

        return updatedDoctor;
    },


    updateAvailability: async (
        doctorId: string,
        slotDuration: number,
        workingHours: IDoctor['workingHours'],
        breakTimes: IDoctor['breakTimes'],
        availableDays: IDoctor['availableDays']
    ): Promise<IDoctor | null> => {

        const updateData: any = {};
        if (slotDuration) updateData.slotDuration = slotDuration;
        if (workingHours) updateData.workingHours = workingHours;
        if (breakTimes) updateData.breakTimes = breakTimes;
        if (availableDays) updateData.availableDays = availableDays;

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('user', 'name email phone').exec();

        return updatedDoctor;
    }
};
