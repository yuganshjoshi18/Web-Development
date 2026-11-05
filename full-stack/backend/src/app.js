import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.disable('x-powered-by');
app.use(requestLogger);
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '50kb' }));

// Connectivity check used by the frontend on load.
app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Full-stack API running',
    ping: '/ping',
    tasks: '/tasks (protected)',
    login: 'POST /auth/login',
  });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`\nFull-stack API listening on http://localhost:${config.port}`);
  console.log('Public:  GET /ping, POST /auth/login');
  console.log('Protected: GET /tasks, POST /tasks, DELETE /tasks/:id');

  if (config.isEphemeralJwtSecret) {
    console.warn(
      '\n[warning] JWT_SECRET is not set. A random secret was generated for this process only;',
    );
    console.warn('          tokens will be invalid after a restart. Copy .env.example to .env.\n');
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use. Set PORT in .env or start on another port.`);
    process.exit(1);
  }

  throw error;
});

export default app;
