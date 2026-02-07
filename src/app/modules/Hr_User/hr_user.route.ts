import { Router } from 'express';
import { HrUserController } from './hr_user.controller';
import { HrUserService } from './hr_user.service';
import { validateRequest } from '../../middleware/validateRequest';
import { createHrUserSchema, loginSchema } from './hr_user.validation';

const router = Router();
const hrUserService = new HrUserService();
const hrUserController = new HrUserController(hrUserService);

// POST /auth/register - Create HR user
router.post('/register', validateRequest(createHrUserSchema), hrUserController.createHrUser.bind(hrUserController));

// POST /auth/login - HR user login
router.post('/login', validateRequest(loginSchema), hrUserController.login.bind(hrUserController));

export { router as hrUserRoutes };
