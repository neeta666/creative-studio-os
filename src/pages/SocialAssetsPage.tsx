import DashboardLayout from '@/components/layout/DashboardLayout'

function ComingSoonPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <div className="w-16 h-16 rounded-lg bg-bg-elevated border border-[#2a2a2e]
                      flex items-center justify-center flex-shrink-0">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" className="text-text-muted opacity-50">
          <rect x="2" y="2" width="9" height="9" rx="1" />
          <rect x="13" y="2" width="9" height="9" rx="1" />
          <rect x="2" y="13" width="9" height="9" rx="1" />
          <rect x="13" y="13" width="9" height="9" rx="1" />
        </svg>
      </div>
      <div className="text-center flex flex-col gap-1">
        <span className="text-[14px] font-semibold text-text-primary font-display">
          Social Assets
        </span>
        <span className="text-[13px] text-text-muted">
          AI image generation coming soon.
        </span>
        <span className="text-[12px] text-text-muted mt-1">
          Create on-brand visuals for every platform and persona.
        </span>
      </div>

      {/* Feature preview list */}
      <div className="mt-4 flex flex-col gap-2 w-full max-w-xs">
        {[
          'Instagram posts & stories',
          'LinkedIn banners & carousels',
          'WhatsApp campaign graphics',
          'Persona-matched color & style',
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

export default function SocialAssetsPage() {
  return (
    <DashboardLayout
      title="Social Assets"
      subtitle="AI-generated images for every platform"
      panelTitle="Preview"
    >
      <ComingSoonPanel />
    </DashboardLayout>
  )
}
