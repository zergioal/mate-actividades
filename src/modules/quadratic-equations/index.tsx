import { useState, useMemo } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import { MathExpression } from '@/components/shared/MathExpression'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/math.utils'
import type { DifficultyLevel } from '@/types/module.types'
import { solveQuadratic, buildPolyLatex, discriminantLatex, formatRoot } from './quadratic.logic'
import { ParabolaGraph } from './ParabolaGraph'
import { SolveQuadratic } from './SolveQuadratic'

type Tab = 'explore' | 'solve'

export function QuadraticEquationsModule() {
  const [tab, setTab]         = useState<Tab>('explore')
  const [difficulty, setDiff] = useState<DifficultyLevel>('basico')
  const [a, setA] = useState(1)
  const [b, setB] = useState(-2)
  const [c, setC] = useState(-3)
  const [zoom, setZoom] = useState(1)

  const result          = useMemo(() => solveQuadratic(a, b, c), [a, b, c])
  const discLatex       = useMemo(() => discriminantLatex(a, b, c), [a, b, c])
  const fxLatex         = `f(x) = ${buildPolyLatex(a, b, c)}`

  const rootInfo = (() => {
    if (result.rootType === 'two-real' && result.roots.length === 2) {
      const [r1, r2] = result.roots as [number, number]
      return {
        label: 'Dos raíces reales distintas',
        cls: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        latex: `x_1 = ${formatRoot(r1)}, \\quad x_2 = ${formatRoot(r2)}`,
      }
    }
    if (result.rootType === 'one-real') {
      return {
        label: 'Raíz real doble',
        cls: 'text-amber-700 bg-amber-50 border-amber-200',
        latex: `x = ${formatRoot((result.roots as [number])[0])}`,
      }
    }
    return {
      label: 'Sin raíces reales (Δ < 0)',
      cls: 'text-rose-700 bg-rose-50 border-rose-200',
      latex: '\\text{No hay raíces reales}',
    }
  })()

  const reset = () => { setA(1); setB(-2); setC(-3); setZoom(1) }

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="Ecuaciones Cuadráticas"
        description="Explora la parábola o resuelve ecuaciones paso a paso"
        icon="∩"
        color="amber"
        onReset={reset}
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pt-2">
          {([['explore', 'Explorar gráfica'], ['solve', 'Resolver ecuaciones']] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                tab === t
                  ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Tab: Explore ─────────────────────────────────────────── */}
        {tab === 'explore' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph column */}
            <div className="lg:col-span-2 space-y-3">
              {/* Zoom controls */}
              <div className="flex items-center gap-3 justify-end">
                <span className="text-xs text-slate-500 font-medium">Zoom:</span>
                {[0.5, 1, 1.5, 2, 3].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoom(z)}
                    className={`w-9 h-7 rounded text-xs font-semibold border transition-all ${
                      zoom === z ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-200 text-slate-500 hover:border-amber-400 bg-white'
                    }`}
                  >
                    {z}×
                  </button>
                ))}
              </div>

              <div className="graph-container p-2">
                <ParabolaGraph a={a} b={b} c={c} zoom={zoom} />
              </div>

              {/* Equation display */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Función</p>
                <div className="text-2xl flex justify-center">
                  <MathExpression formula={fxLatex} displayMode />
                </div>
              </div>
            </div>

            {/* Controls column */}
            <div className="space-y-4">
              {/* Sliders */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Coeficientes</h3>
                <Slider label="a — coeficiente cuadrático" value={a} min={-4} max={4} step={0.5}
                  displayValue={fmt(a, 1)} onChange={setA} accentColor="text-amber-700" />
                <Slider label="b — coeficiente lineal" value={b} min={-10} max={10} step={0.5}
                  displayValue={fmt(b, 1)} onChange={setB} accentColor="text-amber-700" />
                <Slider label="c — término independiente" value={c} min={-10} max={10} step={0.5}
                  displayValue={fmt(c, 1)} onChange={setC} accentColor="text-amber-700" />
                {a === 0 && (
                  <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
                    ⚠ Con a = 0 no es una ecuación cuadrática.
                  </p>
                )}
              </div>

              {/* Discriminant */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Discriminante</h3>
                <div className="flex justify-center">
                  <MathExpression formula={discLatex} displayMode />
                </div>
                <div className={`mt-3 rounded-lg border px-3 py-2 text-sm font-medium ${rootInfo.cls}`}>
                  {rootInfo.label}
                </div>
              </div>

              {/* Roots */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Raíces</h3>
                <div className="flex justify-center">
                  <MathExpression formula={rootInfo.latex} displayMode />
                </div>
              </div>

              {/* Vertex */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-2">Vértice y simetría</h3>
                <div className="flex justify-center">
                  <MathExpression
                    formula={`V = \\left(${fmt(result.vertex.x, 2)},\\; ${fmt(result.vertex.y, 2)}\\right)`}
                    displayMode
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Eje: x = {fmt(result.vertex.x, 2)} ·{' '}
                  {a > 0 ? '↑ abierta hacia arriba' : a < 0 ? '↓ abierta hacia abajo' : ''}
                </p>
              </div>

              {/* Formula ref */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">Fórmula cuadrática:</p>
                <div className="flex justify-center">
                  <MathExpression formula="x = \\dfrac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}" displayMode />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Solve ───────────────────────────────────────────── */}
        {tab === 'solve' && (
          <div className="max-w-2xl mx-auto">
            {/* Difficulty selector */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm mb-6 w-fit mx-auto">
              {(['basico', 'intermedio', 'avanzado'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    difficulty === d
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
              <SolveQuadratic difficulty={difficulty} key={difficulty} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
