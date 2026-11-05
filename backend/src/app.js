import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.disable('x-powered-by');

// Log every request, including malformed ones.
app.use(requestLogger);

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

// Root health/message endpoint.
app.get('/', (req, res) => {
  res.json({ message: 'Server running' });
});

// POST /signup, POST /login
app.use('/', authRoutes);

// GET /tasks, GET /tasks/done (public) + POST/PUT/DELETE (protected)
app.use('/tasks', taskRoutes);

// Unknown endpoints and centralised error handling.
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`\nBackend API listening on http://localhost:${config.port}`);
  console.log('Available endpoints: GET /, GET /tasks, GET /tasks/done,');
  console.log('POST /tasks, PUT /tasks/:id, DELETE /tasks/:id, POST /signup, POST /login');

  if (config.isEphemeralJwtSecret) {
    console.warn(
      '\n[warning] JWT_SECRET is not set. A random secret was generated for this process only;',
    );
    console.warn('          existing JWTs will be invalid after a restart. Copy .env.example to .env to persist one.\n');
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
