import { Router } from 'express';
import upload from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { uploadCertificateController, myCertificates } from '../controllers/certificateController.js';

const router = Router();

router.post('/:enrollmentId', authenticate, upload.single('certificate'), uploadCertificateController);
router.get('/mine', authenticate, myCertificates);

export default router;
