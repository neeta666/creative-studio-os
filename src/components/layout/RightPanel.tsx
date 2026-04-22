interface RightPanelProps {
  title: string
  badge?: string
  children?: React.ReactNode
}

// RightPanel is a slot: pages pass their own content (storyboard, output, etc.)
// as children. When no children are passed it shows the default empty state.

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
      <div
        className="w-16 h-16 rounded-md bg-bg-elevated border border-[#2a2a2e]
                      flex items-center justify-center"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-25"
        >
          <rect x="2" y="2" width="20" height="15" rx="2" />
          <path d="M10 8l5 3-5 3V8z" fill="currentColor" stroke="none" />
          <path d="M2 21h20" />
        </svg>
      </div>
      <p className="text-[13px] text-text-muted text-center leading-relaxed">
        Storyboard appears
        <br />
        after generating
      </p>
    </div>
  )
}

export default function RightPanel({
  title,
  badge,
  children,
}: RightPanelProps) {
  return (
    <aside
      className="
      flex flex-col bg-bg-surface
      border-l border-[#1f1f23] overflow-hidden
    "
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-[14px] border-b border-[#1f1f23]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
          ▦ {title}
        </span>
        {badge && (
          <span
            className="text-[10px] font-semibold text-accent
                           bg-[rgba(229,90,30,0.12)] px-[6px] py-px rounded"
          >
            {badge}
          </span>
        )}
      </div>

      {/* Panel body */}
      {children ?? <EmptyState />}
    </aside>
  )
}
