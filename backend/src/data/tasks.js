import { randomUUID } from 'node:crypto';

/**
 * In-memory task store.
 *
 * The data intentionally resets whenever the server restarts, as required by
 * the assessment. Keeping the store in its own module makes it easy to swap for
 * a database later without touching the controllers.
 */
export const tasks = [
  {
    id: randomUUID(),
    title: 'Review the API specification',
    description: 'Walk through the endpoint contract and flag any missing edge cases.',
    completed: true,
    createdAt: '2026-10-27T09:15:00.000Z',
  },
  {
    id: randomUUID(),
    title: 'Write integration tests',
    description: 'Cover the happy path plus validation and authentication failures.',
    completed: false,
    createdAt: '2026-10-29T13:40:00.000Z',
  },
  {
    id: randomUUID(),
    title: 'Prepare the release notes',
    description: 'Summarise the new endpoints and the demo-token workflow.',
    completed: false,
    createdAt: '2026-11-02T08:05:00.000Z',
  },
];
