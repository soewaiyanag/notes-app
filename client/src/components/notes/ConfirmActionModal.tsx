import { cn } from '@/lib/cn'
import Modal from '@/components/ui/Modal'

interface ConfirmActionModalProps {
  icon: string
  title: string
  description: string
  confirmLabel: string
  variant: 'danger' | 'primary'
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmActionModal({
  icon,
  title,
  description,
  confirmLabel,
  variant,
  onConfirm,
  onClose,
}: ConfirmActionModalProps) {
  return (
    <Modal onClose={onClose} labelledBy="confirm-action-title">
      <div className="flex flex-col gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <img src={icon} alt="" className="size-5" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 id="confirm-action-title" className="text-preset-3 text-neutral-950 dark:text-neutral-0">
            {title}
          </h2>
          <p className="text-preset-5 text-neutral-700 dark:text-neutral-400">{description}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-neutral-100 px-4 py-3 text-preset-4 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'rounded-lg px-4 py-3 text-preset-4 text-white',
              variant === 'danger' ? 'bg-red-500' : 'bg-blue-500',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
