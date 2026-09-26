import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useNotes } from '@/context/NotesContext'

const NAV_ITEMS = [
  { icon: '/images/icon-home.svg',    label: 'All Notes',      to: '/' },
  { icon: '/images/icon-archive.svg', label: 'Archived Notes', to: '/archived' },
]

function navItemClasses({ isActive }: { isActive: boolean }) {
  return cn(
    'flex w-full items-center gap-2 rounded-lg px-3 py-[10px] text-preset-4 transition-colors',
    isActive
      ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50'
      : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900',
  )
}

export default function DesktopSidebar() {
  const { tags } = useNotes()

  return (
    <aside className="hidden h-screen w-[272px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950 lg:flex">
      {/* Logo */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-[10px]">
          <img src="/images/logo.svg" alt="" className="size-7" />
          <span className="font-pacifico text-[23px] leading-none tracking-[-0.46px] text-neutral-950 dark:text-neutral-0">
            Notes
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Navigation */}
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ icon, label, to }) => (
            <NavLink key={label} to={to} end={to === '/'} className={navItemClasses}>
              {({ isActive }) => (
                <>
                  <img src={icon} alt="" className="size-5" />
                  <span className="flex-1 text-left">{label}</span>
                  {isActive && <img src="/images/icon-chevron-right.svg" alt="" className="h-[10px] w-[6px]" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

        {/* Tags section */}
        {tags.length > 0 && (
          <>
            <p className="px-2 text-preset-4 text-neutral-500">Tags</p>
            <div className="flex flex-col gap-1">
              {tags.map((tag) => (
                <NavLink key={tag.id} to={`/tags/${encodeURIComponent(tag.name)}`} className={navItemClasses}>
                  {({ isActive }) => (
                    <>
                      <img src="/images/icon-tag.svg" alt="" className="size-5" />
                      <span className="flex-1 text-left">{tag.name}</span>
                      {isActive && <img src="/images/icon-chevron-right.svg" alt="" className="h-[10px] w-[6px]" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
