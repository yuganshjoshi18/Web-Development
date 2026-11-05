import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { users } from '../data/users.js';

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,32}$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 72; // bcrypt truncates beyond 72 bytes

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    createdAt: user.createdAt,
  };
}

/**
 * POST /signup
 * Creates a user after validating the payload and preventing duplicate
 * usernames. Passwords are hashed with bcrypt before being stored.
 */
export async function signup(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { username, password, fullname } = body;
  const details = [];

  if (!isNonEmptyString(fullname)) {
    details.push({ field: 'fullname', message: 'Full name is required.' });
  } else if (fullname.trim().length > 80) {
    details.push({ field: 'fullname', message: 'Full name must be 80 characters or fewer.' });
  }

  if (!isNonEmptyString(username)) {
    details.push({ field: 'username', message: 'Username is required.' });
  } else if (!USERNAME_PATTERN.test(username.trim())) {
    details.push({
      field: 'username',
      message: 'Username must be 3-32 characters and may only contain letters, numbers, dots, dashes or underscores.',
    });
  }

  if (typeof password !== 'string' || password.length === 0) {
    details.push({ field: 'password', message: 'Password is required.' });
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    details.push({ field: 'password', message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
  } else if (password.length > MAX_PASSWORD_LENGTH) {
    details.push({ field: 'password', message: `Password must be at most ${MAX_PASSWORD_LENGTH} characters.` });
  }

  if (details.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details });
  }

  const cleanUsername = username.trim();
  const exists = users.some(
    (user) => user.username.toLowerCase() === cleanUsername.toLowerCase(),
  );

  if (exists) {
    return res.status(409).json({ error: 'Username is already taken.' });
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  const user = {
    id: randomUUID(),
    username: cleanUsername,
    fullname: fullname.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  return res.status(201).json({
    message: 'User registered successfully.',
    user: publicUser(user),
  });
}

/**
 * POST /login
 * Verifies the credentials with bcrypt and returns a signed JWT.
 */
export async function login(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { username, password } = body;
  const details = [];

  if (!isNonEmptyString(username)) {
    details.push({ field: 'username', message: 'Username is required.' });
  }

  if (typeof password !== 'string' || password.length === 0) {
    details.push({ field: 'password', message: 'Password is required.' });
  }

  if (details.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details });
  }

  const user = users.find(
    (candidate) => candidate.username.toLowerCase() === username.trim().toLowerCase(),
  );

  // Use the same response for unknown users and wrong passwords so the
  // endpoint does not reveal which usernames exist.
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
      fullname: user.fullname,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );

  return res.json({
    message: 'Login successful.',
    tokenType: 'Bearer',
    expiresIn: config.jwtExpiresIn,
    token,
    user: publicUser(user),
  });
}
