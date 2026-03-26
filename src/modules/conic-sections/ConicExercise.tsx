import { useState, useCallback } from 'react'
import { MathExpression } from '@/components/shared/MathExpression'
import { FeedbackPanel } from '@/components/shared/FeedbackPanel'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { FeedbackState } from '@/types/module.types'
import type { ConicType } from './conicSections.logic'
import { generateExercise, type ConicExercise } from './conicExercises.logic'

const CONIC_COLOR: Record<ConicType, string> = {
  circle:    'rose',
  parabola:  'rose',
  ellipse:   'rose',
  hyperbola: 'rose',
}
void CONIC_COLOR  // suppress unused warning — used only for accent

interface Props {
  conicType: ConicType
}

export function ConicExercisePanel({ conicType }: Props) {
  const [exercise, setExercise]   = useState<ConicExercise>(() => generateExercise(conicType))
  const [selected, setSelected]   = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [showHint, setShowHint]   = useState(false)
  const [showSol, setShowSol]     = useState(false)
  const [feedback, setFeedback]   = useState<FeedbackState>({ type: 'idle', message: '' })
  const [score, setScore]         = useState({ correct: 0, total: 0 })

  const newExercise = useCallback(() => {
    setExercise(generateExercise(conicType))
    setSelected(null)
    setConfirmed(false)
    setShowHint(false)
    setShowSol(false)
    setFeedback({ type: 'idle', message: '' })
  }, [conicType])

  const handleCheck = () => {
    if (selected === null) {
      setFeedback({ type: 'info', message: 'Selecciona una opción primero.' })
      return
    }
    const correct = selected === exercise.correctIndex
    setConfirmed(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setFeedback(
      correct
        ? { type: 'success', message: '¡Correcto!' }
        : { type: 'error', message: 'Incorrecto. Revisa la solución.' },
    )
  }

  return (
    <div className="space-y-5">
      {/* Score + buttons */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm text-slate-500">
          Aciertos: <strong className="text-rose-700">{score.correct}</strong>/{score.total}
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowHint((h) => !h)}>
            {showHint ? 'Ocultar pista' : '💡 Pista'}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowSol((s) => !s)} disabled={!confirmed}>
            {showSol ? 'Ocultar solución' : 'Ver solución'}
          </Button>
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 animate-slide-up">
          💡 {exercise.hint}
        </div>
      )}

      {/* Question */}
      <div className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-sm space-y-3">
        <p className="text-sm font-semibold text-slate-700">{exercise.questionText}</p>
        <div className="flex justify-center text-xl">
          <MathExpression formula={exercise.questionLatex} displayMode />
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exercise.options.map((opt, i) => {
          const isCorrect  = i === exercise.correctIndex
          const isSelected = i === selected

          let cls = 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50 cursor-pointer'
          if (confirmed) {
            if (isCorrect)        cls = 'bg-emerald-50 border-emerald-500 text-emerald-800'
            else if (isSelected)  cls = 'bg-red-50 border-red-400 text-red-700'
            else                  cls = 'bg-white border-slate-200 opacity-50'
          } else if (isSelected)  cls = 'bg-rose-100 border-rose-500 shadow-md scale-[1.02]'

          return (
            <button
              key={i}
              onClick={() => !confirmed && setSelected(i)}
              disabled={confirmed}
              className={cn(
                'w-full min-h-[56px] px-4 py-3 rounded-xl border-2 text-center transition-all text-sm font-medium flex items-center justify-center',
                cls,
              )}
            >
              <span className="flex items-center gap-2 flex-wrap justify-center">
                {confirmed && isCorrect  && <span className="text-emerald-600 text-base">✓</span>}
                {confirmed && isSelected && !isCorrect && <span className="text-red-500 text-base">✗</span>}
                <MathExpression formula={opt} />
              </span>
            </button>
          )
        })}
      </div>

      <FeedbackPanel feedback={feedback} />

      {/* Solution */}
      {confirmed && showSol && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 animate-slide-up space-y-2">
          <p className="text-sm font-semibold text-slate-600">Solución:</p>
          <div className="flex justify-center text-lg">
            <MathExpression formula={exercise.solutionLatex} displayMode />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!confirmed ? (
          <Button onClick={handleCheck} size="lg" className="flex-1 bg-rose-700 hover:bg-rose-800">
            Verificar
          </Button>
        ) : (
          <Button onClick={newExercise} size="lg" variant="success" className="flex-1">
            Siguiente →
          </Button>
        )}
        <Button onClick={newExercise} size="lg" variant="secondary">Nueva</Button>
      </div>
    </div>
  )
}
