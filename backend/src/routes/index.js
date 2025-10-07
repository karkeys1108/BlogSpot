import { Router } from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import classroomRoutes from './classroomRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/certificates', certificateRoutes);
router.use('/classrooms', classroomRoutes);

export default router;
