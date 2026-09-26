import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '@/components/auth/AuthLayout'
import TextField from '@/components/auth/TextField'
import PasswordField from '@/components/auth/PasswordField'
import AuthAlternatives from '@/components/auth/AuthAlternatives'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { isValidEmail } from '@/lib/validation'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(undefined)

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError(undefined)

    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout heading="Welcome to Note" subheading="Please log in to continue">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
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

          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formError}
            action={{ label: 'Forgot', onClick: () => navigate('/forgot-password') }}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white disabled:opacity-50"
        >
          Login
        </button>

        <AuthAlternatives footerPrompt="No account yet?" footerLinkLabel="Sign Up" footerTo="/signup" />
      </form>
    </AuthLayout>
  )
}
