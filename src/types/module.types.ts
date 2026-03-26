/** Identifies each math topic module */
export type ModuleId =
  | 'number-line'
  | 'factorization'
  | 'algebraic-fractions'
  | 'quadratic-equations'
  | 'trigonometric-functions'
  | 'conic-sections'
  | 'mcm-algebraico'
  | 'fracciones-operaciones'

export type DifficultyLevel = 'basico' | 'intermedio' | 'avanzado'

/** Descriptor used to render module cards on the homepage */
export interface ModuleDescriptor {
  id: ModuleId
  title: string
  subtitle: string
  description: string
  route: string
  color: ModuleColor
  icon: string          // Unicode / emoji used in cards
  levels: DifficultyLevel[]
  tags: string[]
}

/** Tailwind color token name (maps to CSS classes in ModuleCard) */
export type ModuleColor =
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'cyan'
  | 'rose'

/** Generic feedback state shared across modules */
export interface FeedbackState {
  type: 'idle' | 'success' | 'error' | 'info'
  message: string
}
