import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { generateToken } from '../utils/token.js';

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const json = userDoc.toJSON ? userDoc.toJSON() : { ...userDoc };
  delete json.passwordHash;
  return json;
};

export const registerUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { status: 409 });
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    role: role || 'student'
  });

  const token = generateToken({ id: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !user.passwordHash) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  const token = generateToken({ id: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
};

export const createTokenForUser = (user) => {
  const token = generateToken({ id: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
};
