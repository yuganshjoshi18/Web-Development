/**
 * Small error type that controllers can throw when they need a specific status.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * 404 fallback for unknown endpoints.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    hint: 'Check the API documentation for available endpoints.',
  });
}

/**
 * Centralised error handler.
 *
 * - Turns malformed JSON bodies into a 400 response.
 * - Uses an explicit status when present, otherwise falls back to 500.
 * - Returns JSON for every failure so clients never receive an HTML error page.
 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // body-parser raises this when express.json() cannot parse the payload.
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400)) {
    return res.status(400).json({
      error: 'Invalid JSON payload',
      hint: 'Make sure the request body is valid JSON and the Content-Type header is application/json.',
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  return res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal server error' : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
}
