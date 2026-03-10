import { Doctor } from '../doctor/doctor.model';
import { Appointment } from '../appointment/appointment.model';

export interface Slot {
    time: string;
    status: 'available' | 'booked';
}

export const slotService = {
    generateSlots: async (doctorId: string, date: string): Promise<Slot[]> => {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const requestedDate = new Date(date);
        const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });

        if (!doctor.availableDays.includes(dayOfWeek)) {
            return [];
        }

        const slots: Slot[] = [];
        const { start, end } = doctor.workingHours;
        const duration = doctor.slotDuration;

        const startTime = parseTime(start);
        const endTime = parseTime(end);

        const breakTimes = doctor.breakTimes.map(bt => ({
            start: parseTime(bt.start),
            end: parseTime(bt.end)
        }));

        const today = new Date();
        const isToday = requestedDate.toDateString() === today.toDateString();
        const currentTime = today.getHours() * 60 + today.getMinutes();

        // Fetch appointments for this doctor on this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        });

        const bookedSlots = appointments.map(app => app.timeSlot);

        let current = startTime;
        while (current + duration <= endTime) {
            const timeStr = formatTime(current);

            
            const isInBreak = breakTimes.some(bt => current >= bt.start && current < bt.end);

            if (!isInBreak) {
               
                if (!isToday || current > currentTime) {
                    const status = bookedSlots.includes(timeStr) ? 'booked' : 'available';
                    slots.push({ time: timeStr, status });
                }
            }

            current += duration;
        }

        return slots;
    }
};

function parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
