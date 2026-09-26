export default function PageHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-10 flex h-[54px] items-center gap-[10px] bg-neutral-100 px-4 py-3 dark:bg-neutral-900">
      <img src="/images/logo.svg" alt="" className="size-7" />
      <span className="font-pacifico text-[23px] leading-none tracking-[-0.46px] text-neutral-950 dark:text-neutral-0">
        Notes
      </span>
    </header>
  )
}
