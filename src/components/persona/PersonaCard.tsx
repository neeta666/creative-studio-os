import type { Persona } from '@/types/persona'

interface PersonaCardProps {
  persona: Persona
  isActive: boolean
  dots: string[]
  icon: React.ReactNode
  onClick: (id: Persona['id']) => void
}

export default function PersonaCard({
  persona,
  isActive,
  dots,
  icon,
  onClick,
}: PersonaCardProps) {
  return (
    <button
      onClick={() => onClick(persona.id)}
      className={[
        // Base
        'flex flex-col gap-[14px] p-[18px] text-left w-full',
        'rounded-lg border transition-all duration-150',
        'font-body',
        // Default state
        'bg-bg-surface border-[#1f1f23]',
        // Hover
        'hover:bg-bg-elevated hover:border-[#2a2a2e] hover:-translate-y-[2px]',
        // Active press
        'active:translate-y-0',
        // Selected state — border picks up persona accent via inline style
        isActive ? 'ring-1' : '',
      ].join(' ')}
      style={
        isActive
          ? {
              borderColor: persona.accentColor,
              background: `${persona.accentColor}1f`,
            }
          : {}
      }
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 border"
        style={{
          background: `${persona.accentColor}1a`,
          borderColor: persona.accentColor,
        }}
      >
        <span className="w-5 h-5">{icon}</span>
      </div>

      {/* Name + description */}
      <div className="flex flex-col gap-1 flex-1">
        <span className="font-display text-[14px] font-semibold text-text-primary">
          {persona.label}
        </span>
        <span className="text-[12px] text-text-secondary leading-snug">
          {persona.description}
        </span>
      </div>

      {/* Color dots */}
      <div className="flex items-center gap-[5px]">
        {dots.map((color, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: color }}
          />
        ))}
      </div>
    </button>
  )
}
