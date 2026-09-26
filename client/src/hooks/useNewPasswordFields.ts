import { useState } from 'react'
import { isValidPassword, MIN_PASSWORD_LENGTH } from '@/lib/validation'

export function useNewPasswordFields() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string>()
  const [confirmError, setConfirmError] = useState<string>()

  const validate = (): boolean => {
    setPasswordError(undefined)
    setConfirmError(undefined)

    if (!isValidPassword(password)) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return false
    }
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.')
      return false
    }
    return true
  }

  const reset = () => {
    setPassword('')
    setConfirmPassword('')
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    setPasswordError,
    confirmError,
    validate,
    reset,
  }
}
