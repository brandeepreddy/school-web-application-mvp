import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import type { Database } from '../types.js';
import { createSeedDatabase } from './seed.js';

const dbFileUrl = new URL('../../data/db.json', import.meta.url);

const ensureDatabaseFile = () => {
  const filePath = dbFileUrl.pathname;
  if (!existsSync(filePath)) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(createSeedDatabase(), null, 2));
  }
};

const readDb = (): Database => {
  ensureDatabaseFile();
  const raw = readFileSync(dbFileUrl, 'utf8');
  return JSON.parse(raw) as Database;
};

const writeDb = (db: Database) => {
  writeFileSync(dbFileUrl, JSON.stringify(db, null, 2));
};

export const store = {
  read(): Database {
    return readDb();
  },
  write(db: Database) {
    writeDb(db);
  },
  transact<T>(callback: (db: Database, helpers: { nextId: <K extends keyof Database>(collection: K) => number }) => T): T {
    const db = readDb();
    const result = callback(db, {
      nextId: <K extends keyof Database>(collection: K) => {
        const items = db[collection];
        if (!Array.isArray(items)) {
          throw new Error(`Collection ${String(collection)} does not support nextId`);
        }
        return items.reduce((max, item) => {
          const value = typeof item === 'object' && item !== null && 'id' in item ? Number(item.id) : 0;
          return Math.max(max, value);
        }, 0) + 1;
      },
    });
    writeDb(db);
    return result;
  },
  reset() {
    writeDb(createSeedDatabase());
  },
};
