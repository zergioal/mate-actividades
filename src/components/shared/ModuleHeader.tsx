import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import type { ModuleColor } from '@/types/module.types'

interface ModuleHeaderProps {
  title: string
  description: string
  icon: string
  color: ModuleColor
  onReset?: () => void
}

const colorClasses: Record<ModuleColor, { bg: string; text: string; iconBg: string }> = {
  blue:    { bg: 'from-blue-700 to-blue-900',     text: 'text-blue-100',    iconBg: 'bg-blue-600/40' },
  violet:  { bg: 'from-violet-700 to-violet-900', text: 'text-violet-100',  iconBg: 'bg-violet-600/40' },
  emerald: { bg: 'from-emerald-700 to-emerald-900', text: 'text-emerald-100', iconBg: 'bg-emerald-600/40' },
  amber:   { bg: 'from-amber-600 to-amber-800',   text: 'text-amber-100',   iconBg: 'bg-amber-500/40' },
  cyan:    { bg: 'from-cyan-700 to-cyan-900',     text: 'text-cyan-100',    iconBg: 'bg-cyan-600/40' },
  rose:    { bg: 'from-rose-700 to-rose-900',     text: 'text-rose-100',    iconBg: 'bg-rose-600/40' },
}

export function ModuleHeader({ title, description, icon, color, onReset }: ModuleHeaderProps) {
  const c = colorClasses[color]

  return (
    <div className={cn('bg-gradient-to-r py-8 px-6', c.bg)}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon */}
          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0', c.iconBg)}>
            <span className="text-white">{icon}</span>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className={cn('mt-0.5 text-sm', c.text)}>{description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reiniciar
              </button>
            )}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
