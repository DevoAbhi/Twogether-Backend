import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

// Shared private access code. Sent as a header, or as ?code= for <img> tags.
export function requireAccessCode(req, res, next) {
  const code = req.get('x-access-code') || req.query.code;
  if (code !== env.accessCode) {
    return next(new HttpError(401, 'Wrong access code'));
  }
  next();
}
