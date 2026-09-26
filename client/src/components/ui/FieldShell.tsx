import type { ReactNode } from 'react'

export interface FieldAction {
  label: string
  onClick: () => void
}

interface FieldShellProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  action?: FieldAction
  children: ReactNode
}

export default function FieldShell({ label, htmlFor, error, hint, action, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-preset-4 text-neutral-950 dark:text-neutral-0">
          {label}
        </label>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-preset-6 text-neutral-600 underline hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {action.label}
          </button>
        )}
      </div>

      {children}

      {error && (
        <p className="flex items-center gap-1 text-preset-6 text-red-500">
          <img src="/images/icon-info-error.svg" alt="" className="size-4" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="flex items-center gap-1 text-preset-6 text-neutral-500">
          <img src="/images/icon-info.svg" alt="" className="size-4 opacity-60 dark:invert" />
          {hint}
        </p>
      )}
    </div>
  )
}
