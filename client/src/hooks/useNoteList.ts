import { useEffect, useState } from 'react';
import { notesApi, type NoteListParams } from '@/lib/endpoints';
import { useNotes } from '@/context/NotesContext';
import type { Note } from '@/lib/types';

export function useNoteList(params: NoteListParams, enabled = true) {
  const { version } = useNotes();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);

  const key = JSON.stringify(params);

  useEffect(() => {
    if (!enabled) {
      setNotes([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    notesApi.list(params).then((result) => {
      if (!cancelled) {
        setNotes(result);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version, enabled]);

  return { notes, isLoading };
}
