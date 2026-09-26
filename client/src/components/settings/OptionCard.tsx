import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

interface OptionCardProps {
  icon: ReactNode
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

export default function OptionCard({ icon, title, description, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors',
        selected
          ? 'border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900'
          : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/60',
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-preset-4 dark:border-neutral-700 dark:bg-neutral-950">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-preset-4 text-neutral-950 dark:text-neutral-0">{title}</p>
        <p className="text-preset-6 text-neutral-600 dark:text-neutral-400">{description}</p>
      </div>
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
          selected ? 'border-blue-500' : 'border-neutral-300 dark:border-neutral-700',
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-blue-500" />}
      </span>
    </button>
  )
}
