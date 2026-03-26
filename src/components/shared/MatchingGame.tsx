import { useState, useMemo } from 'react'
import { MathExpression } from './MathExpression'
import { cn } from '@/lib/cn'

export interface MatchItem {
  id: string
  label: string
  isLatex?: boolean
}

interface Props {
  leftItems: MatchItem[]
  rightItems: MatchItem[]
  correctPairs: Record<string, string>   // leftId → rightId
  onComplete?: (errors: number) => void
  leftHeader?: string
  rightHeader?: string
}

export function MatchingGame({ leftItems, rightItems, correctPairs, onComplete, leftHeader = 'Expresión', rightHeader = 'Equivale a' }: Props) {
  const key = rightItems.map((r) => r.id).join(',')
  const shuffledRight = useMemo(
    () => [...rightItems].sort(() => Math.random() - 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})  // leftId → rightId
  const [flash, setFlash] = useState<string | null>(null)
  const [errors, setErrors] = useState(0)

  const matchedCount = Object.keys(matched).length
  const isComplete = matchedCount === leftItems.length

  const handleLeft = (id: string) => {
    if (matched[id]) return
    setSelectedLeft((prev) => (prev === id ? null : id))
  }

  const handleRight = (rightId: string) => {
    if (!selectedLeft) return
    if (Object.values(matched).includes(rightId)) return
    if (correctPairs[selectedLeft] === rightId) {
      const next = { ...matched, [selectedLeft]: rightId }
      setMatched(next)
      setSelectedLeft(null)
      if (Object.keys(next).length === leftItems.length) onComplete?.(errors)
    } else {
      setErrors((e) => e + 1)
      setFlash(rightId)
      setTimeout(() => setFlash(null), 600)
    }
  }

  const renderBtn = (item: MatchItem, side: 'left' | 'right') => {
    const isLeft = side === 'left'
    const isMatchedL = isLeft && !!matched[item.id]
    const isMatchedR = !isLeft && Object.values(matched).includes(item.id)
    const isSelected = isLeft && selectedLeft === item.id
    const isFlash = !isLeft && flash === item.id

    return (
      <button
        key={item.id}
        onClick={() => (isLeft ? handleLeft(item.id) : handleRight(item.id))}
        disabled={isMatchedL || isMatchedR}
        className={cn(
          'w-full px-3 py-3 rounded-xl border-2 text-center transition-all text-sm font-medium min-h-[54px] flex items-center justify-center',
          isMatchedL || isMatchedR
            ? 'bg-emerald-50 border-emerald-400 text-emerald-700 cursor-default opacity-80'
            : isSelected
            ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-md scale-[1.02]'
            : isFlash
            ? 'bg-red-100 border-red-400 text-red-700 animate-shake'
            : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer',
        )}
      >
        <span className="flex items-center gap-1.5 justify-center flex-wrap">
          {(isMatchedL || isMatchedR) && <span className="text-emerald-500 text-base">✓</span>}
          {item.isLatex ? <MathExpression formula={item.label} /> : item.label}
        </span>
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {isComplete ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center text-emerald-800 font-semibold animate-slide-up">
          {errors === 0 ? '¡Perfecto! Sin errores 🎉' : `¡Completado! ${errors} error${errors !== 1 ? 'es' : ''}`}
        </div>
      ) : selectedLeft ? (
        <p className="text-center text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg py-2">
          Seleccionado — ahora haz clic en la pareja de la derecha
        </p>
      ) : (
        <p className="text-center text-sm text-slate-400">Haz clic en un elemento de la izquierda para empezar</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-center text-slate-400 uppercase tracking-wide">{leftHeader}</p>
          {leftItems.map((item) => renderBtn(item, 'left'))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-center text-slate-400 uppercase tracking-wide">{rightHeader}</p>
          {shuffledRight.map((item) => renderBtn(item, 'right'))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        {matchedCount}/{leftItems.length} parejas · {errors} error{errors !== 1 ? 'es' : ''}
      </p>
    </div>
  )
}
