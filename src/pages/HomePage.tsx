import DashboardLayout from '@/components/layout/DashboardLayout'

// HomePage plugs into DashboardLayout.
// Replace the placeholder <div> below with real page content in a later step.

export default function HomePage() {
  return (
    <DashboardLayout
      title="Video Studio"
      subtitle="Azure Sora 2 · 12s promos & story videos"
      panelTitle="Storyboard"
      panelBadge="12s total"
    >
      {/* Placeholder — future: VideoStudio content goes here */}
      <div className="flex items-center justify-center h-full">
        <p className="text-text-muted text-sm">Page content goes here</p>
      </div>
    </DashboardLayout>
  )
}
