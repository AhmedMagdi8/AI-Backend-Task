import crypto from 'crypto';

// Generates a unique ID for every incoming request
export function requestIdMiddleware(req, _res, next) {
  try {
    const id = crypto.randomUUID();
    req.requestId = id;
    _res.setHeader('X-Request-ID', id);
  } catch (err) {
    const fallback = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    req.requestId = fallback;
  }
  next();
}
