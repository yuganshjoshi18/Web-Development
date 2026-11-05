import 'dotenv/config';
import { randomBytes } from 'node:crypto';

const configuredSecret = process.env.JWT_SECRET;
const hasConfiguredSecret =
  Boolean(configuredSecret) && configuredSecret !== 'replace-with-a-long-random-secret';

/**
 * Application configuration.
 *
 * In development the app still boots if JWT_SECRET is absent by generating a
 * random, process-local secret. Tokens issued with that fallback stop working
 * after a restart, so real deployments must provide JWT_SECRET via the
 * environment. No secret is ever committed to source control.
 */
export const config = Object.freeze({
  port: Number(process.env.PORT) || 5000,
  jwtSecret: hasConfiguredSecret ? configuredSecret : randomBytes(32).toString('hex'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  demoToken: process.env.DEMO_TOKEN || 'demo-token-internware-2026',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  isEphemeralJwtSecret: !hasConfiguredSecret,
});
