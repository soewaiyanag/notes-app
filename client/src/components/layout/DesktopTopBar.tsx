import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface DesktopTopBarProps {
  title: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export default function DesktopTopBar({ title, searchValue, onSearchChange }: DesktopTopBarProps) {
  const navigate = useNavigate()
  const isSearchable = onSearchChange !== undefined

  return (
    <header className="hidden h-[81px] shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-8 dark:border-neutral-800 dark:bg-neutral-950 lg:flex">
      <h1 className="text-preset-1 text-neutral-950 dark:text-neutral-0">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        {isSearchable ? (
          <div className="flex w-[300px] items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 shadow-[0_1px_2px_0_rgb(10_13_20/0.03)] dark:border-neutral-800 dark:bg-neutral-900">
            <img src="/images/icon-search.svg" alt="" className="size-5 shrink-0 dark:invert" />
            <input
              autoFocus
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, content, or tags…"
              className="w-full bg-transparent text-preset-5 text-neutral-950 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-100"
            />
          </div>
        ) : (
          <button
            onClick={() => navigate('/search')}
            className="flex w-[300px] items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-left shadow-[0_1px_2px_0_rgb(10_13_20/0.03)] dark:border-neutral-800 dark:bg-neutral-900"
          >
            <img src="/images/icon-search.svg" alt="" className="size-5 shrink-0 dark:invert" />
            <span className="text-preset-5 text-neutral-500">
              Search by title, content, or tags…
            </span>
          </button>
        )}

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          aria-label="Settings"
          className="flex size-[42px] items-center justify-center rounded-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <img src="/images/icon-settings.svg" alt="" className="size-6 dark:invert" />
        </button>
      </div>
    </header>
  )
}
