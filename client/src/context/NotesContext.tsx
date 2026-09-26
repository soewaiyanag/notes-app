import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { notesApi, tagsApi, type NoteInput } from '@/lib/endpoints';
import { useAuth } from './AuthContext';
import type { Note, Tag } from '@/lib/types';

interface NotesContextValue {
  tags: Tag[];
  version: number;
  createNote: (input: NoteInput) => Promise<Note>;
  updateNote: (id: number, input: Partial<NoteInput>) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  toggleArchive: (id: number) => Promise<Note>;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [version, setVersion] = useState(0);

  const refreshTags = useCallback(() => {
    tagsApi.list().then(setTags);
  }, []);

  useEffect(() => {
    if (user) refreshTags();
  }, [user, refreshTags]);

  const bump = () => setVersion((v) => v + 1);

  const createNote = async (input: NoteInput) => {
    const note = await notesApi.create(input);
    refreshTags();
    bump();
    return note;
  };

  const updateNote = async (id: number, input: Partial<NoteInput>) => {
    const note = await notesApi.update(id, input);
    refreshTags();
    bump();
    return note;
  };

  const deleteNote = async (id: number) => {
    await notesApi.delete(id);
    refreshTags();
    bump();
  };

  const toggleArchive = async (id: number) => {
    const note = await notesApi.toggleArchive(id);
    bump();
    return note;
  };

  return (
    <NotesContext.Provider
      value={{ tags: user ? tags : [], version, createNote, updateNote, deleteNote, toggleArchive }}
    >
      {children}
    </NotesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- co-locating the hook keeps context + accessor together
export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within a NotesProvider');
  return ctx;
}
