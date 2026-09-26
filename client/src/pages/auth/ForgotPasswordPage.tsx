import { useState, type FormEvent } from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import TextField from '@/components/auth/TextField'
import { authApi } from '@/lib/endpoints'
import { isValidEmail } from '@/lib/validation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError(undefined)

    setIsSubmitting(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout heading="Check your email" subheading="We've sent a password reset link if that email is registered.">
        <p className="text-center text-preset-5 text-neutral-700 dark:text-neutral-400">
          Didn't get it? Check your spam folder, or try again in a few minutes.
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout heading="Forgotten your password?" subheading="Enter your email below, and we'll send you a link to reset it.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <TextField
          label="Email Address"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          autoComplete="email"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white disabled:opacity-50"
        >
          Send Reset Link
        </button>
      </form>
    </AuthLayout>
  )
}
