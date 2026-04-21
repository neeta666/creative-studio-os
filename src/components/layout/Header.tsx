import usePersonaStore from '@/store/usePersonaStore'

interface HeaderProps {
  title: string
  subtitle?: string
}

// title and subtitle are passed by the page, not hardcoded here.
// Each page renders DashboardLayout with its own title — Header just displays it.

export default function Header({ title, subtitle }: HeaderProps) {
  const persona = usePersonaStore(state => state.getActivePersona())

  return (
    <header className="
      flex items-center justify-between
      bg-bg-surface border-b border-[#1f1f23]
      px-5 gap-3 h-14
    ">

      {/* Left: page title + subtitle */}
      <div className="flex flex-col min-w-0">
        <span className="font-display text-base font-bold text-text-primary leading-tight">
          {title}
        </span>
        {subtitle && (
          <span className="text-[11px] text-text-muted">{subtitle}</span>
        )}
      </div>

      {/* Right: persona pill + action pills */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Active persona pill — color matches persona accent */}
        <div
          className="flex items-center gap-[6px] px-3 py-[5px] rounded-full
                     text-[12px] font-medium border whitespace-nowrap"
          style={{
            background:  `${persona.accentColor}1f`,
            borderColor: persona.accentColor,
            color:       persona.accentColor,
          }}
        >
          <span
            className="w-[6px] h-[6px] rounded-full"
            style={{ background: persona.accentColor }}
          />
          {persona.label}
        </div>

        <div className="flex items-center gap-[6px] px-3 py-[5px] rounded-full
                        text-[12px] font-medium border border-[#2a2a2e]
                        text-text-secondary hover:border-text-muted hover:text-text-primary
                        cursor-pointer transition-colors whitespace-nowrap">
          ⚡ Connect
        </div>

        <div className="flex items-center gap-[6px] px-3 py-[5px] rounded-full
                        text-[12px] font-medium bg-accent text-white
                        cursor-pointer whitespace-nowrap">
          ▦ Plan
        </div>

      </div>
    </header>
  )
}
