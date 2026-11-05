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
 * Protects write operations.
 *
 * Two credentials are accepted:
 *   1. The hardcoded demo token (DEMO_TOKEN) for quick assessment checks.
 *   2. A valid JWT returned by POST /login.
 */
export function requireAuth(req, res, next) {
  const token = readBearerToken(req);

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      hint: 'Send an Authorization header in the form "Bearer <token>".',
    });
  }

  if (token === config.demoToken) {
    req.user = {
      id: 'demo-user',
      username: 'demo',
      fullname: 'Demo Reviewer',
      authType: 'demo-token',
    };
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { ...payload, authType: 'jwt' };
    return next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
      hint: 'Log in again to obtain a fresh JWT.',
    });
  }
}
