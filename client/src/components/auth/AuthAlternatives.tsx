import AuthDivider from './AuthDivider'
import GoogleButton from './GoogleButton'
import AuthFooterLink from './AuthFooterLink'

interface AuthAlternativesProps {
  footerPrompt: string
  footerLinkLabel: string
  footerTo: string
}

export default function AuthAlternatives({ footerPrompt, footerLinkLabel, footerTo }: AuthAlternativesProps) {
  return (
    <div className="flex flex-col gap-4">
      <AuthDivider label="Or log in with:" />
      <GoogleButton />
      <AuthFooterLink prompt={footerPrompt} linkLabel={footerLinkLabel} to={footerTo} />
    </div>
  )
}
