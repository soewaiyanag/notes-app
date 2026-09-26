import { z } from 'zod';

const credentials = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const resetPassword = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const changePassword = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const authSchemas = {
  register: credentials,
  login: credentials,
  forgotPassword,
  resetPassword,
  changePassword,
};

export type LoginBody = z.infer<typeof credentials>['body'];
export type ForgotPasswordBody = z.infer<typeof forgotPassword>['body'];
export type ResetPasswordBody = z.infer<typeof resetPassword>['body'];
export type ChangePasswordBody = z.infer<typeof changePassword>['body'];
