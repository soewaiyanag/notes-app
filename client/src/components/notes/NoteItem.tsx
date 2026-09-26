import { cn } from '@/lib/cn'

interface NoteItemProps {
  title: string
  tags: string[]
  date?: string
  active?: boolean
  onClick?: () => void
}

export default function NoteItem({ title, tags, date, active, onClick }: NoteItemProps) {
  return (
    <article
      onClick={onClick}
      className={cn(
        'flex cursor-pointer flex-col gap-3 rounded-[6px] p-2 transition-colors',
        active ? 'bg-neutral-100 dark:bg-neutral-900' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/60',
      )}
    >
      <p className="text-preset-3 text-neutral-950 dark:text-neutral-0">{title || 'Untitled Note'}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[4px] bg-neutral-200 px-[6px] py-[2px] text-preset-6 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {date && <p className="text-preset-6 text-neutral-700 dark:text-neutral-500">{date}</p>}
    </article>
  )
}
