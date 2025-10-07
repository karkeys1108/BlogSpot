import { Router } from 'express';
import { getCourses, getCourse, compare } from '../controllers/courseController.js';

const router = Router();

router.get('/', getCourses);
router.get('/compare', compare);
router.get('/:id', getCourse);

export default router;
