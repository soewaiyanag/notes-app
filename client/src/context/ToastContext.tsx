import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastItem {
  id: number
  message: string
  action?: ToastAction
}

interface ToastContextValue {
  showToast: (message: string, action?: ToastAction) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, action?: ToastAction) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, action }])
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed inset-x-4 bottom-[76px] z-50 flex flex-col items-end gap-2 lg:inset-x-auto lg:bottom-6 lg:right-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-md dark:border-neutral-800 dark:bg-neutral-900 lg:w-auto"
          >
            <img src="/images/icon-toast-success.svg" alt="" className="size-5 shrink-0" />
            <p className="text-preset-5 text-neutral-950 dark:text-neutral-100">{toast.message}</p>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick()
                  dismiss(toast.id)
                }}
                className="text-preset-4 text-blue-500 underline-offset-2 hover:underline"
              >
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="ml-1 shrink-0 opacity-50 hover:opacity-100"
            >
              <img src="/images/icon-cross.svg" alt="" className="size-4 dark:invert" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- co-locating the hook keeps context + accessor together
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
