import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Persona, PersonaId } from '@/types/persona'

// All available personas defined here once.
// Components and pages import this list — never hardcode persona data elsewhere.
export const PERSONAS: Persona[] = [
  {
    id: 'uden_tech',
    label: 'UDEN.tech',
    description: 'AI career platform · Tier 2/3 students',
    accentColor: '#e55a1e',
    avatarLetter: 'U',
  },
  {
    id: 'viral_monkey',
    label: 'Viral Monkey',
    description: 'YouTube growth & viral content',
    accentColor: '#e55a1e',
    avatarLetter: 'V',
  },
  {
    id: 'career_jobs',
    label: 'Career & Jobs',
    description: 'Job market insights & career guidance',
    accentColor: '#3b8bd4',
    avatarLetter: 'C',
  },
  {
    id: 'gov_outreach',
    label: 'Gov Outreach',
    description: 'B2G communications & skill schemes',
    accentColor: '#1d9e75',
    avatarLetter: 'G',
  },
  {
    id: 'blank',
    label: 'Blank / Free Mode',
    description: 'No brand constraints — full creative freedom',
    accentColor: '#8a64ff',
    avatarLetter: 'B',
  },
]

interface PersonaState {
  activePersonaId: PersonaId
  getActivePersona: () => Persona
  setActivePersona: (id: PersonaId) => void
}

const usePersonaStore = create<PersonaState>()(
  // persist saves activePersonaId to localStorage automatically
  persist(
    (set, get) => ({
      activePersonaId: 'uden_tech',

      getActivePersona: () => {
        return (
          PERSONAS.find((p) => p.id === get().activePersonaId) ?? PERSONAS[0]
        )
      },

      setActivePersona: (id: PersonaId) => {
        set({ activePersonaId: id })
      },
    }),
    { name: 'active-persona' } // localStorage key
  )
)

export default usePersonaStore
