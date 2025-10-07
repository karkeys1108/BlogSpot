import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { create, list, join, detail, addRecommendation, removeRecommendation } from '../controllers/classroomController.js';

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', authorize('faculty'), create);
router.post('/join', join);
router.get('/:id', detail);
router.post('/:id/recommendations', authorize('faculty'), addRecommendation);
router.delete('/:id/recommendations/:recommendationId', authorize('faculty'), removeRecommendation);

export default router;
