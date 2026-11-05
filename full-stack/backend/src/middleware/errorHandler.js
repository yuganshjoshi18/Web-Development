/**
 * 404 fallback for unknown endpoints.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
}

/**
 * Centralised error handler. Converts malformed JSON into a clean 400 and
 * keeps all other errors in JSON format.
 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

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
  });
}
