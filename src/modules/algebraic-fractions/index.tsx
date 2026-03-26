import { useState } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import type { DifficultyLevel } from '@/types/module.types'
import { getProblemBank, type AlgebraicFractionProblem } from './algebraicFractions.logic'
import { FractionSimplifier } from './FractionSimplifier'

export function AlgebraicFractionsModule() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('basico')
  const [problemIndex, setProblemIndex] = useState(0)
  const [key, setKey] = useState(0)

  const problems = getProblemBank(difficulty)
  const problem: AlgebraicFractionProblem = problems[problemIndex % problems.length]

  const changeDifficulty = (d: DifficultyLevel) => {
    setDifficulty(d)
    setProblemIndex(0)
    setKey((k) => k + 1)
  }

  const nextProblem = () => {
    setProblemIndex((i) => (i + 1) % problems.length)
    setKey((k) => k + 1)
  }

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="Fracciones Algebraicas"
        description="Simplifica paso a paso factorizando numerador y denominador"
        icon="a⁄b"
        color="emerald"
        onReset={() => { setProblemIndex(0); setKey((k) => k + 1) }}
      />

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Difficulty */}
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {(['basico', 'intermedio', 'avanzado'] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                onClick={() => changeDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  difficulty === d
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Problem selector */}
          <div className="flex items-center gap-2">
            {problems.map((p, i) => (
              <button
                key={i}
                onClick={() => { setProblemIndex(i); setKey((k) => k + 1) }}
                title={p.title}
                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                  problemIndex % problems.length === i
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-emerald-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Problem card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <div className="mb-4 pb-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-lg">{problem.title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Problema {(problemIndex % problems.length) + 1} de {problems.length}
            </p>
          </div>
          <FractionSimplifier key={key} problem={problem} />
        </div>

        {/* Next problem */}
        <button
          onClick={nextProblem}
          className="w-full py-3 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-dashed border-emerald-300 transition-colors"
        >
          Ver siguiente problema →
        </button>

        {/* Instructions */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
          <strong>Instrucciones:</strong> Presiona <em>Comenzar</em> para revelar los pasos de simplificación
          uno a uno. Cada paso muestra la transformación algebraica y su justificación.
        </div>
      </div>
    </div>
  )
}
