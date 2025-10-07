import { Router } from 'express';
import { body } from 'express-validator';
import env from '../config/env.js';
import { register, login, me, googleInitiate, googleCallback } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['student', 'faculty']).withMessage('Role must be student or faculty')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.get('/me', authenticate, me);

router.get('/google', googleInitiate);
router.get('/google/callback', googleCallback);

router.get('/google/failure', (req, res) => {
  res.redirect(`${env.frontendUrl}/login?error=google`);
});

export default router;
