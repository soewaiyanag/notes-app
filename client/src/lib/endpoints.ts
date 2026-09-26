import { apiFetch, setAccessToken } from './api';
import type { Note, Tag, User, UserPreferences, ThemePreference, FontTheme } from './types';

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  async register(email: string, password: string): Promise<User> {
    const res = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { email, password },
    });
    setAccessToken(res.accessToken);
    return res.user;
  },

  async login(email: string, password: string): Promise<User> {
    const res = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setAccessToken(res.accessToken);
    return res.user;
  },

  async refresh(): Promise<string> {
    const res = await apiFetch<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      skipAuthRetry: true,
    });
    setAccessToken(res.accessToken);
    return res.accessToken;
  },

  me(): Promise<User> {
    return apiFetch('/auth/me');
  },

  async logout(): Promise<void> {
    await apiFetch('/auth/logout', { method: 'POST' });
    setAccessToken(null);
  },

  forgotPassword(email: string): Promise<{ message: string }> {
    return apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
  },

  resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiFetch('/auth/reset-password', { method: 'POST', body: { token, password } });
  },

  changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiFetch('/auth/password', { method: 'PATCH', body: { currentPassword, newPassword } });
  },
};

export interface NoteListParams {
  archived?: boolean;
  tag?: string;
  q?: string;
}

function toQueryString(params: NoteListParams): string {
  const search = new URLSearchParams();
  if (params.archived !== undefined) search.set('archived', String(params.archived));
  if (params.tag) search.set('tag', params.tag);
  if (params.q) search.set('q', params.q);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export interface NoteInput {
  title: string;
  content: string;
  tags?: string[];
}

export const notesApi = {
  list(params: NoteListParams = {}): Promise<Note[]> {
    return apiFetch(`/notes${toQueryString(params)}`);
  },

  get(id: number): Promise<Note> {
    return apiFetch(`/notes/${id}`);
  },

  create(input: NoteInput): Promise<Note> {
    return apiFetch('/notes', { method: 'POST', body: input });
  },

  update(id: number, input: Partial<NoteInput>): Promise<Note> {
    return apiFetch(`/notes/${id}`, { method: 'PATCH', body: input });
  },

  delete(id: number): Promise<void> {
    return apiFetch(`/notes/${id}`, { method: 'DELETE' });
  },

  toggleArchive(id: number): Promise<Note> {
    return apiFetch(`/notes/${id}/archive`, { method: 'PATCH' });
  },
};

export const tagsApi = {
  list(): Promise<Tag[]> {
    return apiFetch('/tags');
  },
};

export const preferencesApi = {
  get(): Promise<UserPreferences> {
    return apiFetch('/preferences');
  },

  update(data: Partial<{ theme: ThemePreference; fontTheme: FontTheme }>): Promise<UserPreferences> {
    return apiFetch('/preferences', { method: 'PATCH', body: data });
  },
};
