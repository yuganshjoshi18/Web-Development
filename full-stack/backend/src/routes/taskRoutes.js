import { Router } from 'express';
import { createTask, deleteTask, getTasks } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Every task operation requires the demo JWT.
router.use(requireAuth);

router.get('/', getTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);

export default router;
