import usePersonaStore from '@/store/usePersonaStore'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const persona = usePersonaStore(state => state.getActivePersona())

  return (
    <header className="
      flex items-center justify-between flex-shrink-0
      bg-bg-surface border-b border-[#1f1f23]
      px-5 gap-3 h-14
    ">

      {/* Left: hamburger (mobile only) + page title */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Hamburger — only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex flex-col justify-center gap-[5px]
                     w-8 h-8 flex-shrink-0 p-1"
          aria-label="Open menu"
        >
          <span className="block w-[18px] h-[1.5px] bg-text-secondary rounded" />
          <span className="block w-[18px] h-[1.5px] bg-text-secondary rounded" />
          <span className="block w-[18px] h-[1.5px] bg-text-secondary rounded" />
        </button>

        <div className="flex flex-col min-w-0">
          <span className="font-display text-base font-bold text-text-primary leading-tight truncate">
            {title}
          </span>
          {subtitle && (
            <span className="text-[11px] text-text-muted hidden sm:block">{subtitle}</span>
          )}
        </div>
      </div>

      {/* Right: persona pill + action pills */}
      <div className="flex items-center gap-2 flex-shrink-0">

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
          <span className="hidden sm:inline">{persona.label}</span>
          <span className="sm:hidden">{persona.avatarLetter}</span>
        </div>

        <div className="hidden sm:flex items-center gap-[6px] px-3 py-[5px] rounded-full
                        text-[12px] font-medium border border-[#2a2a2e]
                        text-text-secondary cursor-pointer transition-colors whitespace-nowrap">
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