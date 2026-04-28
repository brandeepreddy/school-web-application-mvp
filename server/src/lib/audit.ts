import type { Database } from '../types.js';

export const recordAudit = (
  db: Database,
  actorId: number,
  action: string,
  entityType: string,
  entityId: number,
  details: Record<string, unknown> = {},
) => {
  const nextId = db.auditLogs.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  db.auditLogs.unshift({
    id: nextId,
    actorId,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    details,
  });
};
