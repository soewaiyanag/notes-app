import { cn } from './cn'

export function inputClasses(hasError: boolean, className?: string): string {
  return cn(
    'w-full rounded-lg border bg-white px-4 py-3 text-preset-5 text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:bg-neutral-900 dark:text-neutral-100',
    hasError ? 'border-red-500' : 'border-neutral-300 focus:border-blue-500 dark:border-neutral-700',
    className,
  )
}
