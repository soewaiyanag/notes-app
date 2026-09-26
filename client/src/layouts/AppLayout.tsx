import { Outlet } from 'react-router-dom'
import DesktopSidebar from '@/components/layout/DesktopSidebar'
import PageHeader from '@/components/layout/PageHeader'
import BottomNav from '@/components/layout/BottomNav'

export default function AppLayout() {
  return (
    <>
      {/* Desktop (lg+): persistent sidebar, content fills the rest */}
      <div className="hidden h-screen overflow-hidden bg-white dark:bg-neutral-950 lg:flex">
        <DesktopSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>

      {/* Mobile / tablet (< lg): header + bottom nav chrome */}
      <div className="relative min-h-dvh bg-neutral-100 dark:bg-neutral-950 lg:hidden">
        <PageHeader />
        <main className="pb-[60px] pt-[54px]">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </>
  )
}
