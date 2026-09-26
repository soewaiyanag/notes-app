import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useAuth } from '@/context/AuthContext'
import { SETTINGS_ITEMS } from './settingsItems'

export default function SettingsNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Bare /settings shows the Color Theme panel by default, so it should
  // also light up the Color Theme nav item.
  const isItemActive = (to: string) =>
    location.pathname === to || (to === SETTINGS_ITEMS[0].to && location.pathname === '/settings')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="flex w-full flex-col gap-1 lg:w-[220px] lg:shrink-0 lg:border-r lg:border-neutral-200 lg:px-4 lg:py-5 dark:lg:border-neutral-800">
      {SETTINGS_ITEMS.map(({ to, icon, label }) => {
        const isActive = isItemActive(to)
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-[10px] text-preset-4 transition-colors',
              isActive
                ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-0'
                : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900',
            )}
          >
            <img src={icon} alt="" className="size-5 dark:invert" />
            <span className="flex-1 text-left">{label}</span>
            {isActive && <img src="/images/icon-chevron-right.svg" alt="" className="hidden h-[10px] w-[6px] lg:block" />}
          </Link>
        )
      })}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-[10px] text-preset-4 text-neutral-700 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
      >
        <img src="/images/icon-logout.svg" alt="" className="size-5 dark:invert" />
        Logout
      </button>
    </nav>
  )
}
