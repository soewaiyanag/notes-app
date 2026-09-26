export default function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      <span className="text-preset-6 text-neutral-500">{label}</span>
      <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
    </div>
  )
}
