import { useState } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import { MathExpression } from '@/components/shared/MathExpression'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/math.utils'
import { cn } from '@/lib/cn'
import {
  type ConicType,
  type CircleParams, type ParabolaParams, type EllipseParams, type HyperbolaParams,
  circleEquationLatex, parabolaEquationLatex, ellipseEquationLatex, hyperbolaEquationLatex,
  circleProperties, parabolaProperties, ellipseProperties, hyperbolaProperties,
} from './conicSections.logic'
import { ConicGraph } from './ConicGraph'
import { ConicExercisePanel } from './ConicExercise'

type Mode = 'explorar' | 'ejercicios'

const CONIC_LABELS: Record<ConicType, string> = {
  circle: 'Circunferencia', parabola: 'Parábola', ellipse: 'Elipse', hyperbola: 'Hipérbola',
}

export function ConicSectionsModule() {
  const [mode, setMode] = useState<Mode>('explorar')
  const [type, setType] = useState<ConicType>('circle')
  const [zoom, setZoom] = useState(1)

  const [ch, setCh] = useState(0); const [ck, setCk] = useState(0); const [cr, setCr] = useState(3)
  const [ph, setPh] = useState(0); const [pk, setPk] = useState(0); const [pa, setPa] = useState(0.4); const [pVert, setPVert] = useState(true)
  const [eh, setEh] = useState(0); const [ek, setEk] = useState(0); const [ea, setEa] = useState(4); const [eb, setEb] = useState(2.5)
  const [hyh, setHyh] = useState(0); const [hyk, setHyk] = useState(0); const [hya, setHya] = useState(2.5); const [hyb, setHyb] = useState(1.5); const [hyHoriz, setHyHoriz] = useState(true)

  const circleP:   CircleParams    = { h: ch, k: ck, r: cr }
  const parabolaP: ParabolaParams  = { h: ph, k: pk, a: pa, vertical: pVert }
  const ellipseP:  EllipseParams   = { h: eh, k: ek, a: ea, b: eb }
  const hyperP:    HyperbolaParams = { h: hyh, k: hyk, a: hya, b: hyb, horizontal: hyHoriz }

  const equation = {
    circle:    circleEquationLatex(circleP),
    parabola:  parabolaEquationLatex(parabolaP),
    ellipse:   ellipseEquationLatex(ellipseP),
    hyperbola: hyperbolaEquationLatex(hyperP),
  }[type]

  const properties = {
    circle:    circleProperties(circleP),
    parabola:  parabolaProperties(parabolaP),
    ellipse:   ellipseProperties(ellipseP),
    hyperbola: hyperbolaProperties(hyperP),
  }[type]

  const reset = () => {
    setCh(0); setCk(0); setCr(3)
    setPh(0); setPk(0); setPa(0.4); setPVert(true)
    setEh(0); setEk(0); setEa(4); setEb(2.5)
    setHyh(0); setHyk(0); setHya(2.5); setHyb(1.5); setHyHoriz(true)
    setZoom(1)
  }

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="Curvas Cónicas"
        description="Explora circunferencia, parábola, elipse e hipérbola de forma dinámica"
        icon="○"
        color="rose"
        onReset={reset}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top controls row: conic selector + mode toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Conic type selector */}
          <div className="flex flex-wrap gap-2">
            {(['circle', 'parabola', 'ellipse', 'hyperbola'] as ConicType[]).map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  type === t
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-700'
                }`}
              >
                {CONIC_LABELS[t]}
              </button>
            ))}
          </div>
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['explorar', 'ejercicios'] as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all',
                  mode === m ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {m === 'explorar' ? '📐 Explorar' : '✏️ Ejercicios'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Ejercicios mode ─────────────────────────────────────────── */}
        {mode === 'ejercicios' && (
          <div className="max-w-2xl mx-auto">
            <ConicExercisePanel key={type} conicType={type} />
          </div>
        )}

        {/* ── Explorar mode ───────────────────────────────────────────── */}
        {mode === 'explorar' && (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Graph ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3">
            {/* Zoom controls */}
            <div className="flex items-center gap-3 justify-end">
              <span className="text-xs text-slate-500 font-medium">Zoom:</span>
              {[0.5, 1, 1.5, 2, 3].map((z) => (
                <button key={z} onClick={() => setZoom(z)}
                  className={`w-9 h-7 rounded text-xs font-semibold border transition-all ${
                    zoom === z ? 'bg-rose-700 text-white border-rose-700' : 'border-slate-200 text-slate-500 hover:border-rose-400 bg-white'
                  }`}
                >
                  {z}×
                </button>
              ))}
            </div>

            <div className="graph-container p-2">
              <ConicGraph
                type={type}
                zoom={zoom}
                circle={type === 'circle' ? circleP : undefined}
                parabola={type === 'parabola' ? parabolaP : undefined}
                ellipse={type === 'ellipse' ? ellipseP : undefined}
                hyperbola={type === 'hyperbola' ? hyperP : undefined}
              />
            </div>

            {/* Equation */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Ecuación</p>
              <div className="flex justify-center">
                <MathExpression formula={equation} displayMode />
              </div>
            </div>

            {/* Properties */}
            <div className="grid grid-cols-2 gap-3">
              {properties.map((prop, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                  <p className="text-sm text-slate-600">{prop}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Controls ───────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {CONIC_LABELS[type]} — Parámetros
              </h3>

              {type === 'circle' && (
                <>
                  <Slider label="h — centro x" value={ch} min={-4} max={4} step={0.5} displayValue={fmt(ch,1)} onChange={setCh} accentColor="text-rose-700" />
                  <Slider label="k — centro y" value={ck} min={-4} max={4} step={0.5} displayValue={fmt(ck,1)} onChange={setCk} accentColor="text-rose-700" />
                  <Slider label="r — radio"    value={cr} min={0.5} max={5} step={0.25} displayValue={fmt(cr,2)} onChange={setCr} accentColor="text-rose-700" />
                </>
              )}

              {type === 'parabola' && (
                <>
                  <Slider label="h — vértice x" value={ph} min={-4} max={4} step={0.5} displayValue={fmt(ph,1)} onChange={setPh} accentColor="text-rose-700" />
                  <Slider label="k — vértice y" value={pk} min={-4} max={4} step={0.5} displayValue={fmt(pk,1)} onChange={setPk} accentColor="text-rose-700" />
                  <Slider label="a — apertura"  value={pa} min={-2} max={2} step={0.1} displayValue={fmt(pa,2)} onChange={setPa} accentColor="text-rose-700" />
                  <div className="flex gap-2">
                    {[true, false].map((v) => (
                      <button key={String(v)} onClick={() => setPVert(v)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${pVert === v ? 'bg-rose-700 text-white border-rose-700' : 'border-slate-200 text-slate-500 hover:border-rose-300'}`}>
                        {v ? 'Vertical' : 'Horizontal'}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {type === 'ellipse' && (
                <>
                  <Slider label="h — centro x"  value={eh} min={-3} max={3} step={0.5} displayValue={fmt(eh,1)} onChange={setEh} accentColor="text-rose-700" />
                  <Slider label="k — centro y"  value={ek} min={-3} max={3} step={0.5} displayValue={fmt(ek,1)} onChange={setEk} accentColor="text-rose-700" />
                  <Slider label="a — semieje x" value={ea} min={0.5} max={5.5} step={0.25} displayValue={fmt(ea,2)} onChange={setEa} accentColor="text-rose-700" />
                  <Slider label="b — semieje y" value={eb} min={0.5} max={4.5} step={0.25} displayValue={fmt(eb,2)} onChange={setEb} accentColor="text-rose-700" />
                  {Math.abs(ea - eb) < 0.15 && (
                    <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                      💡 a ≈ b → la elipse se aproxima a una circunferencia
                    </p>
                  )}
                </>
              )}

              {type === 'hyperbola' && (
                <>
                  <Slider label="h — centro x" value={hyh} min={-3} max={3} step={0.5} displayValue={fmt(hyh,1)} onChange={setHyh} accentColor="text-rose-700" />
                  <Slider label="k — centro y" value={hyk} min={-3} max={3} step={0.5} displayValue={fmt(hyk,1)} onChange={setHyk} accentColor="text-rose-700" />
                  <Slider label="a — semieje transversal" value={hya} min={0.5} max={4} step={0.25} displayValue={fmt(hya,2)} onChange={setHya} accentColor="text-rose-700" />
                  <Slider label="b — semieje conjugado"   value={hyb} min={0.5} max={4} step={0.25} displayValue={fmt(hyb,2)} onChange={setHyb} accentColor="text-rose-700" />
                  <div className="flex gap-2">
                    {[true, false].map((v) => (
                      <button key={String(v)} onClick={() => setHyHoriz(v)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${hyHoriz === v ? 'bg-rose-700 text-white border-rose-700' : 'border-slate-200 text-slate-500 hover:border-rose-300'}`}>
                        {v ? 'Horizontal' : 'Vertical'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm text-xs text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2"><div className="w-5 h-0.5 bg-blue-600" /><span>Curva cónica</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span>Centro / Vértice</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span>Focos</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-violet-600" /><span>Extremos del eje</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-0.5 bg-green-600" style={{ borderTop: '1.5px dashed' }} /><span>Directriz / Asíntotas</span></div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm text-rose-800">
              Usa los botones de zoom para acercar o alejar la vista. Los sliders modifican los parámetros geométricos en tiempo real.
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
