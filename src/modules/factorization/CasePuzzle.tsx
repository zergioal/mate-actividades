import { useState, useCallback } from 'react'
import { MathExpression } from '@/components/shared/MathExpression'
import { FeedbackPanel } from '@/components/shared/FeedbackPanel'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { FeedbackState } from '@/types/module.types'
import { generateCase, type FactorizationCaseNumber, type MCQChallenge } from './factorizationCases.logic'

interface Props {
  caseNumber: FactorizationCaseNumber
}

export function CasePuzzle({ caseNumber }: Props) {
  const [challenge, setChallenge] = useState<MCQChallenge>(() => generateCase(caseNumber))
  const [selected, setSelected]   = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [showHint, setShowHint]   = useState(false)
  const [feedback, setFeedback]   = useState<FeedbackState>({ type: 'idle', message: '' })
  const [score, setScore]         = useState({ correct: 0, total: 0 })

  const newChallenge = useCallback(() => {
    setChallenge(generateCase(caseNumber))
    setSelected(null)
    setConfirmed(false)
    setShowHint(false)
    setFeedback({ type: 'idle', message: '' })
  }, [caseNumber])

  const handleCheck = () => {
    if (selected === null) {
      setFeedback({ type: 'info', message: 'Selecciona una opción primero.' })
      return
    }
    const correct = selected === challenge.correctIndex
    setConfirmed(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setFeedback(
      correct
        ? { type: 'success', message: '¡Correcto! Muy bien.' }
        : { type: 'error', message: 'Incorrecto. Revisa la solución.' },
    )
  }

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full">
          Aciertos: {score.correct}/{score.total}
        </span>
        <Button size="sm" variant="secondary" onClick={() => setShowHint((h) => !h)}>
          {showHint ? 'Ocultar pista' : '💡 Pista'}
        </Button>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 animate-slide-up">
          {challenge.hint}
        </div>
      )}

      {/* Expression */}
      <div className="bg-white rounded-2xl border-2 border-violet-200 p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-3">Factoriza</p>
        <div className="text-3xl flex justify-center">
          <MathExpression formula={challenge.expressionLatex} displayMode />
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {challenge.options.map((opt, i) => {
          const isCorrect = i === challenge.correctIndex
          const isSelected = i === selected

          let stateClass = 'bg-white border-slate-200 hover:border-violet-400 hover:bg-violet-50 cursor-pointer'
          if (confirmed) {
            if (isCorrect)
              stateClass = 'bg-emerald-50 border-emerald-500 text-emerald-800'
            else if (isSelected && !isCorrect)
              stateClass = 'bg-red-50 border-red-400 text-red-700'
            else
              stateClass = 'bg-white border-slate-200 opacity-50'
          } else if (isSelected) {
            stateClass = 'bg-violet-100 border-violet-500 shadow-md scale-[1.02]'
          }

          return (
            <button
              key={i}
              onClick={() => !confirmed && setSelected(i)}
              disabled={confirmed}
              className={cn(
                'w-full min-h-[64px] px-4 py-3 rounded-xl border-2 text-center transition-all font-medium text-sm flex items-center justify-center',
                stateClass,
              )}
            >
              <span className="flex items-center gap-2 flex-wrap justify-center">
                {confirmed && isCorrect && <span className="text-emerald-600 text-base">✓</span>}
                {confirmed && isSelected && !isCorrect && <span className="text-red-500 text-base">✗</span>}
                <MathExpression formula={opt} />
              </span>
            </button>
          )
        })}
      </div>

      <FeedbackPanel feedback={feedback} />

      {/* Solution reveal */}
      {confirmed && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 animate-slide-up space-y-2">
          <p className="text-sm font-semibold text-slate-600">Solución:</p>
          <div className="flex justify-center text-2xl">
            <MathExpression formula={`${challenge.expressionLatex} = ${challenge.solutionLatex}`} displayMode />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!confirmed ? (
          <Button onClick={handleCheck} size="lg" className="flex-1 bg-violet-600 hover:bg-violet-700">
            Verificar
          </Button>
        ) : (
          <Button onClick={newChallenge} size="lg" variant="success" className="flex-1">
            Siguiente ejercicio →
          </Button>
        )}
        <Button onClick={newChallenge} size="lg" variant="secondary">
          Nueva
        </Button>
      </div>
    </div>
  )
}
