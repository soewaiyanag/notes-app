import { useSearchParams } from 'react-router-dom'
import NotesScreen from '@/components/notes/NotesScreen'
import { useNoteList } from '@/hooks/useNoteList'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const { notes, isLoading } = useNoteList({ q: q.trim() }, q.trim().length > 0)

  const setQuery = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set('q', value)
      else next.delete('q')
      next.delete('note')
      return next
    })
  }

  const title = q ? (
    <>
      Showing results for: <span className="font-bold">{q}</span>
    </>
  ) : (
    'Search'
  )

  return (
    <NotesScreen
      title={title}
      mobileTitle="Search"
      notes={notes}
      isLoading={isLoading}
      searchValue={q}
      onSearchChange={setQuery}
      mobileDescription={q.trim() ? `All notes matching "${q}" are displayed below.` : undefined}
      emptyMessage={
        q.trim() ? (
          <>No notes match your search. Try a different keyword or create a new note.</>
        ) : (
          'Start typing to search your notes by title, content, or tags.'
        )
      }
    />
  )
}
