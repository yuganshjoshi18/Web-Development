import { randomUUID } from 'node:crypto';
import { tasks } from '../data/tasks.js';

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1000;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function bodyOf(req) {
  return req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
}

/**
 * Validates task fields used by both create and update.
 * Only fields present in the payload are validated when `partial` is true,
 * which also allows callers to update a single property.
 */
function collectTaskDetails(body, { partial = false } = {}) {
  const details = [];
  const has = (field) => Object.prototype.hasOwnProperty.call(body, field);

  if (!partial || has('title')) {
    if (!isNonEmptyString(body.title)) {
      details.push({ field: 'title', message: 'Title is required and must be a non-empty string.' });
    } else if (body.title.trim().length > MAX_TITLE_LENGTH) {
      details.push({ field: 'title', message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.` });
    }
  }

  if (has('description') && body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string') {
      details.push({ field: 'description', message: 'Description must be a string.' });
    } else if (body.description.length > MAX_DESCRIPTION_LENGTH) {
      details.push({
        field: 'description',
        message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
      });
    }
  }

  if (has('completed') && typeof body.completed !== 'boolean') {
    details.push({ field: 'completed', message: 'Completed must be a boolean.' });
  }

  return details;
}

/**
 * GET /tasks
 * Returns every task. This read endpoint is public.
 */
export function getTasks(req, res) {
  return res.json(tasks);
}

/**
 * GET /tasks/done
 * Bonus: filters the collection down to completed tasks.
 */
export function getCompletedTasks(req, res) {
  return res.json(tasks.filter((task) => task.completed === true));
}

/**
 * POST /tasks (protected)
 * Creates a task with a unique id, a createdAt timestamp and completed=false
 * unless explicitly supplied.
 */
export function createTask(req, res) {
  const body = bodyOf(req);
  const details = collectTaskDetails(body);

  if (details.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details });
  }

  const task = {
    id: randomUUID(),
    title: body.title.trim(),
    description: typeof body.description === 'string' ? body.description.trim() : '',
    completed: body.completed === true,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);

  return res
    .status(201)
    .location(`/tasks/${task.id}`)
    .json(task);
}

/**
 * PUT /tasks/:id (protected)
 * Updates only the fields supplied by the caller. Unknown fields and
 * immutable fields such as id/createdAt are ignored.
 */
export function updateTask(req, res) {
  const index = tasks.findIndex((task) => task.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const body = bodyOf(req);
  const updatableFields = ['title', 'description', 'completed'];
  const suppliedFields = updatableFields.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field),
  );

  if (suppliedFields.length === 0) {
    return res.status(400).json({
      error: 'No updatable fields provided.',
      allowedFields: updatableFields,
    });
  }

  const details = collectTaskDetails(body, { partial: true });

  if (details.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details });
  }

  const task = tasks[index];

  if (suppliedFields.includes('title')) {
    task.title = body.title.trim();
  }

  if (suppliedFields.includes('description')) {
    task.description = typeof body.description === 'string' ? body.description.trim() : '';
  }

  if (suppliedFields.includes('completed')) {
    task.completed = body.completed;
  }

  return res.json(task);
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
