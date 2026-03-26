import { useState, useCallback, useRef } from 'react'
import { ModuleHeader } from '@/components/shared/ModuleHeader'
import { FeedbackPanel } from '@/components/shared/FeedbackPanel'
import { MathExpression } from '@/components/shared/MathExpression'
import { MatchingGame } from '@/components/shared/MatchingGame'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { DifficultyLevel, FeedbackState } from '@/types/module.types'
import { generateChallenge, validateAnswer, type NumberLineChallenge } from './numberLine.logic'
import { NumberLineCanvas } from './NumberLineCanvas'
import {
  generateIntervalGame, generateRadicalGame, generateIrrationalOp,
  type MatchingGameData, type IrrationalOpChallenge,
} from './numberLineGames.logic'

type GameTab = 'recta' | 'intervalos' | 'radicales' | 'irracionales'

const TAB_LABELS: Record<GameTab, string> = {
  recta:       'Recta Numérica',
  intervalos:  'Intervalos',
  radicales:   'Simplifica Radicales',
  irracionales:'Operaciones Irracionales',
}

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

// ─── Number Line Tab ──────────────────────────────────────────────────────────

function NumberLineTab() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('basico')
  const [challenge, setChallenge]   = useState<NumberLineChallenge>(() => generateChallenge('basico'))
  const [placedValue, setPlacedValue]   = useState<number | null>(null)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>({ type: 'idle', message: '' })
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const recentLabels = useRef<string[]>([])

  const newChallenge = useCallback((diff = difficulty) => {
    let ch: NumberLineChallenge
    let attempts = 0
    do {
      ch = generateChallenge(diff)
      attempts++
    } while (recentLabels.current.includes(ch.latexLabel) && attempts < 15)
    recentLabels.current = [ch.latexLabel, ...recentLabels.current].slice(0, 4)
    setChallenge(ch)
    setPlacedValue(null)
    setRevealAnswer(false)
    setFeedback({ type: 'idle', message: '' })
  }, [difficulty])

  const handleCheck = () => {
    if (placedValue === null) {
      setFeedback({ type: 'info', message: 'Haz clic en la recta para ubicar el número primero.' })
      return
    }
    const correct = validateAnswer(placedValue, challenge)
    setRevealAnswer(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setFeedback(
      correct
        ? { type: 'success', message: `¡Correcto! Ubicaste ${challenge.displayLabel} con precisión.` }
        : { type: 'error', message: `Casi. La posición correcta de ${challenge.displayLabel} ≈ ${challenge.target.toFixed(3)} se muestra en verde.` },
    )
  }

  const handleDifficultyChange = (d: DifficultyLevel) => {
    setDifficulty(d)
    newChallenge(d)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
          {(['basico', 'intermedio', 'avanzado'] as DifficultyLevel[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                difficulty === d ? 'bg-brand-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-xl border border-slate-200 px-4 py-2 shadow-sm">
          <span>Aciertos:</span>
          <span className="font-bold text-brand-700">{score.correct}</span>
          <span className="text-slate-400">/</span>
          <span className="font-medium">{score.total}</span>
        </div>
      </div>

      {/* Challenge display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="text-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Ubica en la recta</p>
          <div className="mt-2 text-5xl font-bold text-brand-800">
            <MathExpression formula={challenge.latexLabel} displayMode />
          </div>
          <p className="mt-1 text-slate-400 text-sm">
            Rango: [{challenge.rangeMin}, {challenge.rangeMax}]
            &nbsp;·&nbsp;Tolerancia: ±{challenge.tolerance.toFixed(2)}
          </p>
        </div>
        <NumberLineCanvas
          challenge={challenge}
          placedValue={placedValue}
          revealAnswer={revealAnswer}
          onPlace={setPlacedValue}
        />
        {placedValue !== null && !revealAnswer && (
          <p className="text-center text-sm text-slate-600">
            Posición elegida: <span className="font-mono font-semibold text-brand-700">{placedValue.toFixed(3)}</span>
          </p>
        )}
      </div>

      <FeedbackPanel feedback={feedback} />

      <div className="flex gap-3 flex-wrap">
        {!revealAnswer ? (
          <Button onClick={handleCheck} size="lg" disabled={placedValue === null} className="flex-1 sm:flex-none">
            Verificar respuesta
          </Button>
        ) : (
          <Button onClick={() => newChallenge()} size="lg" variant="success" className="flex-1 sm:flex-none">
            Siguiente →
          </Button>
        )}
        <Button onClick={() => newChallenge()} size="lg" variant="secondary">Nuevo número</Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Instrucciones:</strong> Observa el número y haz clic en la recta para ubicarlo.
        El marcador verde muestra la posición exacta.
      </div>
    </div>
  )
}

// ─── Interval Matching Tab ────────────────────────────────────────────────────

function IntervalTab() {
  const [game, setGame] = useState<MatchingGameData>(() => generateIntervalGame())
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const newGame = () => {
    setGame(generateIntervalGame())
    setCompleted(false)
  }

  const handleComplete = (errors: number) => {
    setCompleted(true)
    setScore((s) => ({ correct: s.correct + (errors === 0 ? 1 : 0), total: s.total + 1 }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Empareja cada intervalo con su notación de desigualdad.
        </p>
        <span className="text-sm text-slate-500">
          Perfectos: <strong className="text-blue-700">{score.correct}</strong>/{score.total}
        </span>
      </div>

      <MatchingGame
        leftItems={game.leftItems}
        rightItems={game.rightItems}
        correctPairs={game.correctPairs}
        onComplete={handleComplete}
        leftHeader="Notación de intervalo"
        rightHeader="Notación de desigualdad"
      />

      {completed && (
        <Button onClick={newGame} size="lg" variant="success" className="w-full">
          Nuevo juego →
        </Button>
      )}
      {!completed && (
        <Button onClick={newGame} size="lg" variant="secondary" className="w-full">
          Nuevo juego
        </Button>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Tipos de intervalos:</strong>
        <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs">
          <li><code>(a, b)</code> — abierto en ambos extremos: a &lt; x &lt; b</li>
          <li><code>[a, b]</code> — cerrado en ambos extremos: a ≤ x ≤ b</li>
          <li><code>[a, +∞)</code> — semirrecta derecha cerrada: x ≥ a</li>
          <li><code>(−∞, b)</code> — semirrecta izquierda abierta: x &lt; b</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Radical Simplification Tab ───────────────────────────────────────────────

function RadicalesTab() {
  const [game, setGame]       = useState<MatchingGameData>(() => generateRadicalGame())
  const [completed, setCompleted] = useState(false)
  const [score, setScore]     = useState({ correct: 0, total: 0 })

  const newGame = () => {
    setGame(generateRadicalGame())
    setCompleted(false)
  }

  const handleComplete = (errors: number) => {
    setCompleted(true)
    setScore((s) => ({ correct: s.correct + (errors === 0 ? 1 : 0), total: s.total + 1 }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Empareja cada radical con su forma simplificada.
        </p>
        <span className="text-sm text-slate-500">
          Perfectos: <strong className="text-blue-700">{score.correct}</strong>/{score.total}
        </span>
      </div>

      <MatchingGame
        leftItems={game.leftItems}
        rightItems={game.rightItems}
        correctPairs={game.correctPairs}
        onComplete={handleComplete}
        leftHeader="Radical"
        rightHeader="Forma simplificada"
      />

      {completed && (
        <Button onClick={newGame} size="lg" variant="success" className="w-full">
          Nuevo juego →
        </Button>
      )}
      {!completed && (
        <Button onClick={newGame} size="lg" variant="secondary" className="w-full">
          Nuevo juego
        </Button>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Proceso:</strong> Para simplificar √n, busca el mayor cuadrado perfecto que divide a n.
        Ejemplo: √12 = √(4·3) = 2√3.
      </div>
    </div>
  )
}

// ─── Irrational Operations Tab ────────────────────────────────────────────────

function IrracionalesTab() {
  const [challenge, setChallenge] = useState<IrrationalOpChallenge>(() => generateIrrationalOp())
  const [selected, setSelected]   = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [showHint, setShowHint]   = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [score, setScore]         = useState({ correct: 0, total: 0 })

  const newChallenge = () => {
    setChallenge(generateIrrationalOp())
    setSelected(null)
    setConfirmed(false)
    setShowHint(false)
    setShowSolution(false)
  }

  const handleCheck = () => {
    if (selected === null) return
    const correct = selected === challenge.correctIndex
    setConfirmed(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  return (
    <div className="space-y-6">
      {/* Score + buttons */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-slate-500">
          Aciertos: <strong className="text-blue-700">{score.correct}</strong>/{score.total}
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowHint((h) => !h)}>
            {showHint ? 'Ocultar pista' : '💡 Pista'}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowSolution((s) => !s)} disabled={!confirmed}>
            {showSolution ? 'Ocultar' : 'Ver solución'}
          </Button>
        </div>
      </div>

      {/* Hint — hidden by default */}
      {showHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 animate-slide-up">
          💡 {challenge.hint}
        </div>
      )}

      {/* Expression */}
      <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Calcula</p>
        <div className="text-3xl flex justify-center">
          <MathExpression formula={challenge.expressionLatex} displayMode />
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {challenge.options.map((opt, i) => {
          const isCorrect = i === challenge.correctIndex
          const isSelected = i === selected

          let cls = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
          if (confirmed) {
            if (isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-800'
            else if (isSelected) cls = 'bg-red-50 border-red-400 text-red-700'
            else cls = 'bg-white border-slate-200 opacity-50'
          } else if (isSelected) {
            cls = 'bg-blue-100 border-blue-500 shadow-md'
          }

          return (
            <button
              key={i}
              onClick={() => !confirmed && setSelected(i)}
              disabled={confirmed}
              className={cn(
                'w-full min-h-[60px] px-3 py-3 rounded-xl border-2 text-center transition-all font-medium text-sm flex items-center justify-center',
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

      {/* Solution reveal */}
      {confirmed && showSolution && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 animate-slide-up">
          <p className="text-sm font-semibold text-slate-600 mb-2">Solución:</p>
          <div className="flex justify-center text-xl">
            <MathExpression formula={challenge.expressionLatex + ' = ' + challenge.solutionLatex} displayMode />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!confirmed ? (
          <Button onClick={handleCheck} size="lg" disabled={selected === null} className="flex-1">
            Verificar
          </Button>
        ) : (
          <Button onClick={newChallenge} size="lg" variant="success" className="flex-1">
            Siguiente →
          </Button>
        )}
        <Button onClick={newChallenge} size="lg" variant="secondary">Nuevo</Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Propiedades clave:</strong>
        <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs">
          <li>Radicales semejantes: a√n ± b√n = (a±b)√n</li>
          <li>Producto: √a · √b = √(a·b)</li>
          <li>Potencia: (a√n)² = a²·n</li>
          <li>División: √a / √b = √(a/b)</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Main Module ──────────────────────────────────────────────────────────────

export function NumberLineModule() {
  const [activeTab, setActiveTab] = useState<GameTab>('recta')

  return (
    <div className="animate-fade-in">
      <ModuleHeader
        title="Recta Numérica"
        description="Ubica números, explora intervalos, simplifica radicales y opera con irracionales"
        icon="↔"
        color="blue"
        onReset={() => {}}
      />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Tab selector */}
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl">
          {(Object.keys(TAB_LABELS) as GameTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                'flex-1 min-w-[120px] px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                activeTab === t
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'recta'        && <NumberLineTab />}
        {activeTab === 'intervalos'   && <IntervalTab />}
        {activeTab === 'radicales'    && <RadicalesTab />}
        {activeTab === 'irracionales' && <IrracionalesTab />}
      </div>
    </div>
  )
}
