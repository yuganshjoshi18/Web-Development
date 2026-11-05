import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { demoUser } from '../data/users.js';

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * POST /auth/login
 * Mock authentication against a hardcoded demo account. Returns a signed JWT
 * that the protected task routes accept.
 */
export function login(req, res) {
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

  const usernameMatches =
    username.trim().toLowerCase() === config.demoUsername.toLowerCase();
  const passwordMatches = password === config.demoPassword;

  if (!usernameMatches || !passwordMatches) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    {
      sub: demoUser.id,
      username: demoUser.username,
      name: demoUser.name,
      role: demoUser.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );

  return res.json({
    message: 'Login successful.',
    tokenType: 'Bearer',
    expiresIn: config.jwtExpiresIn,
    token,
    user: demoUser,
  });
}
