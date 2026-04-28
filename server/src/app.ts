import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import authRouter from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get('/api/health', (_request, response) => {
    response.json({
      status: 'ok',
      app: 'school-web-application-mvp-server',
      time: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
