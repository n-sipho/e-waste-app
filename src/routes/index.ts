import { Router } from 'express';
import { authRoutes } from './auth-routes/auth.routes';

export const router = Router();

router.use('/auth', authRoutes);