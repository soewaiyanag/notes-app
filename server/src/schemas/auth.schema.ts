import { z } from 'zod';

const credentials = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const authSchemas = {
  register: credentials,
  login: credentials,
};

export type LoginBody = z.infer<typeof credentials>['body'];
