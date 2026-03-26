import type { DifficultyLevel } from '@/types/module.types'
import { randInt, pick } from '@/lib/math.utils'

export interface NumberLineChallenge {
  target: number
  displayLabel: string   // plain text
  latexLabel: string     // KaTeX formula
  tolerance: number
  rangeMin: number
  rangeMax: number
}

// ─── Challenge generators ─────────────────────────────────────────────────────

function basicChallenge(): NumberLineChallenge {
  const target = randInt(-8, 8)
  const label  = target < 0 ? `${target}` : `${target}`
  return { target, displayLabel: label, latexLabel: `{${target}}`, tolerance: 0.18, rangeMin: -10, rangeMax: 10 }
}

function intermediateChallenge(): NumberLineChallenge {
  return pick<() => NumberLineChallenge>([
    // Decimal (half-steps)
    () => {
      const t = (randInt(-16, 16)) * 0.5
      return { target: t, displayLabel: `${t}`, latexLabel: `${t}`, tolerance: 0.2, rangeMin: -8, rangeMax: 8 }
    },
    // Simple fraction with denominator 2, 3, or 4
    () => {
      const den = pick([2, 3, 4])
      const num = randInt(-(2 * den - 1), 2 * den - 1)
      if (num === 0) return basicChallenge()
      const t   = num / den
      const latexSign = num < 0 ? `-\\dfrac{${Math.abs(num)}}{${den}}` : `\\dfrac{${num}}{${den}}`
      return { target: t, displayLabel: `${num}/${den}`, latexLabel: latexSign, tolerance: 0.22, rangeMin: -5, rangeMax: 5 }
    },
  ])()
}

function advancedChallenge(): NumberLineChallenge {
  return pick<() => NumberLineChallenge>([
    // √n  (positive)
    () => {
      const n = pick([2, 3, 5, 6, 7, 8])
      return {
        target: Math.sqrt(n),
        displayLabel: `√${n}`,
        latexLabel: `\\sqrt{${n}}`,
        tolerance: 0.14,
        rangeMin: 0, rangeMax: 4,
      }
    },
    // -√n  (negative)
    () => {
      const n = pick([2, 3, 5])
      return {
        target: -Math.sqrt(n),
        displayLabel: `-√${n}`,
        latexLabel: `-\\sqrt{${n}}`,
        tolerance: 0.14,
        rangeMin: -4, rangeMax: 0,
      }
    },
    // π  ≈ 3.14159
    () => ({
      target: Math.PI,
      displayLabel: 'π',
      latexLabel: '\\pi',
      tolerance: 0.12,
      rangeMin: 0, rangeMax: 5,
    }),
    // −π
    () => ({
      target: -Math.PI,
      displayLabel: '-π',
      latexLabel: '-\\pi',
      tolerance: 0.12,
      rangeMin: -5, rangeMax: 0,
    }),
    // e  ≈ 2.71828
    () => ({
      target: Math.E,
      displayLabel: 'e',
      latexLabel: 'e',
      tolerance: 0.12,
      rangeMin: 0, rangeMax: 5,
    }),
    // φ  (golden ratio) ≈ 1.618
    () => ({
      target: (1 + Math.sqrt(5)) / 2,
      displayLabel: 'φ',
      latexLabel: '\\varphi',
      tolerance: 0.12,
      rangeMin: 0, rangeMax: 4,
    }),
    // Fraction thirds
    () => {
      const num = pick([-5, -4, -2, -1, 1, 2, 4, 5])
      const t   = num / 3
      const latexSign = num < 0 ? `-\\dfrac{${Math.abs(num)}}{3}` : `\\dfrac{${num}}{3}`
      return { target: t, displayLabel: `${num}/3`, latexLabel: latexSign, tolerance: 0.15, rangeMin: -3, rangeMax: 3 }
    },
    // π/2
    () => ({
      target: Math.PI / 2,
      displayLabel: 'π/2',
      latexLabel: '\\dfrac{\\pi}{2}',
      tolerance: 0.12,
      rangeMin: 0, rangeMax: 4,
    }),
  ])()
}

export function generateChallenge(difficulty: DifficultyLevel): NumberLineChallenge {
  const gen = { basico: basicChallenge, intermedio: intermediateChallenge, avanzado: advancedChallenge }
  return gen[difficulty]()
}

export function validateAnswer(placed: number, ch: NumberLineChallenge): boolean {
  return Math.abs(placed - ch.target) <= ch.tolerance
}
