import { v2 as cloudinary } from 'cloudinary';
import env from '../config/env.js';

if (env.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret
  });
} else {
  console.warn('Cloudinary environment variables are missing. Falling back to local storage.');
}

export default cloudinary;
