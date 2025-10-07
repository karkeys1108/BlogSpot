import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { User } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwt.secret);
    const user = await User.findById(decoded.id).lean({ virtuals: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token user' });
    }

    delete user.passwordHash;
    req.user = user;
    return next();
  } catch (error) {
    console.error('Auth error', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};
