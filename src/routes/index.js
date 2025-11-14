import { Router } from 'express';
import aiRoutes from './ai.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/ai', aiRoutes);
router.use('/users', userRoutes);

export default router;

