import { Request, Response, NextFunction } from 'express';
import { generateSlots } from './slot.service';

export const getSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({
                success: false,
                message: 'doctorId and date (YYYY-MM-DD) are required'
            });
        }

        const slots = await generateSlots(doctorId as string, date as string);

        res.status(200).json({
            success: true,
            data: slots
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
