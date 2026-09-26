import { useState, type FormEvent } from 'react'
import PasswordField from '@/components/auth/PasswordField'
import NewPasswordFields from '@/components/auth/NewPasswordFields'
import { useNewPasswordFields } from '@/hooks/useNewPasswordFields'
import { authApi } from '@/lib/endpoints'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'

export default function ChangePasswordPage() {
  const { showToast } = useToast()
  const fields = useNewPasswordFields()
  const [oldPassword, setOldPassword] = useState('')
  const [oldError, setOldError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setOldError(undefined)
    if (!fields.validate()) return

    setIsSubmitting(true)
    try {
      await authApi.changePassword(oldPassword, fields.password)
      setOldPassword('')
      fields.reset()
      showToast('Password changed successfully!')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setOldError('Current password is incorrect.')
      } else {
        fields.setPasswordError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[440px] flex-col gap-4">
      <h2 className="text-preset-3 text-neutral-950 dark:text-neutral-0">Change Password</h2>

      <PasswordField
        label="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        error={oldError}
        autoComplete="current-password"
        required
      />

      <NewPasswordFields {...fields} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-end rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white disabled:opacity-50"
      >
        Save Password
      </button>
    </form>
  )
}
