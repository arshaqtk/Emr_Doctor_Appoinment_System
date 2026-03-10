import { Doctor } from '../doctor/doctor.model';
import { Appointment } from '../appointment/appointment.model';
import { AppointmentStatus } from '../appointment/appointment.model';

class SlotService {
    async generateSlots(doctorId: string, date: string) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.isActive) {
            throw new Error('Doctor not found or inactive');
        }

        // Check if doctor works on this day
        const dayName = new Date(date).toLocaleString('en-US', { weekday: 'long' });
        if (!doctor.availableDays.includes(dayName)) {
            return [];
        }

        const slots = [];
        const startMinutes = this.timeToMinutes(doctor.workingHours.start);
        const endMinutes = this.timeToMinutes(doctor.workingHours.end);
        const duration = doctor.slotDuration;

        // Get booked appointments for this doctor and date
        const bookedAppointments = await Appointment.find({
            doctor: doctorId,
            date,
            status: { $ne: AppointmentStatus.CANCELLED }
        }).select('time');

        const bookedTimes = bookedAppointments.map(app => app.time);

        let current = startMinutes;
        const now = new Date();
        const isToday = now.toISOString().split('T')[0] === date;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        while (current + duration <= endMinutes) {
            const timeStr = this.minutesToTime(current);

            // Check if inside break times
            const isBreak = doctor.breakTimes.some(b => {
                const bStart = this.timeToMinutes(b.start);
                const bEnd = this.timeToMinutes(b.end);
                return current >= bStart && current < bEnd;
            });

            // Check if in the past (if booking for today)
            const isPast = isToday && current < currentMinutes;

            if (!isBreak && !isPast) {
                slots.push({
                    time: timeStr,
                    isBooked: bookedTimes.includes(timeStr)
                });
            }

            current += duration;
        }

        return slots;
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private minutesToTime(minutes: number): string {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
}

export const slotService = new SlotService();
