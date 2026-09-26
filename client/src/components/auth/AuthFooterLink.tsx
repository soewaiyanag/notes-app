import { Link } from 'react-router-dom'

interface AuthFooterLinkProps {
  prompt: string
  linkLabel: string
  to: string
}

export default function AuthFooterLink({ prompt, linkLabel, to }: AuthFooterLinkProps) {
  return (
    <p className="text-center text-preset-6 text-neutral-700 dark:text-neutral-400">
      {prompt}{' '}
      <Link to={to} className="font-medium text-neutral-950 underline dark:text-neutral-0">
        {linkLabel}
      </Link>
    </p>
  )
}
