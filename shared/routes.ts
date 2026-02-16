import { z } from 'zod';
import { insertSessionSchema, insertSharedItemSchema, sessions, sharedItems, WS_EVENTS } from './schema';

export { WS_EVENTS };

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  sessions: {
    create: {
      method: 'POST' as const,
      path: '/api/sessions' as const,
      responses: {
        201: z.custom<typeof sessions.$inferSelect>(),
        500: errorSchemas.internal,
      },
    },
    getByCode: {
      method: 'GET' as const,
      path: '/api/sessions/:code' as const,
      responses: {
        200: z.custom<typeof sessions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getItems: {
      method: 'GET' as const,
      path: '/api/sessions/:code/items' as const,
      responses: {
        200: z.array(z.custom<typeof sharedItems.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
    addItem: {
      method: 'POST' as const,
      path: '/api/sessions/:code/items' as const,
      input: insertSharedItemSchema.omit({ sessionId: true }), // Session ID inferred from code
      responses: {
        201: z.custom<typeof sharedItems.$inferSelect>(),
        404: errorSchemas.notFound,
        400: errorSchemas.validation,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type CreateSessionResponse = z.infer<typeof api.sessions.create.responses[201]>;
export type SessionItemsResponse = z.infer<typeof api.sessions.getItems.responses[200]>;
export type AddItemInput = z.infer<typeof api.sessions.addItem.input>;
