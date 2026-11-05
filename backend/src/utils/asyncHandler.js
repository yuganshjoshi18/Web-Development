/**
 * Wraps async controllers so rejected promises reach the central error handler.
 * Express 5 forwards these automatically, but the wrapper keeps the code
 * compatible with Express 4 as well.
 */
export function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
