/**
 * Hardcoded mock account used by POST /auth/login.
 *
 * This is deliberately a demo user: no database and no password hashing are
 * required by the full-stack brief. The credentials can be overridden with
 * DEMO_USERNAME / DEMO_PASSWORD environment variables.
 */
export const demoUser = {
  id: 'usr_demo_001',
  username: 'admin',
  name: 'Alex Morgan',
  role: 'Studio Administrator',
  email: 'admin@northwind.studio',
};
