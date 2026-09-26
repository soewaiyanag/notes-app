import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '@/components/auth/AuthLayout'
import NewPasswordFields from '@/components/auth/NewPasswordFields'
import { useNewPasswordFields } from '@/hooks/useNewPasswordFields'
import { authApi } from '@/lib/endpoints'
import { ApiError } from '@/lib/api'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const fields = useNewPasswordFields()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!token) {
    return (
      <AuthLayout heading="Invalid reset link" subheading="This password reset link is missing or has expired.">
        <Link
          to="/forgot-password"
          className="block rounded-lg bg-blue-500 px-4 py-3 text-center text-preset-4 text-white"
        >
          Request a new link
        </Link>
      </AuthLayout>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!fields.validate()) return

    setIsSubmitting(true)
    try {
      await authApi.resetPassword(token, fields.password)
      navigate('/login')
    } catch (err) {
      fields.setPasswordError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout heading="Reset Your Password" subheading="Choose a new password to secure your account.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <NewPasswordFields {...fields} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white disabled:opacity-50"
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  )
}
