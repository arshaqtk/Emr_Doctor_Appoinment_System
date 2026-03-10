import { Router } from 'express';
import { searchPatients } from './patient.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/search', authMiddleware, searchPatients);

export default router;
