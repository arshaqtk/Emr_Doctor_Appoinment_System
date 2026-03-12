import { Doctor } from '../doctor/doctor.model';
import { Appointment } from '../appointment/appointment.model';

export const generateSlots = async (doctorId: string, date: string) => {

    const doctor = await Doctor.findById(doctorId);

    if (!doctor || !doctor.isActive) {
        throw new Error('Doctor not found or inactive');
    }

    const dayName = new Date(date + 'T00:00:00')
        .toLocaleString('en-US', { weekday: 'long' });

    if (!doctor.availableDays.includes(dayName)) {
        return [];
    }

    const slots = [];

    const startMinutes = timeToMinutes(doctor.workingHours.start);
    const endMinutes = timeToMinutes(doctor.workingHours.end);
    const duration = doctor.slotDuration;

    const bookedAppointments = await Appointment.find({
        doctor: doctorId,
        date
    }).select('time');

    const bookedTimes = bookedAppointments.map(app => app.time);

    let current = startMinutes;

    const now = new Date();

    const localDate =
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const isToday = localDate === date;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    while (current + duration <= endMinutes) {

        const timeStr = minutesToTime(current);

        const isBreak = doctor.breakTimes.some(b => {
            const bStart = timeToMinutes(b.start);
            const bEnd = timeToMinutes(b.end);
            return current >= bStart && current < bEnd;
        });

        const isPast = isToday && current < currentMinutes;

        if (!isBreak && !isPast) {
            slots.push({
                time: timeStr,
                isBooked: bookedTimes.includes(timeStr),
                status: bookedTimes.includes(timeStr) ? 'booked' : 'available'
            });
        }

        current += duration;
    }

    return slots;
};


const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};