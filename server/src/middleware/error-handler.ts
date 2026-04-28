import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

export const notFoundHandler = (_request: Request, response: Response) => {
  response.status(404).json({
    message: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
  });
};

export const errorHandler = (error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: error.flatten(),
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }

  console.error(error);
  return response.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
