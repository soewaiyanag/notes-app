interface NoteActionsProps {
  isArchived: boolean
  onArchive: () => void
  onDelete: () => void
}

export default function NoteActions({ isArchived, onArchive, onDelete }: NoteActionsProps) {
  return (
    <div className="hidden w-[258px] shrink-0 flex-col gap-3 px-4 py-5 lg:flex">
      <button
        onClick={onArchive}
        className="flex w-full items-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-preset-4 text-neutral-950 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-0 dark:hover:bg-neutral-900"
      >
        <img src={isArchived ? '/images/icon-restore.svg' : '/images/icon-archive.svg'} alt="" className="size-5 dark:invert" />
        {isArchived ? 'Restore Note' : 'Archive Note'}
      </button>
      <button
        onClick={onDelete}
        className="flex w-full items-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-preset-4 text-neutral-950 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-0 dark:hover:bg-neutral-900"
      >
        <img src="/images/icon-delete.svg" alt="" className="size-5 dark:invert" />
        Delete Note
      </button>
    </div>
  )
}
