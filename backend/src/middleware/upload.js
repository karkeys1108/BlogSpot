import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import fs from 'fs';
import env from '../config/env.js';
import cloudinary from '../services/cloudinaryService.js';

let storage;

if (env.cloudinary.cloudName) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'blogspot-certificates',
      resource_type: 'auto',
      allowed_formats: ['pdf', 'png', 'jpg', 'jpeg']
    }
  });
} else {
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
  });
}

const upload = multer({ storage });

export default upload;
