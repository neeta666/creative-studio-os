import DashboardLayout from '@/components/layout/DashboardLayout'

function ComingSoonPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <div className="w-16 h-16 rounded-lg bg-bg-elevated border border-[#2a2a2e]
                      flex items-center justify-center flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" className="text-text-muted opacity-50">
          <rect x="2" y="2" width="20" height="15" rx="2" />
          <path d="M10 8l5 3-5 3V8z" fill="currentColor" stroke="none" />
          <path d="M2 21h20" />
        </svg>
      </div>
      <div className="text-center flex flex-col gap-1">
        <span className="text-[14px] font-semibold text-text-primary font-display">
          Video Studio
        </span>
        <span className="text-[13px] text-text-muted">
          AI video generation coming soon.
        </span>
        <span className="text-[12px] text-text-muted mt-1">
          Will support 12s promos and multi-scene story videos via Azure Sora 2.
        </span>
      </div>

      {/* Feature preview list */}
      <div className="mt-4 flex flex-col gap-2 w-full max-w-xs">
        {[
          '12-second promo videos',
          'Multi-scene story builder',
          'Persona-matched brand overlay',
          'Platform presets (Reels, Shorts, LinkedIn)',
        ].map(f => (
          <div key={f} className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[#2a2a2e] flex-shrink-0" />
            <span className="text-[12px] text-text-muted">{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function VideoStudioPage() {
  return (
    <DashboardLayout
      title="Video Studio"
      subtitle="Azure Sora 2 · 12s promos & story videos"
      panelTitle="Storyboard"
    >
      <ComingSoonPanel />
    </DashboardLayout>
  )
}
