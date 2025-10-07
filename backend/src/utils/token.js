import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateToken = (payload, options = {}) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
    ...options
  });
};
