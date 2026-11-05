import { Router } from 'express';
import { createTask, deleteTask, getCompletedTasks, getTasks, updateTask } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

/*
 * Public reads.
 * /done is declared before any parameterised route so it can never be
 * mistaken for a task id.
 */
router.get('/', getTasks);
router.get('/done', getCompletedTasks);

/*
 * Protected writes. Clients must send either a valid JWT from POST /login or
 * the demo token configured through DEMO_TOKEN.
 */
router.post('/', requireAuth, createTask);
router.put('/:id', requireAuth, updateTask);
router.delete('/:id', requireAuth, deleteTask);

export default router;
