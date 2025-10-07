import { validationResult } from 'express-validator';
import passport from 'passport';
import env from '../config/env.js';
import { isGoogleConfigured } from '../middleware/passport.js';
import { registerUser, loginUser, createTokenForUser } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    const { user, token } = await registerUser({ name, email, password, role });

    res.status(201).json({
      message: 'Registration successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.json({
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  const user = req.user.toJSON ? req.user.toJSON() : req.user;
  if (user.passwordHash) {
    delete user.passwordHash;
  }
  res.json({
    data: {
      user
    }
  });
};

export const googleInitiate = (req, res, next) => {
  if (!isGoogleConfigured()) {
    return res.redirect(`${env.frontendUrl}/login?error=google-disabled`);
  }
  return passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  if (!isGoogleConfigured()) {
    return res.redirect(`${env.frontendUrl}/login?error=google-disabled`);
  }
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${env.frontendUrl}/login?error=google`);
    }
    const { token } = createTokenForUser(user);
    const redirectUrl = new URL(`${env.frontendUrl}/oauth-success`);
    redirectUrl.searchParams.set('token', token);
    res.redirect(redirectUrl.toString());
  })(req, res, next);
};
