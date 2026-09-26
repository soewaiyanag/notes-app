import { type InputHTMLAttributes } from 'react'
import FieldShell, { type FieldAction } from '@/components/ui/FieldShell'
import { inputClasses } from '@/lib/fieldStyles'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  action?: FieldAction
}

export default function TextField({ label, error, hint, action, id, className, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name

  return (
    <FieldShell label={label} htmlFor={fieldId} error={error} hint={hint} action={action}>
      <input id={fieldId} className={inputClasses(Boolean(error), className)} {...props} />
    </FieldShell>
  )
}
