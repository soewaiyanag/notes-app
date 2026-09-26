import { useParams } from 'react-router-dom'
import NotesScreen from '@/components/notes/NotesScreen'
import { useNoteList } from '@/hooks/useNoteList'

export default function TagPage() {
  const { tag = '' } = useParams<{ tag: string }>()
  const { notes, isLoading } = useNoteList({ archived: false, tag })

  return (
    <NotesScreen
      title={`Notes Tagged: ${tag}`}
      notes={notes}
      isLoading={isLoading}
      description={`All notes with the "${tag}" tag are shown here.`}
      emptyMessage={`No notes with the "${tag}" tag yet.`}
    />
  )
}
