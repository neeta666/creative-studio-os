import { useState } from 'react'
import Sidebar     from './Sidebar'
import Header      from './Header'
import MainContent from './MainContent'
import RightPanel  from './RightPanel'

interface DashboardLayoutProps {
  title: string
  subtitle?: string
  panelTitle?: string
  panelBadge?: string
  panelContent?: React.ReactNode
  children: React.ReactNode
}

/*
  Responsive layout strategy — mirrors the HTML/CSS prototype:

  Desktop  (≥1024px): sidebar(200px) | main(1fr) | right(340px)
  Tablet   (768–1023px): sidebar(64px icon-only) | main(1fr) | right hidden
  Mobile   (<768px): no sidebar in grid, sidebar overlays via fixed position
*/

export default function DashboardLayout({
  title,
  subtitle,
  panelTitle = 'Storyboard',
  panelBadge,
  panelContent,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen overflow-hidden flex flex-col">

      {/* Header — always full width on top */}
      <Header
        title={title}
        subtitle={subtitle}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Body row: sidebar + main + right */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar — desktop/tablet: in flow. Mobile: fixed overlay ── */}

        {/* Desktop + tablet: in-flow sidebar */}
        <div className="hidden md:block flex-shrink-0 md:w-[64px] lg:w-[200px] h-full">
          <Sidebar collapsed={false} />
        </div>

        {/* Mobile: fixed overlay sidebar + backdrop */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 h-full w-[220px] z-50 md:hidden">
              <Sidebar collapsed={false} onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* ── Main content — always visible ── */}
        <div className="flex-1 overflow-hidden h-full">
          <MainContent>{children}</MainContent>
        </div>

        {/* ── Right panel — desktop only ── */}
        <div className="hidden lg:block flex-shrink-0 w-[400px] h-full">
          <RightPanel title={panelTitle} badge={panelBadge}>
            {panelContent}
          </RightPanel>
        </div>

      </div>
    </div>
  )
}

