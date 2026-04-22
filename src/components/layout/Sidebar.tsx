import { NavLink, useNavigate } from 'react-router-dom'
import usePersonaStore from '@/store/usePersonaStore'

// ── Nav item data ───────────────────────────────────────────────────────────
// Defined here so adding a new route is a one-line change, not a JSX edit.

const CREATE_NAV = [
  {
    label: 'Video Studio',
    to: '/',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="2" width="12" height="10" rx="2" />
        <path d="M6 6l3 2-3 2V6z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Social Assets',
    to: '/social',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Copy Writer',
    to: '/copy',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 4h10M3 8h7M3 12h5" />
      </svg>
    ),
  },
]

const PLAN_NAV = [
  {
    label: 'Calendar',
    to: '/calendar',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="3" width="12" height="11" rx="1.5" />
        <path d="M5 2v2M11 2v2M2 7h12" />
      </svg>
    ),
  },
  {
    label: 'Plan Generator',
    to: '/plan',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 13V7l5-5 5 5v6" />
        <rect x="6" y="9" width="4" height="4" />
      </svg>
    ),
  },
]

const SYSTEM_NAV = [
  {
    label: 'AI Connections',
    to: '/connections',
    badge: '0',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="2" />
        <path d="M8 2v2M8 12v2M2 8h2M12 8h2" />
      </svg>
    ),
  },
  {
    label: 'Personas',
    to: '/personas',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="6" r="3" />
        <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" />
      </svg>
    ),
  },
]

// ── Shared nav item ─────────────────────────────────────────────────────────

interface NavItemProps {
  to: string
  label: string
  icon: React.ReactNode
  badge?: string
}

function NavItem({ to, label, icon, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-[9px] px-[10px] py-2 rounded-sm text-[13px] transition-colors duration-150 no-underline',
          isActive
            ? 'bg-[rgba(229,90,30,0.12)] text-accent'
            : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
        ].join(' ')
      }
    >
      <span className="w-4 h-4 flex-shrink-0 opacity-70">{icon}</span>
      {label}
      {badge !== undefined && (
        <span className="ml-auto bg-accent text-white text-[9px] font-semibold px-[5px] py-px rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

// ── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const persona = usePersonaStore((state) => state.getActivePersona())
  const navigate = useNavigate()

  return (
    <aside
      className="
      flex flex-col h-full overflow-hidden
      bg-bg-surface border-r border-[#1f1f23]
    "
    >
      {/* Persona badge */}
      <div className="flex items-center gap-[10px] px-4 py-[14px] border-b border-[#1f1f23]">
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center
                     font-display text-[13px] font-bold flex-shrink-0
                     border"
          style={{
            background: `${persona.accentColor}1f`,
            borderColor: persona.accentColor,
            color: persona.accentColor,
          }}
        >
          {persona.avatarLetter}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-display text-[13px] font-semibold text-text-primary truncate">
            {persona.label}
          </span>
          <span className="text-[10px] text-text-muted uppercase tracking-[0.04em]">
            Active Persona
          </span>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 flex flex-col gap-[2px] px-2 py-3 overflow-y-auto">
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-text-muted px-2 pt-2 pb-1">
          Create
        </span>
        {CREATE_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-text-muted px-2 pt-3 pb-1">
          Plan
        </span>
        {PLAN_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-text-muted px-2 pt-3 pb-1">
          System
        </span>
        {SYSTEM_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Footer actions */}
      <div className="flex flex-col gap-[2px] px-2 py-3 border-t border-[#1f1f23]">
        <button
          onClick={() => navigate('/persona')}
          className="flex items-center gap-[9px] px-[10px] py-2 rounded-sm text-[13px]
                     text-text-secondary hover:bg-bg-hover hover:text-text-primary
                     transition-colors duration-150 w-full text-left"
        >
          <span className="w-4 h-4 flex-shrink-0 opacity-70">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 8H3M3 8l3-3M3 8l3 3" />
              <path d="M7 4V2.5A1.5 1.5 0 018.5 1H13a1.5 1.5 0 011.5 1.5v11A1.5 1.5 0 0113 15H8.5A1.5 1.5 0 017 13.5V12" />
            </svg>
          </span>
          Switch Persona
        </button>

        <button
          className="flex items-center gap-[9px] px-[10px] py-2 rounded-sm text-[13px]
                           text-text-secondary hover:bg-bg-hover hover:text-text-primary
                           transition-colors duration-150 w-full text-left"
        >
          <span className="w-4 h-4 flex-shrink-0 opacity-70">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" />
            </svg>
          </span>
          Log Out
        </button>
      </div>
    </aside>
  )
}
