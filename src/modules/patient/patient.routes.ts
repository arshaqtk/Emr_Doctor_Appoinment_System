import { Router } from 'express';
import {
    searchPatients,
    createPatient,
    getPatients,
    getPatientById
} from './patient.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/search', searchPatients);
router.get('/', getPatients);
router.post('/', createPatient);
router.get('/:id', getPatientById);

export default router;
