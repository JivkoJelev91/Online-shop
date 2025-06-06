import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { register, login, getProfile } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

export default router;
