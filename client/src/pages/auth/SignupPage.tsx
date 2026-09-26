import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '@/components/auth/AuthLayout'
import TextField from '@/components/auth/TextField'
import PasswordField from '@/components/auth/PasswordField'
import AuthAlternatives from '@/components/auth/AuthAlternatives'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH } from '@/lib/validation'

export default function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string>()
  const [passwordError, setPasswordError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEmailError(undefined)
    setPasswordError(undefined)

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    if (!isValidPassword(password)) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }

    setIsSubmitting(true)
    try {
      await register(email, password)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setEmailError('That email is already in use.')
      } else {
        setPasswordError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      heading="Create Your Account"
      subheading="Sign up to start organizing your notes and boost your productivity."
    >
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
            error={passwordError}
            hint={passwordError ? undefined : `At least ${MIN_PASSWORD_LENGTH} characters`}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white disabled:opacity-50"
        >
          Sign up
        </button>

        <AuthAlternatives footerPrompt="Already have an account?" footerLinkLabel="Login" footerTo="/login" />
      </form>
    </AuthLayout>
  )
}
