import { randomUUID } from 'node:crypto';
import { tasks } from '../data/tasks.js';

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * GET /tasks (protected)
 */
export function getTasks(req, res) {
  return res.json(tasks);
}

/**
 * POST /tasks (protected)
 * Creates a task, assigns a unique id and starts it as incomplete.
 */
export function createTask(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const details = [];

  if (!isNonEmptyString(body.title)) {
    details.push({ field: 'title', message: 'Title is required.' });
  } else if (body.title.trim().length > MAX_TITLE_LENGTH) {
    details.push({
      field: 'title',
      message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    });
  }

  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    details.push({ field: 'description', message: 'Description must be a string.' });
  } else if (typeof body.description === 'string' && body.description.length > MAX_DESCRIPTION_LENGTH) {
    details.push({
      field: 'description',
      message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
    });
  }

  if (details.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details });
  }

  const task = {
    id: randomUUID(),
    title: body.title.trim(),
    description: typeof body.description === 'string' ? body.description.trim() : '',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);

  return res.status(201).location(`/tasks/${task.id}`).json(task);
}

/**
 * DELETE /tasks/:id (protected)
 */
export function deleteTask(req, res) {
  const index = tasks.findIndex((task) => task.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const [deletedTask] = tasks.splice(index, 1);

  return res.json({
    message: 'Task deleted successfully.',
    task: deletedTask,
  });
}
