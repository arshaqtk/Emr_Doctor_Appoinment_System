import { Router } from 'express';
import {
    createDoctor,
    getMyDoctorProfile,
    getDoctors,
    getDoctorById,
    updateDoctor,
    updateAvailability
} from './doctor.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { UserRole } from '../../constants/roles';

const router = Router();

router.use(authMiddleware);
router.get('/', getDoctors);
router.get('/me', getMyDoctorProfile);
router.get('/:id', getDoctorById);

/**
 * Restrict everything below to SUPER_ADMIN only
 */
router.use(authorizeRoles(UserRole.SUPER_ADMIN));
router.post('/', createDoctor);
router.patch('/:id', updateDoctor);
router.patch('/:id/availability', updateAvailability);

export default router;
