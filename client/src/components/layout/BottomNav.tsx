import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { icon: '/images/icon-home.svg',     label: 'Home',     to: '/',         end: true },
  { icon: '/images/icon-search.svg',   label: 'Search',   to: '/search',   end: false },
  { icon: '/images/icon-archive.svg',  label: 'Archive',  to: '/archived', end: false },
  { icon: '/images/icon-tag.svg',      label: 'Tags',     to: '/tags',     end: false },
  { icon: '/images/icon-settings.svg', label: 'Settings', to: '/settings', end: false },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-4px_6px_0_rgb(240_240_240/0.6)] dark:border-neutral-800 dark:bg-neutral-950">
      {NAV_ITEMS.map(({ icon, label, to, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          aria-label={label}
          className={({ isActive }) =>
            cn(
              'flex flex-1 items-center justify-center rounded-[4px] py-1',
              isActive && 'bg-blue-50 dark:bg-blue-500/15',
            )
          }
        >
          <img src={icon} alt="" className="size-6" />
        </NavLink>
      ))}
    </nav>
  )
}
