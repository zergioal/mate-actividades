import { useState, useCallback } from 'react'
import { MathExpression } from '@/components/shared/MathExpression'
import { FeedbackPanel } from '@/components/shared/FeedbackPanel'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { DifficultyLevel, FeedbackState } from '@/types/module.types'
import { generateSolveProblem, validateRoots, type SolveProblem } from './quadratic.logic'

const EQ_TYPE_LABEL = {
  complete:    'Ecuación cuadrática completa',
  incomplete1: 'Ecuación incompleta (sin bx)',
  incomplete2: 'Ecuación incompleta (sin c)',
}

interface Props {
  difficulty: DifficultyLevel
}

export function SolveQuadratic({ difficulty }: Props) {
  const [problem, setProblem] = useState<SolveProblem>(() => generateSolveProblem(difficulty))
  const [ans1, setAns1]       = useState('')
  const [ans2, setAns2]       = useState('')
  const [noReal, setNoReal]   = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>({ type: 'idle', message: '' })
  const [showSolution, setShowSolution] = useState(false)
  const [score, setScore]     = useState({ correct: 0, total: 0 })

  const newProblem = useCallback((diff = difficulty) => {
    setProblem(generateSolveProblem(diff))
    setAns1('')
    setAns2('')
    setNoReal(false)
    setFeedback({ type: 'idle', message: '' })
    setShowSolution(false)
  }, [difficulty])

  const handleCheck = () => {
    if (noReal) {
      const correct = !problem.hasRealRoots
      setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
      if (correct) {
        setFeedback({ type: 'success', message: '¡Correcto! Esta ecuación no tiene raíces reales (Δ < 0).' })
      } else {
        setFeedback({ type: 'error', message: `Incorrecto. Esta ecuación SÍ tiene raíces reales: x₁ = ${problem.roots[0].toFixed(3)}, x₂ = ${problem.roots[1].toFixed(3)}` })
      }
      setShowSolution(true)
      return
    }

    if (!problem.hasRealRoots) {
      setFeedback({ type: 'info', message: 'Esta ecuación no tiene raíces reales. Marca la casilla correspondiente.' })
      return
    }

    const correct = validateRoots(ans1, ans2, problem)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))

    if (correct) {
      setFeedback({ type: 'success', message: '¡Correcto! Las raíces son válidas.' })
      setShowSolution(true)
    } else {
      const r = problem.roots
      setFeedback({
        type: 'error',
        message: `Incorrecto. Las raíces correctas son x₁ ≈ ${r[0].toFixed(4)} y x₂ ≈ ${r[1]?.toFixed(4) ?? r[0].toFixed(4)}. Revisa tu cálculo.`,
      })
      setShowSolution(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
          {EQ_TYPE_LABEL[problem.type]}
        </span>
        <span className="text-sm text-slate-500">
          Aciertos: <strong className="text-amber-700">{score.correct}</strong>/{score.total}
        </span>
      </div>

      {/* Equation display */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Resuelve</p>
        <div className="text-4xl flex justify-center">
          <MathExpression formula={problem.equationLatex} displayMode />
        </div>
      </div>

      {/* Answer inputs */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
        <p className="text-sm font-medium text-slate-600 text-center">Introduce las raíces</p>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* x1 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              <MathExpression formula="x_1 =" />
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={ans1}
              onChange={(e) => { setAns1(e.target.value); setFeedback({ type: 'idle', message: '' }) }}
              placeholder="valor"
              disabled={noReal || showSolution}
              className={cn(
                'w-24 h-11 text-center font-bold text-lg border-2 rounded-xl bg-white outline-none transition-all',
                'focus:border-amber-500 border-slate-300 placeholder:text-slate-300',
                (noReal || showSolution) && 'opacity-40',
              )}
            />
          </div>

          {/* x2 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              <MathExpression formula="x_2 =" />
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={ans2}
              onChange={(e) => { setAns2(e.target.value); setFeedback({ type: 'idle', message: '' }) }}
              placeholder="valor"
              disabled={noReal || showSolution}
              className={cn(
                'w-24 h-11 text-center font-bold text-lg border-2 rounded-xl bg-white outline-none transition-all',
                'focus:border-amber-500 border-slate-300 placeholder:text-slate-300',
                (noReal || showSolution) && 'opacity-40',
              )}
            />
          </div>
        </div>

        {/* No real roots toggle */}
        <label className="flex items-center justify-center gap-3 cursor-pointer select-none mt-2">
          <div
            onClick={() => !showSolution && setNoReal((n) => !n)}
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
              noReal ? 'bg-rose-600 border-rose-600' : 'border-slate-300 bg-white',
              showSolution && 'opacity-40 cursor-default',
            )}
          >
            {noReal && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <span className="text-sm text-slate-600">Sin raíces reales (Δ &lt; 0)</span>
        </label>
      </div>

      <FeedbackPanel feedback={feedback} />

      {/* Solution steps */}
      {showSolution && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 animate-slide-up">
          <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Solución paso a paso</h4>
          {problem.solutionSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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
        {!showSolution ? (
          <Button onClick={handleCheck} size="lg" className="flex-1 bg-amber-600 hover:bg-amber-700">
            Verificar
          </Button>
        ) : (
          <Button onClick={() => newProblem()} size="lg" variant="success" className="flex-1">
            Siguiente ejercicio →
          </Button>
        )}
        <Button onClick={() => newProblem()} size="lg" variant="secondary">
          Nueva ecuación
        </Button>
      </div>

      {/* Reference */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
        <strong>Tipos de ecuaciones cuadráticas:</strong>
        <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs">
          <li><strong>Completa:</strong> ax² + bx + c = 0 → usa la fórmula cuadrática</li>
          <li><strong>Incompleta tipo 1:</strong> ax² + c = 0 → despeja x² = −c/a, x = ±√</li>
          <li><strong>Incompleta tipo 2:</strong> ax² + bx = 0 → factoriza x(ax + b) = 0</li>
        </ul>
      </div>
    </div>
  )
}
