export interface User {
  id: number;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export type ThemePreference = 'light' | 'dark' | 'system';
export type FontTheme = 'sans' | 'serif' | 'mono';

export interface UserPreferences {
  id: number;
  userId: number;
  theme: ThemePreference;
  fontTheme: FontTheme;
}
