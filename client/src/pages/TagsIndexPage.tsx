import { Link } from 'react-router-dom'
import { useNotes } from '@/context/NotesContext'

export default function TagsIndexPage() {
  const { tags } = useNotes()

  return (
    <div className="min-h-[calc(100dvh-54px-60px)] rounded-t-lg bg-white px-4 py-5 dark:bg-neutral-950 lg:min-h-0 lg:flex-1 lg:rounded-none lg:p-8">
      <h1 className="text-preset-1 mb-4 text-neutral-950 dark:text-neutral-0">Tags</h1>

      {tags.length === 0 ? (
        <p className="text-preset-5 text-neutral-700 dark:text-neutral-400">
          Tags you add to notes will show up here.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/tags/${encodeURIComponent(tag.name)}`}
              className="flex items-center gap-2 rounded-lg px-3 py-[10px] text-preset-4 text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              <img src="/images/icon-tag.svg" alt="" className="size-5 dark:invert" />
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
