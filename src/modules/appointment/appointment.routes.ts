import { Router } from 'express';
import {
    createAppointment,
    getAllAppointments,
    updateAppointment,
    deleteAppointment,
    arriveAppointment
} from './appointment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.patch('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.patch('/:id/arrive', arriveAppointment);

export default router;
