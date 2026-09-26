import type { ReactNode } from 'react'

interface AuthLayoutProps {
  heading: string
  subheading: string
  children: ReactNode
}

export default function AuthLayout({ heading, subheading, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-100 px-4 py-12 dark:bg-neutral-800">
      <div className="w-full max-w-[540px] rounded-xl bg-white p-6 shadow-md dark:bg-neutral-900 sm:p-12">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-[10px]">
            <img src="/images/logo.svg" alt="" className="size-7" />
            <span className="font-pacifico text-[23px] leading-none tracking-[-0.46px] text-neutral-950 dark:text-neutral-0">
              Notes
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-preset-2 text-neutral-950 dark:text-neutral-0">{heading}</h1>
            <p className="text-preset-5 text-neutral-700 dark:text-neutral-400">{subheading}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
