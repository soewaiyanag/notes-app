import { z } from 'zod';

const idParam = z.object({
  params: z.object({ id: z.string() }),
});

const list = z.object({
  query: z.object({
    archived: z.enum(['true', 'false']).optional(),
    tag: z.string().optional(),
    q: z.string().optional(),
  }),
});

const create = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    content: z.string(),
    tags: z.array(z.string().min(1).max(50)).optional(),
  }),
});

const update = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().optional(),
    tags: z.array(z.string().min(1).max(50)).optional(),
  }),
});

export const noteSchemas = { idParam, list, create, update };

export type CreateNoteBody = z.infer<typeof create>['body'];
export type UpdateNoteBody = z.infer<typeof update>['body'];
export type NoteListQuery = z.infer<typeof list>['query'];
export type NoteIdParam = z.infer<typeof idParam>['params'];
