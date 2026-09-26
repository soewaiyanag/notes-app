import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import DesktopTopBar from '@/components/layout/DesktopTopBar'
import SettingsNav from '@/components/settings/SettingsNav'
import { SETTINGS_ITEMS } from '@/components/settings/settingsItems'
import ColorThemePage from './ColorThemePage'
import { useAuth } from '@/context/AuthContext'

export default function SettingsLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const isMenuRoot = location.pathname === '/settings'

  const activeSection = SETTINGS_ITEMS.find((item) => item.to === location.pathname)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
        <DesktopTopBar title="Settings" />
        <div className="flex flex-1 overflow-hidden">
          <SettingsNav />
          <div className="flex-1 overflow-y-auto p-8">
            {isMenuRoot ? <ColorThemePage /> : <Outlet />}
          </div>
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="min-h-[calc(100dvh-54px-60px)] bg-white dark:bg-neutral-950 lg:hidden">
        {isMenuRoot ? (
          <div className="px-4 py-5">
            <h1 className="text-preset-1 mb-4 text-neutral-950 dark:text-neutral-0">Settings</h1>
            <div className="flex flex-col gap-1">
              {SETTINGS_ITEMS.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-preset-4 text-neutral-950 hover:bg-neutral-50 dark:text-neutral-0 dark:hover:bg-neutral-900"
                >
                  <img src={icon} alt="" className="size-5 dark:invert" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="my-2 h-px bg-neutral-200 dark:bg-neutral-800" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-preset-4 text-neutral-950 hover:bg-neutral-50 dark:text-neutral-0 dark:hover:bg-neutral-900"
            >
              <img src="/images/icon-logout.svg" alt="" className="size-5 dark:invert" />
              Logout
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
              <button onClick={() => navigate('/settings')} aria-label="Back">
                <img src="/images/icon-arrow-left.svg" alt="" className="size-5 dark:invert" />
              </button>
              <span className="text-preset-4 text-neutral-700 dark:text-neutral-400">
                {activeSection?.label ?? 'Settings'}
              </span>
            </div>
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
