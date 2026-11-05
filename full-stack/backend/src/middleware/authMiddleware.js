import jwt from 'jsonwebtoken';
import { config } from '../config.js';

function readBearerToken(req) {
  const header = req.headers.authorization;

  if (!header || typeof header !== 'string') {
    return null;
  }

  const [scheme, token] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token.trim();
}

/**
 * Protects the task routes. Every request must include the JWT returned by
 * POST /auth/login.
 */
export function requireAuth(req, res, next) {
  const token = readBearerToken(req);

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      hint: 'Send an Authorization header in the form "Bearer <token>".',
    });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
      hint: 'Sign in again to obtain a fresh token.',
    });
  }
}
