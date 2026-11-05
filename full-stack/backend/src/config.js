import 'dotenv/config';
import { randomBytes } from 'node:crypto';

const configuredSecret = process.env.JWT_SECRET;
const hasConfiguredSecret =
  Boolean(configuredSecret) && configuredSecret !== 'replace-with-a-long-random-secret';

/**
 * Full-stack demo configuration.
 *
 * The mock account is intentionally hardcoded for the assignment, while the
 * signing secret comes from the environment. A random process-local secret is
 * generated when JWT_SECRET is missing so the demo still starts cleanly.
 */
export const config = Object.freeze({
  port: Number(process.env.PORT) || 5001,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: hasConfiguredSecret ? configuredSecret : randomBytes(32).toString('hex'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  demoUsername: process.env.DEMO_USERNAME || 'admin',
  demoPassword: process.env.DEMO_PASSWORD || 'internware',
  isEphemeralJwtSecret: !hasConfiguredSecret,
});
