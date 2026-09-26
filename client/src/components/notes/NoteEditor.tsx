import { useEffect, useState } from 'react'
import type { Note } from '@/lib/types'

export interface NoteDraft {
  title: string
  tags: string
  content: string
}

interface NoteEditorProps {
  note: Note | null
  draft: NoteDraft | null
  onSave: (draft: NoteDraft) => Promise<void>
  onCancel: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toDraft(note: Note | null): NoteDraft {
  if (!note) return { title: '', tags: '', content: '' }
  return { title: note.title, tags: note.tags.map((t) => t.name).join(', '), content: note.content }
}

export default function NoteEditor({ note, draft, onSave, onCancel }: NoteEditorProps) {
  const [form, setForm] = useState<NoteDraft>(draft ?? toDraft(note))
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setForm(draft ?? toDraft(note))
  }, [note, draft])

  const canSave = form.title.trim().length > 0 && !isSaving

  const handleSave = async () => {
    if (!canSave) return
    setIsSaving(true)
    try {
      await onSave(form)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto border-r border-neutral-200 px-6 py-5 dark:border-neutral-800">
      {/* Title */}
      <input
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Enter a title..."
        className="text-preset-1 w-full bg-transparent text-neutral-950 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-0"
      />

      {/* Properties */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex w-[115px] shrink-0 items-center gap-[6px] py-1">
            <img src="/images/icon-tag.svg" alt="" className="size-4 dark:invert" />
            <span className="text-preset-5 text-neutral-700 dark:text-neutral-400">Tags</span>
          </div>
          <input
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="Add tags separated by commas (e.g. Work, Planning)"
            className="w-full rounded-md bg-transparent py-1 text-preset-5 text-neutral-950 placeholder:text-neutral-400 focus:border focus:border-neutral-300 focus:px-2 focus:outline-none dark:text-neutral-100 dark:focus:border-neutral-700"
          />
        </div>

        {note?.isArchived && (
          <div className="flex items-center gap-2">
            <div className="flex w-[115px] shrink-0 items-center gap-[6px] py-1">
              <img src="/images/icon-status.svg" alt="" className="size-4 dark:invert" />
              <span className="text-preset-5 text-neutral-700 dark:text-neutral-400">Status</span>
            </div>
            <span className="text-preset-5 text-neutral-950 dark:text-neutral-100">Archived</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex w-[115px] shrink-0 items-center gap-[6px] py-1">
            <img src="/images/icon-clock.svg" alt="" className="size-4 dark:invert" />
            <span className="text-preset-5 text-neutral-700 dark:text-neutral-400">Last edited</span>
          </div>
          <span className="text-preset-5 text-neutral-700 dark:text-neutral-400">
            {note ? formatDate(note.updatedAt) : 'Not yet saved'}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* Body */}
      <textarea
        value={form.content}
        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        placeholder="Start typing your note here…"
        className="min-h-[200px] flex-1 resize-none bg-transparent text-preset-5 leading-[1.3] text-neutral-800 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200"
      />

      {/* Divider */}
      <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white disabled:opacity-50"
        >
          Save Note
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg bg-neutral-100 px-4 py-3 text-preset-4 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
