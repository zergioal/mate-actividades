import { useState, useCallback } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import { FractionSimplifier } from '@/modules/algebraic-fractions/FractionSimplifier'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { getRandomOpProblem, type OpType, type FracOpProblem } from './fracOp.logic'

type Tab = OpType | 'all'

const TAB_LABELS: Record<Tab, string> = {
  all: 'Todas',
  add: 'Suma (+)',
  sub: 'Resta (−)',
  mul: 'Producto (×)',
  div: 'División (÷)',
}

const OP_COLOR: Record<Tab, string> = {
  all: 'bg-emerald-700 border-emerald-700',
  add: 'bg-blue-700 border-blue-700',
  sub: 'bg-violet-700 border-violet-700',
  mul: 'bg-amber-600 border-amber-600',
  div: 'bg-rose-700 border-rose-700',
}

const OP_SYMBOL: Record<Tab, string> = {
  all: '±×÷',
  add: '+',
  sub: '−',
  mul: '×',
  div: '÷',
}

export function FraccionesOperaciones() {
  const [tab, setTab]         = useState<Tab>('all')
  const [problem, setProblem] = useState<FracOpProblem>(() => getRandomOpProblem('all'))
  const [key, setKey]         = useState(0)   // force FractionSimplifier remount on new problem
  const [score, setScore]     = useState({ done: 0, total: 0 })

  const newProblem = useCallback((t: Tab = tab) => {
    setProblem(getRandomOpProblem(t === 'all' ? 'all' : t))
    setKey((k) => k + 1)
    setScore((s) => ({ ...s, total: s.total + 0 }))  // keep count
  }, [tab])

  const handleTabChange = (t: Tab) => {
    setTab(t)
    newProblem(t)
  }

  const handleComplete = () => {
    setScore((s) => ({ done: s.done + 1, total: s.total + 1 }))
  }

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="Operaciones con Fracciones Algebraicas"
        description="Suma, resta, multiplica y divide expresiones fraccionarias paso a paso"
        icon="÷"
        color="emerald"
        onReset={() => { setScore({ done: 0, total: 0 }); newProblem() }}
      />

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Op tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold border transition-all',
                tab === t
                  ? `${OP_COLOR[t]} text-white shadow`
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400',
              )}
            >
              <span className="font-mono mr-1">{OP_SYMBOL[t]}</span>{TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Score + problem info */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            {problem.opType === 'add' ? 'Suma'
              : problem.opType === 'sub' ? 'Resta'
              : problem.opType === 'mul' ? 'Multiplicación'
              : 'División'}
          </span>
          <span className="text-sm text-slate-500">
            Completados: <strong className="text-emerald-700">{score.done}</strong>
          </span>
        </div>

        {/* Problem title */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">{problem.title}</p>
        </div>

        {/* Simplifier (reused for step-by-step display) */}
        <FractionSimplifier key={key} problem={problem} onComplete={handleComplete} />

        {/* Next button */}
        <Button onClick={() => newProblem()} size="lg" variant="secondary" className="w-full">
          Otro ejercicio →
        </Button>

        {/* Reference */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
          <strong>Reglas clave:</strong>
          <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs">
            <li><strong>Suma/Resta:</strong> busca el MCM, amplifico y opera los numeradores</li>
            <li><strong>Multiplicación:</strong> factoriza, cancela factores comunes y multiplica</li>
            <li><strong>División:</strong> invierte la segunda fracción y multiplica</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
