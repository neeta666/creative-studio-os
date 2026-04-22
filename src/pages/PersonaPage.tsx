import { useNavigate } from 'react-router-dom'
import usePersonaStore, { PERSONAS } from '@/store/usePersonaStore'
import PersonaCard from '@/components/persona/PersonaCard'
import type { PersonaId } from '@/types/persona'

// ── Per-persona icon SVGs ───────────────────────────────────────────────────
// Defined here, not in the store — icons are a UI concern, not data.
// Order matches PERSONAS array in the store.

const PERSONA_ICONS: Record<PersonaId, React.ReactNode> = {
  uden_tech: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#e55a1e" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  viral_monkey: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#e55a1e" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      <path d="M18 6c1.5-1 3 0 3 2s-1.5 3-3 2" />
    </svg>
  ),
  career_jobs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#3b8bd4" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
  gov_outreach: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="1.5">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21V13h6v8" />
    </svg>
  ),
  blank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#8a64ff" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
  ),
}

// Per-persona brand color dots — matches persona.html exactly
const PERSONA_DOTS: Record<PersonaId, string[]> = {
  uden_tech: ['#e55a1e', '#f0efe8'],
  viral_monkey: ['#e55a1e', '#f5c518'],
  career_jobs: ['#3b8bd4', '#f0efe8'],
  gov_outreach: ['#1d9e75', '#5dcaa5', '#f0efe8'],
  blank: ['#5a5a5e', '#f0efe8'],
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function PersonaPage() {
  const navigate = useNavigate()
  const activePersonaId = usePersonaStore((state) => state.activePersonaId)
  const setActivePersona = usePersonaStore((state) => state.setActivePersona)

  function handleSelect(id: PersonaId) {
    setActivePersona(id) // updates store + persists via zustand middleware
    setTimeout(() => navigate('/'), 150) // 150ms lets the card selection animate before redirect
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center overflow-auto py-12 px-6">
      <div className="w-full max-w-[760px] flex flex-col items-center gap-10">
        {/* Heading — matches persona-screen__header */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="font-display text-[40px] font-bold text-text-primary leading-tight">
            Choose <span className="text-accent">Persona</span>
          </h1>
          <p className="text-[13px] text-text-muted uppercase tracking-[0.04em]">
            Every output locks to that brand&apos;s complete style guide.
          </p>
        </div>

        {/* Grid — 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div
          className="
          grid gap-[14px] w-full
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
        "
        >
          {PERSONAS.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              isActive={persona.id === activePersonaId}
              dots={PERSONA_DOTS[persona.id]}
              icon={PERSONA_ICONS[persona.id]}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
