import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';

/**
 * In-memory user store.
 *
 * A demo account is seeded so the login endpoint can be exercised immediately.
 * Only the bcrypt hash is stored; the plaintext password never touches the
 * users array.
 */
export const users = [
  {
    id: randomUUID(),
    username: 'admin',
    fullname: 'Alex Morgan',
    passwordHash: bcrypt.hashSync('internware', config.bcryptRounds),
    createdAt: '2026-10-20T10:00:00.000Z',
  },
];
