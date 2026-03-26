import { useState } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import { cn } from '@/lib/cn'
import { CasePuzzle } from './CasePuzzle'
import { CASE_LABELS, type FactorizationCaseNumber } from './factorizationCases.logic'

const CASES: FactorizationCaseNumber[] = [1, 2, 3, 4, 5, 6, 7]

const CASE_DESC: Record<FactorizationCaseNumber, string> = {
  1: 'ax² + bx + c → k·xⁿ(…)',
  2: 'a² − b² → (a+b)(a−b)',
  3: 'a²±2ab+b² → (a±b)²',
  4: 'x²+bx+c → (x+p)(x+q)',
  5: 'ax²+bx+c → (rx+p)(sx+q)',
  6: 'a³±b³ → (a±b)(a²∓ab+b²)',
  7: 'ax+ay+bx+by → (a+b)(x+y)',
}

export function FactorizationModule() {
  const [activeCase, setActiveCase] = useState<FactorizationCaseNumber>(1)

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="Factorización"
        description="Los 7 casos de factorización algebraica — ejercicios infinitos"
        icon="×"
        color="violet"
        onReset={() => {}}
      />

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Case tabs — scrollable on mobile */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2 min-w-max">
            {CASES.map((n) => (
              <button
                key={n}
                onClick={() => setActiveCase(n)}
                className={cn(
                  'flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all text-left whitespace-nowrap',
                  activeCase === n
                    ? 'bg-violet-700 border-violet-700 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-violet-400',
                )}
              >
                <span className="text-xs font-bold uppercase tracking-wide opacity-80">Caso {n}</span>
                <span className="text-sm font-semibold mt-0.5">{CASE_LABELS[n]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Case description badge */}
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl font-bold text-violet-700 w-8 shrink-0">{activeCase}</span>
          <div>
            <p className="font-semibold text-violet-800 text-sm">{CASE_LABELS[activeCase]}</p>
            <p className="text-xs text-violet-600 font-mono mt-0.5">{CASE_DESC[activeCase]}</p>
          </div>
        </div>

        {/* Puzzle — remount on case change */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <CasePuzzle key={activeCase} caseNumber={activeCase} />
        </div>

        {/* Reference card */}
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-800">
          <strong>Los 7 casos:</strong>
          <ol className="mt-1 space-y-0.5 list-decimal list-inside text-xs">
            <li>Factor Común — saca el MFC de todos los términos</li>
            <li>Diferencia de Cuadrados — a²−b² = (a+b)(a−b)</li>
            <li>Cuadrado Perfecto — a²±2ab+b² = (a±b)²</li>
            <li>Trinomio Mónico — x²+bx+c = (x+p)(x+q)</li>
            <li>Trinomio No Mónico — ax²+bx+c = (rx+p)(sx+q)</li>
            <li>Suma/Diferencia de Cubos — a³±b³ = (a±b)(a²∓ab+b²)</li>
            <li>Agrupación — agrupa por pares de términos con factor común</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
