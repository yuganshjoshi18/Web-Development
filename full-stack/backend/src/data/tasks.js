import { randomUUID } from 'node:crypto';

/**
 * In-memory task store for the full-stack demo. It resets on restart.
 * A short starter list gives the UI something to show on first launch.
 */
export const tasks = [
  {
    id: randomUUID(),
    title: 'Finalise the Q4 release brief',
    description: 'Tighten the scope, confirm the owners and share it with the studio.',
    completed: false,
    createdAt: '2026-11-03T08:30:00.000Z',
  },
  {
    id: randomUUID(),
    title: 'Review the onboarding flow',
    description: 'Walk the new sign-up path on desktop and mobile, then note the rough edges.',
    completed: false,
    createdAt: '2026-11-04T10:10:00.000Z',
  },
  {
    id: randomUUID(),
    title: 'Plan the winter studio offsite',
    description: 'Shortlist two quiet places within a train ride of the city.',
    completed: false,
    createdAt: '2026-11-05T07:45:00.000Z',
  },
];
