export type EducationItem = {
  school: string
  program: string
  period: string
  notes?: string[]
}

export const education: EducationItem[] = [
  {
    school: 'Your University Name',
    program: 'BS Computer Science (Undergraduate)',
    period: '2022 — Present',
    notes: ['Focus: Full‑Stack Web Development', 'Interests: Human-computer interaction, systems design'],
  },
]

