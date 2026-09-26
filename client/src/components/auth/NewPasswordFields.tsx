import PasswordField from './PasswordField'
import { MIN_PASSWORD_LENGTH } from '@/lib/validation'
import type { useNewPasswordFields } from '@/hooks/useNewPasswordFields'

type NewPasswordFieldsState = ReturnType<typeof useNewPasswordFields>

export default function NewPasswordFields({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  confirmError,
}: NewPasswordFieldsState) {
  return (
    <>
      <PasswordField
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
        hint={passwordError ? undefined : `At least ${MIN_PASSWORD_LENGTH} characters`}
        autoComplete="new-password"
        required
      />

      <PasswordField
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmError}
        autoComplete="new-password"
        required
      />
    </>
  )
}
