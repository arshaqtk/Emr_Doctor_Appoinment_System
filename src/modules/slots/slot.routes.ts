import { Router } from 'express';
import { getSlots } from './slot.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getSlots);

export default router;
