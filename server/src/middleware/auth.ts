import type { NextFunction, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { verifyAccessToken } from '../lib/auth.js';
import { AppError } from '../lib/errors.js';
import { getAuthenticatedUserFromDb } from '../lib/selectors.js';
import type { Role } from '../types.js';

const extractBearerToken = (request: Request) => {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  return authorization.slice('Bearer '.length).trim();
};

export const authenticate = (request: Request, _response: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(request);
    if (!token) {
      throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
    }

    const payload = verifyAccessToken(token);
    const user = getAuthenticatedUserFromDb(store.read(), payload.sub);
    if (!user) {
      throw new AppError(401, 'User no longer exists', 'USER_NOT_FOUND');
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: Role[]) => (request: Request, _response: Response, next: NextFunction) => {
  try {
    if (!request.user) {
      throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
    }
    if (!roles.includes(request.user.role)) {
      throw new AppError(403, 'Insufficient permissions', 'FORBIDDEN');
    }
    next();
  } catch (error) {
    next(error);
  }
};
