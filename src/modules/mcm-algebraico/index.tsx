import { useState, useCallback } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import { MathExpression } from '@/components/shared/MathExpression'
import { FeedbackPanel } from '@/components/shared/FeedbackPanel'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { FeedbackState } from '@/types/module.types'
import { getNextMCMProblem, getMCMByCategory, type MCMProblem } from './mcm.logic'

type Category = 'all' | 'monomials' | 'binomials' | 'mixed'

const CAT_LABELS: Record<Category, string> = {
  all: 'Todos',
  monomials: 'Monomios',
  binomials: 'Binomios / Polinomios',
  mixed: 'Mixtos',
}

function nextProblem(cat: Category): MCMProblem {
  return cat === 'all' ? getNextMCMProblem() : getMCMByCategory(cat)
}

export function MCMAlgebraico() {
  const [cat, setCat]           = useState<Category>('all')
  const [problem, setProblem]   = useState<MCMProblem>(() => getNextMCMProblem())
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [showHint, setShowHint]  = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [feedback, setFeedback]  = useState<FeedbackState>({ type: 'idle', message: '' })
  const [score, setScore]        = useState({ correct: 0, total: 0 })

  const newProblem = useCallback((c = cat) => {
    setProblem(nextProblem(c))
    setSelected(null)
    setConfirmed(false)
    setShowHint(false)
    setShowSteps(false)
    setFeedback({ type: 'idle', message: '' })
  }, [cat])

  const handleCatChange = (c: Category) => {
    setCat(c)
    newProblem(c)
  }

  const handleCheck = () => {
    if (selected === null) {
      setFeedback({ type: 'info', message: 'Selecciona una opción.' })
      return
    }
    const correct = selected === problem.correctIndex
    setConfirmed(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setFeedback(
      correct
        ? { type: 'success', message: '¡Correcto! Buen cálculo del MCM.' }
        : { type: 'error', message: 'Incorrecto. Revisa los pasos de solución.' },
    )
  }

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="MCM Algebraico"
        description="Calcula el mínimo común múltiplo de expresiones algebraicas"
        icon="⊔"
        color="blue"
        onReset={() => { setScore({ correct: 0, total: 0 }); newProblem() }}
      />

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CAT_LABELS) as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCatChange(c)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold border transition-all',
                cat === c
                  ? 'bg-blue-700 text-white border-blue-700 shadow'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400',
              )}
            >
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Score */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">
            Aciertos: <strong className="text-blue-700">{score.correct}</strong>/{score.total}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setShowHint((h) => !h)}>
              {showHint ? 'Ocultar pista' : '💡 Pista'}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowSteps((s) => !s)} disabled={!confirmed}>
              {showSteps ? 'Ocultar pasos' : 'Ver solución'}
            </Button>
          </div>
        </div>

        {/* Problem display */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 text-center shadow-sm space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Calcula el MCM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-2xl">
            <MathExpression formula={`\\text{MCM}\\!\\left(${problem.expr1Latex},\\;${problem.expr2Latex}\\right)`} displayMode />
          </div>
          <p className="text-sm text-slate-400">¿Cuál es el mínimo común múltiplo de estas dos expresiones?</p>
        </div>

        {/* Hint — hidden by default */}
        {showHint && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 animate-slide-up">
            💡 {problem.hint}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {problem.options.map((opt, i) => {
            const isCorrect = i === problem.correctIndex
            const isSelected = i === selected

            let cls = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
            if (confirmed) {
              if (isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-800'
              else if (isSelected) cls = 'bg-red-50 border-red-400 text-red-700'
              else cls = 'bg-white border-slate-200 opacity-50'
            } else if (isSelected) {
              cls = 'bg-blue-100 border-blue-500 shadow-md scale-[1.01]'
            }

            return (
              <button
                key={i}
                onClick={() => !confirmed && setSelected(i)}
                disabled={confirmed}
                className={cn(
                  'w-full min-h-[60px] px-4 py-3 rounded-xl border-2 text-center transition-all font-medium text-sm flex items-center justify-center',
                  cls,
                )}
              >
                <span className="flex items-center gap-2 flex-wrap justify-center">
                  {confirmed && isCorrect && <span className="text-emerald-600">✓</span>}
                  {confirmed && isSelected && !isCorrect && <span className="text-red-500">✗</span>}
                  <MathExpression formula={opt} />
                </span>
              </button>
            )
          })}
        </div>

        <FeedbackPanel feedback={feedback} />

        {/* Solution steps */}
        {confirmed && showSteps && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 animate-slide-up">
            <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Solución paso a paso</h4>
            {problem.solutionSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="text-base flex">
                  <MathExpression formula={step} displayMode />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!confirmed ? (
            <Button onClick={handleCheck} size="lg" className="flex-1">
              Verificar
            </Button>
          ) : (
            <Button onClick={() => newProblem()} size="lg" variant="success" className="flex-1">
              Siguiente →
            </Button>
          )}
          <Button onClick={() => newProblem()} size="lg" variant="secondary">
            Nuevo
          </Button>
        </div>

        {/* Reference */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <strong>Recuerda:</strong> El MCM de expresiones algebraicas se obtiene factorizando ambas
          y tomando cada factor a su mayor potencia. Para coeficientes, calcula el MCM numérico.
        </div>
      </div>
    </div>
  )
}
