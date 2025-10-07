import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import env from '../config/env.js';
import { User } from '../models/index.js';

let googleConfigured = false;

const configurePassport = () => {
  if (!env.google.clientId || !env.google.clientSecret) {
    console.warn('Google OAuth environment variables are missing. Google login will be disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.google.clientId,
        clientSecret: env.google.clientSecret,
        callbackURL: env.google.callbackUrl
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase() || `${profile.id}@googleuser.com`;

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              role: 'student',
              googleId: profile.id
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.name) {
              user.name = profile.displayName;
            }
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  googleConfigured = true;

  passport.serializeUser((user, done) => {
    done(null, user.id?.toString?.() || user._id?.toString?.());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export const isGoogleConfigured = () => googleConfigured;

export default configurePassport;
