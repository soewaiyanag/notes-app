import { useState, type InputHTMLAttributes } from 'react'
import FieldShell, { type FieldAction } from '@/components/ui/FieldShell'
import { inputClasses } from '@/lib/fieldStyles'
import { cn } from '@/lib/cn'

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  action?: FieldAction
}

export default function PasswordField({
  label,
  error,
  hint,
  action,
  id,
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const fieldId = id ?? props.name

  return (
    <FieldShell label={label} htmlFor={fieldId} error={error} hint={hint} action={action}>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          className={inputClasses(Boolean(error), cn('pr-11', className))}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <img
            src={visible ? '/images/icon-hide-password.svg' : '/images/icon-show-password.svg'}
            alt=""
            className="size-5 opacity-70 dark:invert"
          />
        </button>
      </div>
    </FieldShell>
  )
}
