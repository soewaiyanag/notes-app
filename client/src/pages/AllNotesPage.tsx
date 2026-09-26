import NotesScreen from '@/components/notes/NotesScreen'
import { useNoteList } from '@/hooks/useNoteList'

export default function AllNotesPage() {
  const { notes, isLoading } = useNoteList({ archived: false })

  return (
    <NotesScreen
      title="All Notes"
      notes={notes}
      isLoading={isLoading}
      emptyMessage="You don't have any notes yet. Start a new note to capture your thoughts and ideas."
    />
  )
}
