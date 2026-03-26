import { useState } from 'react'
import { MathExpression } from '@/components/shared/MathExpression'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { AlgebraicFractionProblem } from './algebraicFractions.logic'

interface Props {
  problem: AlgebraicFractionProblem
  onComplete?: () => void
}

export function FractionSimplifier({ problem, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(-1)  // -1 = only original shown
  const [completed, setCompleted] = useState(false)

  const totalSteps = problem.steps.length
  const canAdvance = currentStep < totalSteps - 1
  const isLastStep = currentStep === totalSteps - 1

  const advance = () => {
    if (canAdvance) {
      setCurrentStep((s) => s + 1)
    } else {
      setCompleted(true)
      onComplete?.()
    }
  }

  const reset = () => {
    setCurrentStep(-1)
    setCompleted(false)
  }

  return (
    <div className="space-y-6">
      {/* Original expression */}
      <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
          Expresión original
        </p>
        <div className="text-4xl">
          <MathExpression formula={problem.originalLatex} displayMode />
        </div>
      </div>

      {/* Steps progress bar */}
      <div className="flex items-center gap-1">
        {problem.steps.map((step, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn(
                'h-2 rounded-full w-full transition-all duration-300',
                i <= currentStep ? 'bg-emerald-500' : 'bg-slate-200',
              )}
            />
            <span className="text-xs text-slate-400 hidden sm:block truncate max-w-full text-center">
              {`Paso ${i + 1}`}
            </span>
          </div>
        ))}
      </div>

      {/* Steps display */}
      <div className="space-y-3">
        {problem.steps.map((step, i) => {
          if (i > currentStep) return null
          return (
            <div
              key={i}
              className={cn(
                'rounded-xl border p-4 transition-all duration-300 animate-slide-up',
                i === currentStep
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200',
              )}
            >
              <div className="flex items-start gap-3">
                {/* Step number */}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                    i === currentStep ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-white',
                  )}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 mb-2">{step.label}</p>
                  <div className="text-2xl mb-2">
                    <MathExpression formula={step.latex} displayMode />
                  </div>
                  {i === currentStep && (
                    <p className="text-sm text-slate-500 leading-relaxed mt-2 border-t border-emerald-200 pt-2">
                      💬 {step.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completed state */}
      {completed && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center animate-slide-up">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-2">
            ✅ Simplificación completa
          </p>
          <div className="text-3xl mb-3">
            <MathExpression formula={problem.finalLatex} displayMode />
          </div>
          {problem.restrictions.length > 0 && (
            <div className="text-sm text-slate-600">
              Restricciones de dominio:{' '}
              {problem.restrictions.map((r, i) => (
                <span key={i} className="mx-1">
                  <MathExpression formula={r} />
                  {i < problem.restrictions.length - 1 && <span className="mx-1">,</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={advance}
          size="lg"
          variant={completed ? 'ghost' : 'success'}
          disabled={completed}
          className="flex-1"
        >
          {currentStep === -1
            ? 'Comenzar →'
            : isLastStep && !completed
            ? 'Ver resultado'
            : completed
            ? '✓ Completado'
            : 'Siguiente paso →'}
        </Button>
        <Button onClick={reset} size="lg" variant="secondary">
          Reiniciar
        </Button>
      </div>
    </div>
  )
}
