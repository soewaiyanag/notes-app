import NotesScreen from '@/components/notes/NotesScreen'
import { useNoteList } from '@/hooks/useNoteList'

export default function ArchivedNotesPage() {
  const { notes, isLoading } = useNoteList({ archived: true })

  return (
    <NotesScreen
      title="Archived Notes"
      notes={notes}
      isLoading={isLoading}
      description="All your archived notes are stored here. You can restore or delete them anytime."
      emptyMessage="No notes have been archived yet. Move notes here for safekeeping, or create a new note."
    />
  )
}
