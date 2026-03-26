import { useState, useEffect } from 'react'
import { MathExpression } from '@/components/shared/MathExpression'
import { FeedbackPanel } from '@/components/shared/FeedbackPanel'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { FeedbackState } from '@/types/module.types'
import { validateAnswer, factorLatex, type FactorizationChallenge } from './factorization.logic'

interface Props {
  challenge: FactorizationChallenge
  onCorrect: () => void
}

interface FieldValues { p: string; q: string; r: string; s: string }
type FieldKey = keyof FieldValues

export function FactorizationPuzzle({ challenge, onCorrect }: Props) {
  const isNonMonic = challenge.a !== 1

  const [fields, setFields] = useState<FieldValues>({ p: '', q: '', r: '1', s: '1' })
  const [feedback, setFeedback] = useState<FeedbackState>({ type: 'idle', message: '' })
  const [checked, setChecked]   = useState(false)
  const [hints, setHints]       = useState<string[]>([])

  useEffect(() => {
    setFields({ p: '', q: '', r: '1', s: '1' })
    setFeedback({ type: 'idle', message: '' })
    setChecked(false)
    setHints([])
  }, [challenge])

  const set = (key: FieldKey, val: string) => {
    if (val === '' || val === '-' || /^-?\d+$/.test(val)) {
      setFields((f) => ({ ...f, [key]: val }))
      setFeedback({ type: 'idle', message: '' })
    }
  }

  const handleCheck = () => {
    const p = parseInt(fields.p)
    const q = parseInt(fields.q)
    const r = parseInt(fields.r)
    const s = parseInt(fields.s)
    if ([p, q].some(isNaN)) {
      setFeedback({ type: 'info', message: 'Completa los campos antes de verificar.' })
      return
    }
    const correct = validateAnswer({ p, q, r, s }, challenge)
    setChecked(true)
    if (correct) {
      setFeedback({ type: 'success', message: '¡Factorización correcta!' })
      onCorrect()
    } else {
      const { b, c } = challenge
      const newHints: string[] = []
      if (!isNonMonic) {
        newHints.push(`Necesitas dos números cuya suma sea ${b} y cuyo producto sea ${c}.`)
        if (!isNaN(p) && !isNaN(q)) {
          newHints.push(`Tu suma: ${p} + ${q} = ${p + q} (necesitas ${b})   ·   Tu producto: ${p} × ${q} = ${p * q} (necesitas ${c})`)
        }
      } else {
        newHints.push(`La expansión de tu respuesta da ${r * s}x² + ${r * q + s * p}x + ${p * q}, pero el polinomio es ${challenge.a}x² + ${b}x + ${c}.`)
      }
      setHints(newHints)
      setFeedback({ type: 'error', message: 'Factorización incorrecta. Lee las pistas.' })
    }
  }

  // ── Live preview ─────────────────────────────────────────────────────────
  const pNum = parseInt(fields.p)
  const qNum = parseInt(fields.q)
  const rNum = isNaN(parseInt(fields.r)) ? 1 : parseInt(fields.r)
  const sNum = isNaN(parseInt(fields.s)) ? 1 : parseInt(fields.s)
  const hasPreview = !isNaN(pNum) && !isNaN(qNum)

  let previewLatex = ''
  if (hasPreview) {
    const pA = rNum * sNum
    const pB = rNum * qNum + sNum * pNum
    const pC = pNum * qNum
    const aStr = pA === 1 ? '' : pA === -1 ? '-' : `${pA}`
    const bStr = pB === 0 ? '' : pB === 1 ? '+x' : pB === -1 ? '-x' : pB > 0 ? `+${pB}x` : `${pB}x`
    const cStr = pC === 0 ? '' : pC > 0 ? `+${pC}` : `${pC}`
    previewLatex = `${aStr}x^{2}${bStr}${cStr}`
  }

  const previewMatches = hasPreview && (() => {
    const pA = rNum * sNum
    const pB = rNum * qNum + sNum * pNum
    const pC = pNum * qNum
    return pA === challenge.a && pB === challenge.b && pC === challenge.c
  })()

  return (
    <div className="space-y-6">
      {/* Expression */}
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-3">Factoriza</p>
        <div className="text-5xl font-bold flex justify-center">
          <MathExpression formula={challenge.latex} displayMode />
        </div>
      </div>

      {/* Factor inputs */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="text-2xl font-medium text-slate-500">=</span>

        {/* Factor 1 */}
        <div className="flex items-center bg-white border-2 border-violet-300 rounded-xl px-4 py-3 gap-2 shadow-sm">
          {isNonMonic && (
            <>
              <NumberInput value={fields.r} onChange={(v) => set('r', v)} placeholder="r" />
            </>
          )}
          <span className="text-slate-700 font-semibold text-lg">{isNonMonic ? 'x + ' : 'x + '}</span>
          <NumberInput value={fields.p} onChange={(v) => set('p', v)} placeholder="?" />
        </div>

        <span className="text-2xl text-slate-400">·</span>

        {/* Factor 2 */}
        <div className="flex items-center bg-white border-2 border-violet-300 rounded-xl px-4 py-3 gap-2 shadow-sm">
          {isNonMonic && (
            <NumberInput value={fields.s} onChange={(v) => set('s', v)} placeholder="s" />
          )}
          <span className="text-slate-700 font-semibold text-lg">{isNonMonic ? 'x + ' : 'x + '}</span>
          <NumberInput value={fields.q} onChange={(v) => set('q', v)} placeholder="?" />
        </div>
      </div>

      {/* Live preview */}
      <div className="bg-slate-50 rounded-xl px-4 py-4 text-center border border-slate-200 min-h-[80px] flex flex-col items-center justify-center">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide block mb-2">
          Vista previa (expandido)
        </span>
        {hasPreview ? (
          <>
            <div className="text-2xl flex justify-center">
              <MathExpression formula={previewLatex} displayMode />
            </div>
            <span className={cn(
              'text-xs font-semibold mt-2 block',
              previewMatches ? 'text-emerald-600' : 'text-rose-500',
            )}>
              {previewMatches ? '✓ Coincide con el polinomio original' : '✗ No coincide aún'}
            </span>
          </>
        ) : (
          <p className="text-slate-400 text-sm italic">Completa los campos para ver la expansión...</p>
        )}
      </div>

      {/* Hints */}
      {hints.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          {hints.map((h, i) => <p key={i} className="text-sm text-amber-800">💡 {h}</p>)}
        </div>
      )}

      <FeedbackPanel feedback={feedback} />

      {/* Correct reveal */}
      {checked && feedback.type === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-emerald-700 text-sm font-medium mb-2">Factorización correcta:</p>
          <div className="text-2xl flex justify-center">
            <MathExpression
              formula={`${challenge.latex} = ${factorLatex(challenge.r, challenge.p)} \\cdot ${factorLatex(challenge.s, challenge.q)}`}
              displayMode
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleCheck}
        size="lg"
        fullWidth
        disabled={checked && feedback.type === 'success'}
      >
        Verificar
      </Button>
    </div>
  )
}

function NumberInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-14 h-11 text-center font-bold text-xl border-b-2 border-violet-300 bg-transparent outline-none focus:border-violet-600 transition-colors placeholder:text-slate-300 text-violet-800"
    />
  )
}
