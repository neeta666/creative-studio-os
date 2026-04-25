import DashboardLayout from '@/components/layout/DashboardLayout'

export default function VideoStudioPage() {
  return (
    <DashboardLayout
      title="Video Studio"
      subtitle="Azure Sora 2 · 12s promos & story videos"
      panelTitle="Storyboard"
    >
      <div className="flex flex-col gap-5">

        {/* Prompt input section */}
        <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted block mb-3">
            Video Brief
          </span>

          <textarea
            rows={4}
            disabled
            placeholder="Describe your video idea… e.g. A 12-second promo for UDEN.tech showing students getting placed at top companies."
            className="
              w-full bg-bg-elevated border border-[#2a2a2e] rounded-sm
              px-[14px] py-[10px] text-[13px] text-text-primary font-body
              placeholder:text-text-muted resize-none outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />

          <div className="flex items-center gap-3 mt-3">
            <button
              disabled
              className="
                px-4 py-[7px] rounded-sm text-[13px] font-medium
                bg-accent text-white opacity-40 cursor-not-allowed
              "
            >
              Generate (Coming Soon)
            </button>
            <span className="text-[11px] text-text-muted">
              Waiting for Azure Sora 2 API integration
            </span>
          </div>
        </div>

        {/* Feature preview */}
        <div className="bg-bg-surface border border-[#1f1f23] rounded-lg p-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted block mb-4">
            Planned Features
          </span>
          <div className="flex flex-col gap-2">
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

      </div>
    </DashboardLayout>
  )
}
