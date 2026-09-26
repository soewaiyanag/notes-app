export default function GoogleButton() {
  return (
    <button
      type="button"
      disabled
      aria-disabled
      title="Google sign-in isn't wired up in this project"
      className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-preset-4 text-neutral-950 opacity-60 dark:border-neutral-700 dark:text-neutral-0"
    >
      <img src="/images/icon-google.svg" alt="" className="size-5" />
      Google
    </button>
  )
}
