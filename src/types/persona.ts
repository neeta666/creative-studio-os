// Central type definitions for the persona system.
// Import this wherever persona data is used.

export type PersonaId =
  | 'uden_tech'
  | 'viral_monkey'
  | 'career_jobs'
  | 'gov_outreach'
  | 'blank'

export interface Persona {
  id: PersonaId
  label: string
  description: string
  accentColor: string
  avatarLetter: string
}
