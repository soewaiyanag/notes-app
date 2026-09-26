import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DesktopTopBar from '@/components/layout/DesktopTopBar'
import NoteItem from './NoteItem'
import NoteEditor, { type NoteDraft } from './NoteEditor'
import NoteActions from './NoteActions'
import ConfirmActionModal from './ConfirmActionModal'
import { useNotes } from '@/context/NotesContext'
import { useToast } from '@/context/ToastContext'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { parseTags } from '@/lib/parseTags'
import type { Note } from '@/lib/types'

interface NotesScreenProps {
  title: ReactNode
  mobileTitle?: ReactNode
  notes: Note[]
  isLoading: boolean
  emptyMessage: ReactNode
  description?: ReactNode
  mobileDescription?: ReactNode
  showCreateButton?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
}

const EMPTY_DRAFT: NoteDraft = { title: '', tags: '', content: '' }

export default function NotesScreen({
  title,
  mobileTitle,
  notes,
  isLoading,
  emptyMessage,
  description,
  mobileDescription,
  showCreateButton = true,
  searchValue,
  onSearchChange,
}: NotesScreenProps) {
  const navigate = useNavigate()
  const { createNote, updateNote, deleteNote, toggleArchive } = useNotes()
  const { showToast } = useToast()
  const isDesktop = useIsDesktop()

  const [searchParams, setSearchParams] = useSearchParams()
  const [draft, setDraft] = useState<NoteDraft | null>(null)
  const [resetToken, setResetToken] = useState(0)
  const [confirmAction, setConfirmAction] = useState<'archive' | 'delete' | null>(null)

  const selectedId = searchParams.get('note')
  const selectedNote = notes.find((n) => String(n.id) === selectedId) ?? null

  // Desktop shows a note by default; mobile stays list-first until tapped.
  useEffect(() => {
    if (isDesktop && !draft && !selectedNote && notes.length > 0 && !isLoading) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('note', String(notes[0].id))
        return next
      })
    }
  }, [isDesktop, draft, selectedNote, notes, isLoading, setSearchParams])

  const selectNote = (id: number) => {
    setDraft(null)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('note', String(id))
      return next
    })
  }

  const clearSelection = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('note')
      return next
    })
  }

  const handleCreate = () => {
    setDraft(EMPTY_DRAFT)
    clearSelection()
  }

  const handleSave = async (form: NoteDraft) => {
    const tags = parseTags(form.tags)

    if (draft) {
      const note = await createNote({ title: form.title.trim(), content: form.content, tags })
      setDraft(null)
      selectNote(note.id)
    } else if (selectedNote) {
      await updateNote(selectedNote.id, { title: form.title.trim(), content: form.content, tags })
    }

    showToast('Note saved successfully!')
  }

  const handleCancel = () => {
    if (draft) {
      setDraft(null)
    } else {
      setResetToken((t) => t + 1)
    }
  }

  const handleBack = () => {
    setDraft(null)
    clearSelection()
  }

  const confirmArchive = async () => {
    if (!selectedNote) return
    const wasArchived = selectedNote.isArchived
    await toggleArchive(selectedNote.id)
    setConfirmAction(null)
    clearSelection()
    showToast(wasArchived ? 'Note restored.' : 'Note archived.', {
      label: wasArchived ? 'All Notes' : 'Archived Notes',
      onClick: () => navigate(wasArchived ? '/' : '/archived'),
    })
  }

  const confirmDelete = async () => {
    if (!selectedNote) return
    await deleteNote(selectedNote.id)
    setConfirmAction(null)
    clearSelection()
    showToast('Note permanently deleted.')
  }

  const isEditorOpen = draft !== null || selectedNote !== null
  const hasNotes = notes.length > 0

  return (
    <>
      {/* Desktop */}
      <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
        <DesktopTopBar title={title} searchValue={searchValue} onSearchChange={onSearchChange} />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-[290px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-neutral-200 pl-8 pr-4 py-5 dark:border-neutral-800">
            {showCreateButton && (
              <button
                onClick={handleCreate}
                className="w-full rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white"
              >
                + Create New Note
              </button>
            )}

            {description && (
              <p className="text-preset-5 text-neutral-700 dark:text-neutral-400">{description}</p>
            )}

            {!isLoading && !hasNotes && !draft && (
              <div className="rounded-lg bg-neutral-50 p-3 text-preset-5 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                {emptyMessage}
              </div>
            )}

            <div className="flex flex-col gap-1">
              {draft && <NoteItem title="Untitled Note" tags={[]} active />}
              {notes.map((note, i) => (
                <div key={note.id}>
                  <NoteItem
                    title={note.title}
                    tags={note.tags.map((t) => t.name)}
                    date={new Date(note.updatedAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                    active={!draft && String(note.id) === selectedId}
                    onClick={() => selectNote(note.id)}
                  />
                  {(i < notes.length - 1 || draft) && (
                    <div className="h-px w-full rounded-[20px] bg-neutral-200 dark:bg-neutral-800" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {isEditorOpen ? (
            <NoteEditor
              key={`${selectedNote?.id ?? 'draft'}-${resetToken}`}
              note={selectedNote}
              draft={draft}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <div className="flex-1 border-r border-neutral-200 dark:border-neutral-800" />
          )}

          {selectedNote ? (
            <NoteActions
              isArchived={selectedNote.isArchived}
              onArchive={() => setConfirmAction('archive')}
              onDelete={() => setConfirmAction('delete')}
            />
          ) : (
            <div className="hidden w-[258px] shrink-0 lg:block" />
          )}
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="lg:hidden">
        {isEditorOpen ? (
          <div className="min-h-[calc(100dvh-54px-60px)] bg-white dark:bg-neutral-950">
            <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
              <button onClick={handleBack} aria-label="Back">
                <img src="/images/icon-arrow-left.svg" alt="" className="size-5 dark:invert" />
              </button>
              <span className="text-preset-4 text-neutral-700 dark:text-neutral-400">{mobileTitle ?? title}</span>
            </div>
            <NoteEditor
              key={`${selectedNote?.id ?? 'draft'}-${resetToken}`}
              note={selectedNote}
              draft={draft}
              onSave={handleSave}
              onCancel={handleBack}
            />
          </div>
        ) : (
          <div className="relative min-h-[calc(100dvh-54px-60px)] rounded-t-lg bg-white px-4 py-5 dark:bg-neutral-950">
            <h1 className="text-preset-1 mb-4 text-neutral-950 dark:text-neutral-0">{mobileTitle ?? title}</h1>

            {onSearchChange && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                <img src="/images/icon-search.svg" alt="" className="size-5 shrink-0 dark:invert" />
                <input
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by title, content, or tags…"
                  className="w-full bg-transparent text-preset-5 text-neutral-950 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-100"
                />
              </div>
            )}

            {(mobileDescription ?? description) && (
              <p className="mb-4 text-preset-5 text-neutral-700 dark:text-neutral-400">
                {mobileDescription ?? description}
              </p>
            )}

            {!isLoading && !hasNotes && (
              <div className="rounded-lg bg-neutral-50 p-3 text-preset-5 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                {emptyMessage}
              </div>
            )}

            <div className="flex flex-col">
              {notes.map((note, i) => (
                <div key={note.id}>
                  <NoteItem
                    title={note.title}
                    tags={note.tags.map((t) => t.name)}
                    date={new Date(note.updatedAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                    onClick={() => selectNote(note.id)}
                  />
                  {i < notes.length - 1 && (
                    <div className="h-px w-full rounded-[20px] bg-neutral-200 dark:bg-neutral-800" />
                  )}
                </div>
              ))}
            </div>

            {showCreateButton && (
              <button
                aria-label="Create new note"
                onClick={handleCreate}
                className="fixed bottom-[76px] right-4 z-10 flex size-12 items-center justify-center rounded-full bg-blue-500 shadow-[0_7px_11px_0_rgb(202_207_216/0.7)]"
              >
                <img src="/images/icon-plus.svg" alt="" className="size-8" />
              </button>
            )}
          </div>
        )}
      </div>

      {selectedNote && confirmAction === 'archive' && (
        <ConfirmActionModal
          icon={selectedNote.isArchived ? '/images/icon-restore.svg' : '/images/icon-archive.svg'}
          title={selectedNote.isArchived ? 'Restore Note' : 'Archive Note'}
          description={
            selectedNote.isArchived
              ? 'Are you sure you want to restore this note back to your active notes?'
              : 'Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.'
          }
          confirmLabel={selectedNote.isArchived ? 'Restore Note' : 'Archive Note'}
          variant="primary"
          onConfirm={confirmArchive}
          onClose={() => setConfirmAction(null)}
        />
      )}

      {selectedNote && confirmAction === 'delete' && (
        <ConfirmActionModal
          icon="/images/icon-delete.svg"
          title="Delete Note"
          description="Are you sure you want to permanently delete this note? This action cannot be undone."
          confirmLabel="Delete Note"
          variant="danger"
          onConfirm={confirmDelete}
          onClose={() => setConfirmAction(null)}
        />
      )}
    </>
  )
}
