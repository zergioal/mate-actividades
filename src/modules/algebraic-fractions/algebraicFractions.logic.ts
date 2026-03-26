import type { DifficultyLevel } from '@/types/module.types'

export interface FractionStep {
  label: string
  latex: string
  explanation: string
}

export interface AlgebraicFractionProblem {
  title: string
  originalLatex: string
  steps: FractionStep[]
  restrictions: string[]   // e.g. ["x \\neq -2", "x \\neq 3"]
  finalLatex: string
}

// ─── Pre-defined problem bank ─────────────────────────────────────────────────

const BASIC_PROBLEMS: AlgebraicFractionProblem[] = [
  {
    title: 'Diferencia de cuadrados',
    originalLatex: '\\dfrac{x^2 - 9}{x + 3}',
    steps: [
      {
        label: 'Factorizar el numerador',
        latex: '\\dfrac{(x-3)(x+3)}{x+3}',
        explanation: 'El numerador x² − 9 es una diferencia de cuadrados: (x − 3)(x + 3)',
      },
      {
        label: 'Cancelar el factor común (x + 3)',
        latex: '\\dfrac{(x-3)\\cancel{(x+3)}}{\\cancel{(x+3)}}',
        explanation: 'El factor (x + 3) aparece en numerador y denominador; se simplifica.',
      },
      {
        label: 'Resultado simplificado',
        latex: 'x - 3',
        explanation: 'La fracción simplificada es x − 3, con la restricción x ≠ −3.',
      },
    ],
    restrictions: ['x \\neq -3'],
    finalLatex: 'x - 3',
  },
  {
    title: 'Factor común lineal',
    originalLatex: '\\dfrac{2x^2 + 4x}{2x}',
    steps: [
      {
        label: 'Factorizar el numerador',
        latex: '\\dfrac{2x(x + 2)}{2x}',
        explanation: 'Sacamos 2x como factor común del numerador: 2x² + 4x = 2x(x + 2)',
      },
      {
        label: 'Cancelar el factor 2x',
        latex: '\\dfrac{\\cancel{2x}(x+2)}{\\cancel{2x}}',
        explanation: 'El factor 2x aparece arriba y abajo; se cancela.',
      },
      {
        label: 'Resultado',
        latex: 'x + 2',
        explanation: 'La fracción simplificada es x + 2, con la restricción x ≠ 0.',
      },
    ],
    restrictions: ['x \\neq 0'],
    finalLatex: 'x + 2',
  },
]

const INTERMEDIATE_PROBLEMS: AlgebraicFractionProblem[] = [
  {
    title: 'Trinomio sobre binomio',
    originalLatex: '\\dfrac{x^2 - x - 6}{x^2 - 9}',
    steps: [
      {
        label: 'Factorizar el numerador',
        latex: '\\dfrac{(x-3)(x+2)}{x^2-9}',
        explanation: 'x² − x − 6 = (x − 3)(x + 2) [raíces: x = 3 y x = −2]',
      },
      {
        label: 'Factorizar el denominador',
        latex: '\\dfrac{(x-3)(x+2)}{(x-3)(x+3)}',
        explanation: 'x² − 9 es diferencia de cuadrados: (x − 3)(x + 3)',
      },
      {
        label: 'Cancelar (x − 3)',
        latex: '\\dfrac{\\cancel{(x-3)}(x+2)}{\\cancel{(x-3)}(x+3)}',
        explanation: 'El factor (x − 3) se simplifica.',
      },
      {
        label: 'Resultado',
        latex: '\\dfrac{x+2}{x+3}',
        explanation: 'Resultado simplificado, con restricciones x ≠ 3 y x ≠ −3.',
      },
    ],
    restrictions: ['x \\neq 3', 'x \\neq -3'],
    finalLatex: '\\dfrac{x+2}{x+3}',
  },
  {
    title: 'Simplificación con cuadrado perfecto',
    originalLatex: '\\dfrac{x^2 - 4}{x^2 + 4x + 4}',
    steps: [
      {
        label: 'Factorizar numerador (diferencia de cuadrados)',
        latex: '\\dfrac{(x-2)(x+2)}{x^2+4x+4}',
        explanation: 'x² − 4 = (x − 2)(x + 2)',
      },
      {
        label: 'Factorizar denominador (trinomio cuadrado perfecto)',
        latex: '\\dfrac{(x-2)(x+2)}{(x+2)^2}',
        explanation: 'x² + 4x + 4 = (x + 2)², ya que (a + b)² = a² + 2ab + b²',
      },
      {
        label: 'Cancelar un factor (x + 2)',
        latex: '\\dfrac{(x-2)\\cancel{(x+2)}}{\\cancel{(x+2)}(x+2)}',
        explanation: 'Solo se cancela un (x + 2) del denominador.',
      },
      {
        label: 'Resultado',
        latex: '\\dfrac{x-2}{x+2}',
        explanation: 'Resultado simplificado con restricción x ≠ −2.',
      },
    ],
    restrictions: ['x \\neq -2'],
    finalLatex: '\\dfrac{x-2}{x+2}',
  },
]

const INTERMEDIATE_EXTRA: AlgebraicFractionProblem[] = [
  {
    title: 'Factor común en numerador',
    originalLatex: '\\dfrac{3x^2 - 6x}{3x}',
    steps: [
      {
        label: 'Factor común en el numerador',
        latex: '\\dfrac{3x(x - 2)}{3x}',
        explanation: '3x² − 6x = 3x(x − 2)',
      },
      {
        label: 'Cancelar 3x',
        latex: '\\dfrac{\\cancel{3x}(x-2)}{\\cancel{3x}}',
        explanation: 'El factor 3x se cancela.',
      },
      { label: 'Resultado', latex: 'x - 2', explanation: 'Restricción: x ≠ 0.' },
    ],
    restrictions: ['x \\neq 0'],
    finalLatex: 'x - 2',
  },
  {
    title: 'Cuadrado perfecto en denominador',
    originalLatex: '\\dfrac{x^2 - 9}{x^2 - 6x + 9}',
    steps: [
      {
        label: 'Factorizar numerador (dif. cuadrados)',
        latex: '\\dfrac{(x-3)(x+3)}{x^2-6x+9}',
        explanation: 'x² − 9 = (x − 3)(x + 3)',
      },
      {
        label: 'Factorizar denominador (cuad. perfecto)',
        latex: '\\dfrac{(x-3)(x+3)}{(x-3)^2}',
        explanation: 'x² − 6x + 9 = (x − 3)²',
      },
      {
        label: 'Cancelar un factor (x − 3)',
        latex: '\\dfrac{\\cancel{(x-3)}(x+3)}{\\cancel{(x-3)}(x-3)}',
        explanation: 'Se cancela un (x − 3).',
      },
      { label: 'Resultado', latex: '\\dfrac{x+3}{x-3}', explanation: 'Restricción: x ≠ 3.' },
    ],
    restrictions: ['x \\neq 3'],
    finalLatex: '\\dfrac{x+3}{x-3}',
  },
]

const ADVANCED_PROBLEMS: AlgebraicFractionProblem[] = [
  {
    title: 'Numerador no mónico',
    originalLatex: '\\dfrac{2x^2 + x - 6}{x^2 - x - 2}',
    steps: [
      {
        label: 'Factorizar numerador (a = 2)',
        latex: '\\dfrac{(2x-3)(x+2)}{x^2-x-2}',
        explanation: '2x² + x − 6 = (2x − 3)(x + 2) [verificar: 2x·x + 2x·2 − 3x − 6]',
      },
      {
        label: 'Factorizar denominador',
        latex: '\\dfrac{(2x-3)(x+2)}{(x-2)(x+1)}',
        explanation: 'x² − x − 2 = (x − 2)(x + 1)',
      },
      {
        label: 'Sin factores comunes',
        latex: '\\dfrac{(2x-3)(x+2)}{(x-2)(x+1)}',
        explanation: 'No hay factores comunes entre numerador y denominador.',
      },
      {
        label: 'Resultado (ya en mínima expresión)',
        latex: '\\dfrac{(2x-3)(x+2)}{(x-2)(x+1)}',
        explanation: 'La fracción está en su mínima expresión. Restricciones: x ≠ 2, x ≠ −1.',
      },
    ],
    restrictions: ['x \\neq 2', 'x \\neq -1'],
    finalLatex: '\\dfrac{(2x-3)(x+2)}{(x-2)(x+1)}',
  },
  {
    title: 'Fracción compleja con cubo',
    originalLatex: '\\dfrac{x^3 - x}{x^2 - 1}',
    steps: [
      {
        label: 'Factorizar numerador',
        latex: '\\dfrac{x(x^2-1)}{x^2-1}',
        explanation: 'x³ − x = x(x² − 1): sacamos x como factor común.',
      },
      {
        label: 'Factorizar (x² − 1)',
        latex: '\\dfrac{x(x-1)(x+1)}{(x-1)(x+1)}',
        explanation: 'x² − 1 = (x − 1)(x + 1) en numerador y denominador.',
      },
      {
        label: 'Cancelar (x − 1)(x + 1)',
        latex: '\\dfrac{x\\cancel{(x-1)(x+1)}}{\\cancel{(x-1)(x+1)}}',
        explanation: 'Ambos factores se cancelan completamente.',
      },
      {
        label: 'Resultado',
        latex: 'x',
        explanation: 'La fracción simplifica a x, con restricciones x ≠ 1 y x ≠ −1.',
      },
    ],
    restrictions: ['x \\neq 1', 'x \\neq -1'],
    finalLatex: 'x',
  },
  {
    title: 'Suma de cubos en el numerador',
    originalLatex: '\\dfrac{x^3 + 8}{x^2 - 2x + 4}',
    steps: [
      {
        label: 'Factorizar suma de cubos: a³+b³=(a+b)(a²−ab+b²)',
        latex: '\\dfrac{(x+2)(x^2-2x+4)}{x^2-2x+4}',
        explanation: 'x³ + 8 = x³ + 2³ = (x+2)(x²−2x+4)',
      },
      {
        label: 'Cancelar (x²−2x+4)',
        latex: '\\dfrac{(x+2)\\cancel{(x^2-2x+4)}}{\\cancel{x^2-2x+4}}',
        explanation: 'El factor cuadrático aparece arriba y abajo.',
      },
      { label: 'Resultado', latex: 'x + 2', explanation: 'Restricción: raíces de x²−2x+4 (no reales).' },
    ],
    restrictions: ['x^2-2x+4 \\neq 0'],
    finalLatex: 'x + 2',
  },
  {
    title: 'Agrupación en el numerador',
    originalLatex: '\\dfrac{x^3 + x^2 - x - 1}{x^2 - 1}',
    steps: [
      {
        label: 'Factorizar por agrupación',
        latex: '\\dfrac{x^2(x+1) - (x+1)}{x^2-1}',
        explanation: 'Agrupamos: (x³+x²) + (−x−1) = x²(x+1) − (x+1)',
      },
      {
        label: 'Extraer factor común (x+1)',
        latex: '\\dfrac{(x+1)(x^2-1)}{x^2-1}',
        explanation: 'x²(x+1) − (x+1) = (x+1)(x²−1)',
      },
      {
        label: 'Cancelar (x²−1)',
        latex: '\\dfrac{(x+1)\\cancel{(x^2-1)}}{\\cancel{x^2-1}}',
        explanation: 'El factor (x²−1) se cancela.',
      },
      { label: 'Resultado', latex: 'x + 1', explanation: 'Restricciones: x ≠ ±1.' },
    ],
    restrictions: ['x \\neq 1', 'x \\neq -1'],
    finalLatex: 'x + 1',
  },
]

export function getProblemBank(difficulty: DifficultyLevel): AlgebraicFractionProblem[] {
  const map = {
    basico: BASIC_PROBLEMS,
    intermedio: [...INTERMEDIATE_PROBLEMS, ...INTERMEDIATE_EXTRA],
    avanzado: ADVANCED_PROBLEMS,
  }
  return map[difficulty]
}
