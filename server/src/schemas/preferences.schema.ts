import { z } from 'zod';

const update = z.object({
  body: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    fontTheme: z.enum(['sans', 'serif', 'mono']).optional(),
  }),
});

export const preferencesSchemas = { update };

export type UpdatePreferencesBody = z.infer<typeof update>['body'];
