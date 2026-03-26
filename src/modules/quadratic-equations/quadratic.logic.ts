import { solveQuadratic, fmt, randInt, pick } from '@/lib/math.utils'
import type { DifficultyLevel } from '@/types/module.types'

export { solveQuadratic }
export type { QuadraticResult } from '@/lib/math.utils'

// ─── Equation LaTeX builder ───────────────────────────────────────────────────

/** Build a readable LaTeX string for ax² + bx + c */
export function buildPolyLatex(a: number, b: number, c: number): string {
  const aT = a === 1 ? 'x^{2}' : a === -1 ? '-x^{2}' : `${fmt(a, 2)}x^{2}`
  const bT = b === 0 ? '' : b === 1 ? '+x' : b === -1 ? '-x' : b > 0 ? `+${fmt(b, 2)}x` : `${fmt(b, 2)}x`
  const cT = c === 0 ? '' : c > 0 ? `+${fmt(c, 2)}` : `${fmt(c, 2)}`
  return `${aT}${bT}${cT}`
}

/** Build equation = 0 form */
export function buildEquationLatex(a: number, b: number, c: number): string {
  return `${buildPolyLatex(a, b, c)} = 0`
}

export function formatRoot(value: number): string {
  return fmt(Math.round(value * 1000) / 1000, 3)
}

export function discriminantLatex(a: number, b: number, c: number): string {
  const disc = b * b - 4 * a * c
  return `\\Delta = b^{2} - 4ac = (${b})^{2} - 4 \\cdot ${a} \\cdot (${c}) = ${fmt(disc, 2)}`
}

// ─── Solve activity problem types ────────────────────────────────────────────

export type EqType = 'complete' | 'incomplete1' | 'incomplete2'

export interface SolveProblem {
  a: number; b: number; c: number
  type: EqType
  roots: number[]
  hasRealRoots: boolean
  equationLatex: string
  solutionSteps: string[]   // LaTeX lines for the solution reveal
}

function completeProblem(a: number, r1: number, r2: number): SolveProblem {
  const b = -a * (r1 + r2)
  const c = a * r1 * r2
  const disc = b * b - 4 * a * c

  const steps: string[] = [
    `\\text{Ecuación: } ${buildEquationLatex(a, b, c)}`,
    `\\Delta = b^{2} - 4ac = (${b})^{2} - 4(${a})(${c}) = ${fmt(disc, 2)}`,
    `x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a} = \\dfrac{${-b} \\pm \\sqrt{${fmt(disc, 2)}}}{${2 * a}}`,
    `x_1 = ${fmt(r1, 4)}, \\quad x_2 = ${fmt(r2, 4)}`,
  ]

  return { a, b, c, type: 'complete', roots: [r1, r2], hasRealRoots: true, equationLatex: buildEquationLatex(a, b, c), solutionSteps: steps }
}

function incomplete1Problem(a: number, c: number): SolveProblem {
  // ax² + c = 0  →  x² = -c/a  →  x = ±√(-c/a)
  const rhs  = -c / a
  const root = Math.sqrt(rhs)
  const steps: string[] = [
    `\\text{Ecuación incompleta (sin término lineal): } ${a}x^{2} ${c > 0 ? '+' : ''}${c} = 0`,
    `${a}x^{2} = ${-c}`,
    `x^{2} = ${fmt(rhs, 4)}`,
    `x = \\pm\\sqrt{${fmt(rhs, 4)}} = \\pm ${fmt(root, 4)}`,
    `x_1 = ${fmt(root, 4)}, \\quad x_2 = ${fmt(-root, 4)}`,
  ]
  return { a, b: 0, c, type: 'incomplete1', roots: [root, -root], hasRealRoots: true, equationLatex: buildEquationLatex(a, 0, c), solutionSteps: steps }
}

function incomplete2Problem(a: number, b: number): SolveProblem {
  // ax² + bx = 0  →  x(ax + b) = 0  →  x = 0 or x = -b/a
  const r2 = -b / a
  const bStr = b > 0 ? `+${b}` : `${b}`
  const steps: string[] = [
    `\\text{Ecuación incompleta (sin término constante): } ${a === 1 ? '' : a}x^{2}${bStr}x = 0`,
    `x(${a === 1 ? '' : a}x ${b > 0 ? '+' : ''}${b}) = 0`,
    `x_1 = 0`,
    `${a === 1 ? '' : a}x ${b > 0 ? '+' : ''}${b} = 0 \\implies x_2 = ${fmt(r2, 4)}`,
  ]
  return { a, b, c: 0, type: 'incomplete2', roots: [0, r2], hasRealRoots: true, equationLatex: buildEquationLatex(a, b, 0), solutionSteps: steps }
}

function noRealRootsProblem(): SolveProblem {
  // ax² + c with same sign → no real roots
  const a = pick([1, 2])
  const c = pick([1, 2, 3, 4, 5])
  const steps: string[] = [
    `\\text{Ecuación: } ${buildEquationLatex(a, 0, c)}`,
    `\\Delta = 0 - 4(${a})(${c}) = ${-4 * a * c}`,
    `\\Delta < 0 \\implies \\text{No hay raíces reales}`,
  ]
  return { a, b: 0, c, type: 'complete', roots: [], hasRealRoots: false, equationLatex: buildEquationLatex(a, 0, c), solutionSteps: steps }
}

export function generateSolveProblem(diff: DifficultyLevel): SolveProblem {
  if (diff === 'basico') {
    return pick<() => SolveProblem>([
      // monic, positive integer roots
      () => { const r1 = randInt(1, 6); const r2 = randInt(1, 6); return completeProblem(1, r1, r2) },
      // type 2: x² + bx = 0
      () => { const b = randInt(-5, 5) !== 0 ? randInt(-5, 5) : 2; return incomplete2Problem(1, b) },
    ])()
  }

  if (diff === 'intermedio') {
    return pick<() => SolveProblem>([
      // monic mixed-sign roots
      () => { const r1 = randInt(1, 6); const r2 = -randInt(1, 6); return completeProblem(1, r1, r2) },
      // type 1: 2x² - 8 = 0
      () => { const k = randInt(1, 4); return incomplete1Problem(1, -(k * k)) },
      // type 2 with a≠1
      () => { const a = pick([2, 3]); const b = -(a * randInt(1, 4)); return incomplete2Problem(a, b) },
    ])()
  }

  // avanzado
  return pick<() => SolveProblem>([
    () => { const r1 = randInt(2, 4); const r2 = -randInt(2, 4); return completeProblem(2, r1, r2) },
    () => { const k = pick([2, 3, 5, 7]); return incomplete1Problem(1, -k) },
    noRealRootsProblem,
  ])()
}

export function validateRoots(ans1: string, ans2: string, problem: SolveProblem, tolerance = 0.05): boolean {
  const v1 = parseFloat(ans1)
  const v2 = parseFloat(ans2)
  if (isNaN(v1) || isNaN(v2)) return false
  const [r1, r2] = problem.roots
  return (
    (Math.abs(v1 - r1) <= tolerance && Math.abs(v2 - r2) <= tolerance) ||
    (Math.abs(v1 - r2) <= tolerance && Math.abs(v2 - r1) <= tolerance)
  )
}
