import { Router } from 'express';
import * as userController from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { UserRole } from '../../constants/roles';

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.SUPER_ADMIN));

router.post('/doctor', userController.createDoctor);
router.post('/receptionist', userController.createReceptionist);
router.get('/', userController.getUsers);
router.patch('/:id', userController.patchUser);

export default router;
