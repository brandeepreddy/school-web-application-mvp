import { compareSync, hashSync } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { getRefreshExpiryDate, signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/auth.js';
import { recordAudit } from '../lib/audit.js';
import { AppError } from '../lib/errors.js';
import { buildSessionUser } from '../lib/selectors.js';
import { store } from '../lib/store.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts, please try again later.',
    code: 'TOO_MANY_LOGIN_ATTEMPTS',
  },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'student']),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'student']).optional(),
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(10),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

router.post('/login', loginRateLimiter, (request, response, next) => {
  try {
    const { email, password, role } = loginSchema.parse(request.body);
    const db = store.read();
    const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.role === role);

    if (!user || !compareSync(password, user.passwordHash)) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    store.transact((mutableDb, helpers) => {
      mutableDb.refreshTokens = mutableDb.refreshTokens.filter((item) => item.userId !== user.id);
      mutableDb.refreshTokens.push({
        id: helpers.nextId('refreshTokens'),
        userId: user.id,
        token: refreshToken,
        expiresAt: getRefreshExpiryDate(),
        createdAt: new Date().toISOString(),
      });
      recordAudit(mutableDb, user.id, 'auth.login', 'user', user.id, { role: user.role });
    });

    response.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: buildSessionUser(store.read(), user.id),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', (request, response, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(request.body);
    const payload = verifyRefreshToken(refreshToken);
    const db = store.read();
    const tokenRecord = db.refreshTokens.find((item) => item.token === refreshToken && item.userId === payload.sub);

    if (!tokenRecord || new Date(tokenRecord.expiresAt).getTime() < Date.now()) {
      throw new AppError(401, 'Refresh token is invalid or expired', 'INVALID_REFRESH_TOKEN');
    }

    const user = db.users.find((item) => item.id === payload.sub);
    if (!user) {
      throw new AppError(401, 'User no longer exists', 'USER_NOT_FOUND');
    }

    const nextAccessToken = signAccessToken(user);
    const nextRefreshToken = signRefreshToken(user);

    store.transact((mutableDb, helpers) => {
      mutableDb.refreshTokens = mutableDb.refreshTokens.filter((item) => item.token !== refreshToken);
      mutableDb.refreshTokens.push({
        id: helpers.nextId('refreshTokens'),
        userId: user.id,
        token: nextRefreshToken,
        expiresAt: getRefreshExpiryDate(),
        createdAt: new Date().toISOString(),
      });
      recordAudit(mutableDb, user.id, 'auth.refresh', 'user', user.id);
    });

    response.json({
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      user: buildSessionUser(store.read(), user.id),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (request, response, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(request.body);
    const db = store.read();
    const existing = db.refreshTokens.find((item) => item.token === refreshToken);

    store.transact((mutableDb) => {
      mutableDb.refreshTokens = mutableDb.refreshTokens.filter((item) => item.token !== refreshToken);
      if (existing) {
        recordAudit(mutableDb, existing.userId, 'auth.logout', 'user', existing.userId);
      }
    });

    response.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', (request, response, next) => {
  try {
    const { email, role } = forgotPasswordSchema.parse(request.body);
    const db = store.read();
    const user = db.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && (!role || item.role === role),
    );

    if (!user) {
      response.json({ message: 'If an account exists, a reset link has been generated.' });
      return;
    }

    const token = randomUUID().replace(/-/g, '');

    store.transact((mutableDb, helpers) => {
      mutableDb.passwordResets = mutableDb.passwordResets.filter((item) => item.userId !== user.id);
      mutableDb.passwordResets.push({
        id: helpers.nextId('passwordResets'),
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        createdAt: new Date().toISOString(),
      });
      recordAudit(mutableDb, user.id, 'auth.request_password_reset', 'user', user.id);
    });

    response.json({
      message: 'Password reset link generated for local development.',
      resetToken: token,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', (request, response, next) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(request.body);
    const db = store.read();
    const resetRecord = db.passwordResets.find((item) => item.token === token);

    if (!resetRecord || new Date(resetRecord.expiresAt).getTime() < Date.now()) {
      throw new AppError(400, 'Reset token is invalid or expired', 'INVALID_RESET_TOKEN');
    }

    const user = db.users.find((item) => item.id === resetRecord.userId);
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    store.transact((mutableDb) => {
      const mutableUser = mutableDb.users.find((item) => item.id === user.id);
      if (mutableUser) {
        mutableUser.passwordHash = hashSync(newPassword, 10);
        mutableUser.updatedAt = new Date().toISOString();
      }
      mutableDb.passwordResets = mutableDb.passwordResets.filter((item) => item.token !== token);
      mutableDb.refreshTokens = mutableDb.refreshTokens.filter((item) => item.userId !== user.id);
      recordAudit(mutableDb, user.id, 'auth.reset_password', 'user', user.id);
    });

    response.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, (request, response) => {
  response.json({ user: buildSessionUser(store.read(), request.user!.id) });
});

export default router;
