import { useState } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import { MathExpression } from '@/components/shared/MathExpression'
import { Slider } from '@/components/ui/Slider'
import { fmt, formatPi } from '@/lib/math.utils'
import { buildLatex, getProperties, type TrigParams, type TrigType } from './trigFunctions.logic'
import { WaveGraph } from './WaveGraph'

const TYPE_LABELS: Record<TrigType, string> = { sin: 'Seno', cos: 'Coseno', tan: 'Tangente' }

export function TrigFunctionsModule() {
  const [params, setParams] = useState<TrigParams>({ type: 'sin', A: 1, B: 1, C: 0, D: 0 })
  const [zoom, setZoom] = useState(1)

  const set = <K extends keyof TrigParams>(key: K, val: TrigParams[K]) =>
    setParams((p) => ({ ...p, [key]: val }))

  const equationLatex = buildLatex(params)
  const properties    = getProperties(params)

  const reset = () => { setParams({ type: 'sin', A: 1, B: 1, C: 0, D: 0 }); setZoom(1) }

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="Funciones Trigonométricas"
        description="Controla amplitud, período, fase y desplazamiento de funciones de onda"
        icon="∿"
        color="cyan"
        onReset={reset}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Graph ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3">
            {/* Zoom controls */}
            <div className="flex items-center gap-3 justify-end">
              <span className="text-xs text-slate-500 font-medium">Zoom:</span>
              {[0.5, 1, 1.5, 2, 3].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`w-9 h-7 rounded text-xs font-semibold border transition-all ${
                    zoom === z ? 'bg-cyan-600 text-white border-cyan-600' : 'border-slate-200 text-slate-500 hover:border-cyan-400 bg-white'
                  }`}
                >
                  {z}×
                </button>
              ))}
            </div>

            <div className="graph-container p-2">
              <WaveGraph params={params} zoom={zoom} />
            </div>

            {/* Equation */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Ecuación</p>
              <div className="text-xl flex justify-center">
                <MathExpression formula={equationLatex} displayMode />
              </div>
            </div>

            {/* Properties grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {properties.slice(0, 6).map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm text-center">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-lg font-bold text-cyan-700 mt-1 font-mono">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Controls ──────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Function type */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Función</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['sin', 'cos', 'tan'] as TrigType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => set('type', t)}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      params.type === t
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700'
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Parámetros</h3>
              <Slider label="A — Amplitud" value={params.A} min={-4} max={4} step={0.1}
                displayValue={fmt(params.A, 1)} onChange={(v) => set('A', v)} accentColor="text-cyan-700" />
              <Slider label="B — Frecuencia" value={params.B} min={0.1} max={4} step={0.1}
                displayValue={fmt(params.B, 1)} onChange={(v) => set('B', v)} accentColor="text-cyan-700" />
              <Slider label="C — Fase (rad)" value={params.C} min={-Math.PI} max={Math.PI} step={0.05}
                displayValue={formatPi(params.C)} onChange={(v) => set('C', v)} accentColor="text-cyan-700" />
              <Slider label="D — Desplaz. vertical" value={params.D} min={-4} max={4} step={0.1}
                displayValue={fmt(params.D, 1)} onChange={(v) => set('D', v)} accentColor="text-cyan-700" />
            </div>

            {/* Reference */}
            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 text-sm text-cyan-800 space-y-2">
              <p className="font-semibold">Forma general:</p>
              <div className="flex justify-center">
                <MathExpression formula="y = A \\cdot f(Bx + C) + D" displayMode />
              </div>
              <ul className="text-xs space-y-0.5 text-cyan-700">
                <li><strong>A:</strong> amplitud — escala vertical</li>
                <li><strong>B:</strong> frecuencia — T = 2π / |B|</li>
                <li><strong>C:</strong> desfase — traslación horizontal</li>
                <li><strong>D:</strong> desplazamiento vertical</li>
              </ul>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm text-xs text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2"><div className="w-5 h-0.5 bg-blue-600" /><span>Función f(x)</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-0.5 bg-amber-400 border-dashed" /><span>Desplazamiento D</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-0.5 bg-cyan-400" /><span>Líneas de amplitud</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
