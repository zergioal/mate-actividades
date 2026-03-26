import { cn } from '@/lib/cn'
import type { DifficultyLevel } from '@/types/module.types'

interface BadgeProps {
  label: string
  variant?: 'default' | 'blue' | 'violet' | 'emerald' | 'amber' | 'cyan' | 'rose'
  size?: 'sm' | 'md'
  className?: string
}

const variantClasses = {
  default:  'bg-slate-100 text-slate-600',
  blue:     'bg-blue-100 text-blue-700',
  violet:   'bg-violet-100 text-violet-700',
  emerald:  'bg-emerald-100 text-emerald-700',
  amber:    'bg-amber-100 text-amber-700',
  cyan:     'bg-cyan-100 text-cyan-700',
  rose:     'bg-rose-100 text-rose-700',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({ label, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn('inline-block font-medium rounded-full', variantClasses[variant], sizeClasses[size], className)}>
      {label}
    </span>
  )
}

/** Convenience wrapper: maps DifficultyLevel to colored badge */
export function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const map: Record<DifficultyLevel, { label: string; variant: BadgeProps['variant'] }> = {
    basico:      { label: 'Básico',      variant: 'emerald' },
    intermedio:  { label: 'Intermedio',  variant: 'amber'   },
    avanzado:    { label: 'Avanzado',    variant: 'rose'    },
  }
  const { label, variant } = map[level]
  return <Badge label={label} variant={variant} />
}
