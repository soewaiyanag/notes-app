import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { preferencesApi } from '@/lib/endpoints';
import { useAuth } from './AuthContext';
import type { FontTheme, ThemePreference } from '@/lib/types';

interface PreferencesContextValue {
  theme: ThemePreference;
  fontTheme: FontTheme;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setFontTheme: (fontTheme: FontTheme) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function resolveEffectiveTheme(theme: ThemePreference): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<ThemePreference>('light');
  const [fontTheme, setFontThemeState] = useState<FontTheme>('sans');

  useEffect(() => {
    if (!user) return;
    preferencesApi.get().then((prefs) => {
      setThemeState(prefs.theme);
      setFontThemeState(prefs.fontTheme);
    });
  }, [user]);

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = resolveEffectiveTheme(theme);
    };
    apply();

    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.fontTheme = fontTheme === 'sans' ? '' : fontTheme;
  }, [fontTheme]);

  const setTheme = async (next: ThemePreference) => {
    setThemeState(next);
    await preferencesApi.update({ theme: next });
  };

  const setFontTheme = async (next: FontTheme) => {
    setFontThemeState(next);
    await preferencesApi.update({ fontTheme: next });
  };

  return (
    <PreferencesContext.Provider value={{ theme, fontTheme, setTheme, setFontTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- co-locating the hook keeps context + accessor together
export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider');
  return ctx;
}
