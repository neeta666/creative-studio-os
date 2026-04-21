import Sidebar     from './Sidebar'
import Header      from './Header'
import MainContent from './MainContent'
import RightPanel  from './RightPanel'

interface DashboardLayoutProps {
  // Header
  title: string
  subtitle?: string
  // Right panel
  panelTitle?: string
  panelBadge?: string
  panelContent?: React.ReactNode
  // Main area
  children: React.ReactNode
}

/*
  Grid areas match the HTML prototype exactly:

  ┌──────────┬────────────────────┐
  │          │       header       │
  │ sidebar  ├──────────┬─────────┤
  │          │   main   │  right  │
  └──────────┴──────────┴─────────┘

  Sidebar width:  200px  (matches --sidebar-width token)
  Right width:    340px  (matches --right-width token)
  Header height:  56px   (matches --header-height token, set via h-14)
*/

export default function DashboardLayout({
  title,
  subtitle,
  panelTitle = 'Storyboard',
  panelBadge,
  panelContent,
  children,
}: DashboardLayoutProps) {
  return (
    <div
      className="h-screen overflow-hidden grid"
      style={{
        gridTemplateColumns: '200px 1fr 340px',
        gridTemplateRows:    '56px 1fr',
        gridTemplateAreas: `
          "sidebar header header"
          "sidebar main   right"
        `,
      }}
    >
      <div style={{ gridArea: 'sidebar' }}>
        <Sidebar />
      </div>

      <div style={{ gridArea: 'header' }}>
        <Header title={title} subtitle={subtitle} />
      </div>

      <div style={{ gridArea: 'main' }}>
        <MainContent>{children}</MainContent>
      </div>

      <div style={{ gridArea: 'right' }}>
        <RightPanel title={panelTitle} badge={panelBadge}>
          {panelContent}
        </RightPanel>
      </div>
    </div>
  )
}
