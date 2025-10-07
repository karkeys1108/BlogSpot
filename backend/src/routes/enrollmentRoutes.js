import { Router } from 'express';
import { body } from 'express-validator';
import { enroll, myEnrollments, setProgress } from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post(
  '/',
  authenticate,
  [body('courseId').notEmpty().withMessage('courseId is required')],
  enroll
);

router.get('/mine', authenticate, myEnrollments);

router.patch(
  '/:id',
  authenticate,
  [
    body('progress').optional().isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
    body('status').optional().isIn(['enrolled', 'in-progress', 'completed']).withMessage('Invalid status')
  ],
  setProgress
);

export default router;
