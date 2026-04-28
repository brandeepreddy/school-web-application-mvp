import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config.js';
import { AppError } from './errors.js';
import type { AuthenticatedUser, Role } from '../types.js';

interface BaseTokenPayload {
  sub: number;
  role: Role;
}

export interface AccessTokenPayload extends BaseTokenPayload {
  type: 'access';
}

export interface RefreshTokenPayload extends BaseTokenPayload {
  type: 'refresh';
}

const parseDurationToMs = (value: string) => {
  const match = value.trim().match(/^(\d+)([mhd])$/i);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multiplier = unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000;
  return amount * multiplier;
};

const sign = (payload: AccessTokenPayload | RefreshTokenPayload, secret: string, expiresIn: string) =>
  jwt.sign(payload, secret, { expiresIn: expiresIn as SignOptions['expiresIn'] });

export const signAccessToken = (user: Pick<AuthenticatedUser, 'id' | 'role'>) =>
  sign({ sub: user.id, role: user.role, type: 'access' }, config.jwtAccessSecret, config.accessTokenTtl);

export const signRefreshToken = (user: Pick<AuthenticatedUser, 'id' | 'role'>) =>
  sign({ sub: user.id, role: user.role, type: 'refresh' }, config.jwtRefreshSecret, config.refreshTokenTtl);

const verify = <T>(token: string, secret: string, expectedType: 'access' | 'refresh'): T => {
  try {
    const decoded = jwt.verify(token, secret) as T & { type?: string };
    if (decoded.type !== expectedType) {
      throw new AppError(401, 'Invalid token type', 'INVALID_TOKEN_TYPE');
    }
    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }
};

export const verifyAccessToken = (token: string) => verify<AccessTokenPayload>(token, config.jwtAccessSecret, 'access');
export const verifyRefreshToken = (token: string) => verify<RefreshTokenPayload>(token, config.jwtRefreshSecret, 'refresh');
export const getRefreshExpiryDate = () => new Date(Date.now() + parseDurationToMs(config.refreshTokenTtl)).toISOString();
