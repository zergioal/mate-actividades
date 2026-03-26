import type { DifficultyLevel } from '@/types/module.types'
import { randInt, pick } from '@/lib/math.utils'

export interface FactorizationChallenge {
  a: number     // leading coefficient (1 for basic/intermediate)
  b: number     // middle term coefficient
  c: number     // constant term
  p: number     // factor 1 inner constant  (ax² + bx + c = (rx + p)(sx + q))
  q: number     // factor 2 inner constant
  r: number     // factor 1 leading (= 1 when a = 1)
  s: number     // factor 2 leading (= 1 when a = 1)
  latex: string // LaTeX for the expression
}

/** Build a monic trinomial from roots p, q: (x - p)(x - q) = x² - (p+q)x + pq */
function monicFromRoots(p: number, q: number): FactorizationChallenge {
  const b = -(p + q)
  const c = p * q
  const latex = buildMonicLatex(b, c)
  // Store so that the factors are (x - p)(x - q)
  return { a: 1, b, c, p: -p, q: -q, r: 1, s: 1, latex }
}

function buildMonicLatex(b: number, c: number): string {
  const bTerm = b === 0 ? '' : b > 0 ? `+${b}x` : `${b}x`
  const cTerm = c === 0 ? '' : c > 0 ? `+${c}` : `${c}`
  return `x^2${bTerm}${cTerm}`
}

function basicChallenge(): FactorizationChallenge {
  // Both roots positive integers: (x + p)(x + q), p,q ∈ [1,7]
  const p = randInt(1, 7)
  const q = randInt(1, 7)
  return monicFromRoots(-p, -q)
}

function intermediateChallenge(): FactorizationChallenge {
  // Mixed sign roots
  const choices = [
    () => { const p = randInt(1, 8); const q = -randInt(1, 8); return monicFromRoots(-p, -q) },
    () => { const p = -randInt(1, 8); const q = randInt(1, 8); return monicFromRoots(-p, -q) },
  ]
  return pick(choices)()
}

function advancedChallenge(): FactorizationChallenge {
  // Non-monic: a ∈ {2, 3}, (rx + p)(sx + q)
  const a = pick([2, 3])
  const p = pick([-3, -2, -1, 1, 2, 3])
  const q = pick([-3, -2, -1, 1, 2, 3])

  // Split a as r*s where r,s > 0
  const [r, s] = a === 2 ? [2, 1] : [3, 1]

  const b = r * q + s * p
  const c = p * q
  const bTerm = b === 0 ? '' : b > 0 ? `+${b}x` : `${b}x`
  const cTerm = c === 0 ? '' : c > 0 ? `+${c}` : `${c}`
  const aStr  = a === 1 ? '' : String(a)
  const latex = `${aStr}x^2${bTerm}${cTerm}`

  return { a, b, c, p, q, r, s, latex }
}

export function generateChallenge(difficulty: DifficultyLevel): FactorizationChallenge {
  const gen = { basico: basicChallenge, intermedio: intermediateChallenge, avanzado: advancedChallenge }
  // Retry if b or c is 0 (trivial) — max 10 attempts
  for (let i = 0; i < 10; i++) {
    const ch = gen[difficulty]()
    if (ch.b !== 0 && ch.c !== 0) return ch
  }
  return gen[difficulty]()
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface FactorizationAnswer {
  p: number
  q: number
  r: number
  s: number
}

export function validateAnswer(ans: FactorizationAnswer, ch: FactorizationChallenge): boolean {
  // Check: (r*x + p)(s*x + q) expands to a*x² + b*x + c
  const a2 = ans.r * ans.s
  const b2 = ans.r * ans.q + ans.s * ans.p
  const c2 = ans.p * ans.q
  return a2 === ch.a && b2 === ch.b && c2 === ch.c
}

/** Format factor as LaTeX string, e.g. (x + 3) or (2x - 1) */
export function factorLatex(coeff: number, constant: number): string {
  const coeffStr = coeff === 1 ? '' : coeff === -1 ? '-' : `${coeff}`
  const sign      = constant >= 0 ? '+' : '-'
  const absConst  = Math.abs(constant)
  return `(${coeffStr}x ${sign} ${absConst})`
}
