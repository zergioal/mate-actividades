import { pick } from '@/lib/math.utils'
import type { AlgebraicFractionProblem } from '@/modules/algebraic-fractions/algebraicFractions.logic'

export type OpType = 'add' | 'sub' | 'mul' | 'div'

export interface FracOpProblem extends AlgebraicFractionProblem {
  opType: OpType
}

// ─── Addition problems ────────────────────────────────────────────────────────

const ADD_PROBLEMS: FracOpProblem[] = [
  {
    opType: 'add',
    title: 'Suma — mismo denominador',
    originalLatex: '\\dfrac{3}{x+1} + \\dfrac{x}{x+1}',
    steps: [
      {
        label: 'Mismo denominador → unir numeradores',
        latex: '\\dfrac{3 + x}{x+1}',
        explanation: 'Como los denominadores son iguales, se suman los numeradores directamente.',
      },
      {
        label: 'Resultado',
        latex: '\\dfrac{x+3}{x+1}',
        explanation: 'No se puede simplificar más. Restricción: x ≠ −1.',
      },
    ],
    restrictions: ['x \\neq -1'],
    finalLatex: '\\dfrac{x+3}{x+1}',
  },
  {
    opType: 'add',
    title: 'Suma — denominadores distintos (lineales)',
    originalLatex: '\\dfrac{2}{x-1} + \\dfrac{3}{x+2}',
    steps: [
      {
        label: 'MCM de denominadores: (x−1)(x+2)',
        latex: '\\dfrac{2(x+2) + 3(x-1)}{(x-1)(x+2)}',
        explanation: 'Amplificamos cada fracción para obtener el denominador común (x−1)(x+2).',
      },
      {
        label: 'Expandir el numerador',
        latex: '\\dfrac{2x+4+3x-3}{(x-1)(x+2)}',
        explanation: '2(x+2)=2x+4 y 3(x−1)=3x−3.',
      },
      {
        label: 'Simplificar el numerador',
        latex: '\\dfrac{5x+1}{(x-1)(x+2)}',
        explanation: '2x+4+3x−3 = 5x+1.',
      },
    ],
    restrictions: ['x \\neq 1', 'x \\neq -2'],
    finalLatex: '\\dfrac{5x+1}{(x-1)(x+2)}',
  },
  {
    opType: 'add',
    title: 'Suma — un denominador es múltiplo',
    originalLatex: '\\dfrac{1}{x} + \\dfrac{2}{x^{2}}',
    steps: [
      {
        label: 'MCM = x²',
        latex: '\\dfrac{x}{x^{2}} + \\dfrac{2}{x^{2}}',
        explanation: 'El MCM de x y x² es x². Amplificamos la primera fracción por x.',
      },
      {
        label: 'Unir numeradores',
        latex: '\\dfrac{x+2}{x^{2}}',
        explanation: 'Denominadores iguales: sumamos numeradores.',
      },
    ],
    restrictions: ['x \\neq 0'],
    finalLatex: '\\dfrac{x+2}{x^{2}}',
  },
  {
    opType: 'add',
    title: 'Suma — diferencia de cuadrados en denominadores',
    originalLatex: '\\dfrac{1}{x-2} + \\dfrac{1}{x+2}',
    steps: [
      {
        label: 'MCM = (x−2)(x+2) = x²−4',
        latex: '\\dfrac{x+2}{(x-2)(x+2)} + \\dfrac{x-2}{(x-2)(x+2)}',
        explanation: 'Amplificamos para obtener el denominador común.',
      },
      {
        label: 'Unir numeradores',
        latex: '\\dfrac{(x+2)+(x-2)}{(x-2)(x+2)}',
        explanation: 'Mismos denominadores → suma de numeradores.',
      },
      {
        label: 'Simplificar',
        latex: '\\dfrac{2x}{x^{2}-4}',
        explanation: '(x+2)+(x−2) = 2x y (x−2)(x+2) = x²−4.',
      },
    ],
    restrictions: ['x \\neq 2', 'x \\neq -2'],
    finalLatex: '\\dfrac{2x}{x^{2}-4}',
  },
]

// ─── Subtraction problems ─────────────────────────────────────────────────────

const SUB_PROBLEMS: FracOpProblem[] = [
  {
    opType: 'sub',
    title: 'Resta — mismo denominador',
    originalLatex: '\\dfrac{x+3}{x-1} - \\dfrac{4}{x-1}',
    steps: [
      {
        label: 'Mismo denominador → restar numeradores',
        latex: '\\dfrac{(x+3)-4}{x-1}',
        explanation: 'Denominadores iguales: restamos los numeradores.',
      },
      {
        label: 'Simplificar el numerador',
        latex: '\\dfrac{x-1}{x-1}',
        explanation: 'x+3−4 = x−1.',
      },
      {
        label: 'Cancelar factor común',
        latex: '\\dfrac{\\cancel{x-1}}{\\cancel{x-1}} = 1',
        explanation: 'El factor (x−1) se cancela. Restricción: x ≠ 1.',
      },
    ],
    restrictions: ['x \\neq 1'],
    finalLatex: '1',
  },
  {
    opType: 'sub',
    title: 'Resta — denominadores distintos',
    originalLatex: '\\dfrac{x}{x+1} - \\dfrac{2}{x-1}',
    steps: [
      {
        label: 'MCM = (x+1)(x−1)',
        latex: '\\dfrac{x(x-1)}{(x+1)(x-1)} - \\dfrac{2(x+1)}{(x+1)(x-1)}',
        explanation: 'Amplificamos cada fracción al denominador común.',
      },
      {
        label: 'Restar numeradores',
        latex: '\\dfrac{x(x-1)-2(x+1)}{(x+1)(x-1)}',
        explanation: 'Mismo denominador → restamos.',
      },
      {
        label: 'Expandir el numerador',
        latex: '\\dfrac{x^{2}-x-2x-2}{(x+1)(x-1)}',
        explanation: 'x(x−1)=x²−x y 2(x+1)=2x+2.',
      },
      {
        label: 'Simplificar',
        latex: '\\dfrac{x^{2}-3x-2}{x^{2}-1}',
        explanation: 'Numerador: x²−3x−2. Denominador: x²−1.',
      },
    ],
    restrictions: ['x \\neq 1', 'x \\neq -1'],
    finalLatex: '\\dfrac{x^{2}-3x-2}{x^{2}-1}',
  },
]

// ─── Multiplication problems ──────────────────────────────────────────────────

const MUL_PROBLEMS: FracOpProblem[] = [
  {
    opType: 'mul',
    title: 'Multiplicación — cancelar factores comunes',
    originalLatex: '\\dfrac{x+1}{x-1} \\cdot \\dfrac{x-1}{x+2}',
    steps: [
      {
        label: 'Multiplicar numeradores y denominadores',
        latex: '\\dfrac{(x+1)(x-1)}{(x-1)(x+2)}',
        explanation: 'En multiplicación: (a/b)·(c/d) = (a·c)/(b·d).',
      },
      {
        label: 'Cancelar factor (x−1)',
        latex: '\\dfrac{(x+1)\\cancel{(x-1)}}{\\cancel{(x-1)}(x+2)}',
        explanation: 'El factor (x−1) aparece arriba y abajo.',
      },
      {
        label: 'Resultado',
        latex: '\\dfrac{x+1}{x+2}',
        explanation: 'Resultado simplificado. Restricciones: x ≠ 1, x ≠ −2.',
      },
    ],
    restrictions: ['x \\neq 1', 'x \\neq -2'],
    finalLatex: '\\dfrac{x+1}{x+2}',
  },
  {
    opType: 'mul',
    title: 'Multiplicación — factorizando antes de multiplicar',
    originalLatex: '\\dfrac{x^{2}-4}{x+3} \\cdot \\dfrac{x^{2}+3x}{x-2}',
    steps: [
      {
        label: 'Factorizar x²−4 y x²+3x',
        latex: '\\dfrac{(x+2)(x-2)}{x+3} \\cdot \\dfrac{x(x+3)}{x-2}',
        explanation: 'x²−4=(x+2)(x−2) y x²+3x=x(x+3).',
      },
      {
        label: 'Multiplicar factores',
        latex: '\\dfrac{(x+2)(x-2)\\cdot x(x+3)}{(x+3)(x-2)}',
        explanation: 'Producto numeradores / producto denominadores.',
      },
      {
        label: 'Cancelar (x−2) y (x+3)',
        latex: '\\dfrac{(x+2)\\cancel{(x-2)}\\cdot x\\cancel{(x+3)}}{\\cancel{(x+3)}\\cancel{(x-2)}}',
        explanation: 'Los factores comunes se eliminan.',
      },
      {
        label: 'Resultado',
        latex: 'x(x+2)',
        explanation: 'Resultado: x(x+2). Restricciones: x ≠ 2, x ≠ −3.',
      },
    ],
    restrictions: ['x \\neq 2', 'x \\neq -3'],
    finalLatex: 'x(x+2)',
  },
]

// ─── Division problems ────────────────────────────────────────────────────────

const DIV_PROBLEMS: FracOpProblem[] = [
  {
    opType: 'div',
    title: 'División — multiplicar por el inverso',
    originalLatex: '\\dfrac{x^{2}-1}{x+2} \\div \\dfrac{x-1}{x+2}',
    steps: [
      {
        label: 'Multiplicar por el inverso',
        latex: '\\dfrac{x^{2}-1}{x+2} \\cdot \\dfrac{x+2}{x-1}',
        explanation: 'a÷b = a·(1/b). Invertimos la segunda fracción.',
      },
      {
        label: 'Factorizar x²−1',
        latex: '\\dfrac{(x+1)(x-1)}{x+2} \\cdot \\dfrac{x+2}{x-1}',
        explanation: 'x²−1 = (x+1)(x−1).',
      },
      {
        label: 'Cancelar factores comunes',
        latex: '\\dfrac{(x+1)\\cancel{(x-1)}\\cancel{(x+2)}}{\\cancel{(x+2)}\\cancel{(x-1)}}',
        explanation: 'Se cancelan (x−1) y (x+2).',
      },
      {
        label: 'Resultado',
        latex: 'x+1',
        explanation: 'Resultado: x+1. Restricciones: x ≠ −2, x ≠ 1.',
      },
    ],
    restrictions: ['x \\neq -2', 'x \\neq 1'],
    finalLatex: 'x+1',
  },
  {
    opType: 'div',
    title: 'División — factorización cuadrado perfecto',
    originalLatex: '\\dfrac{x^{2}+2x+1}{x^{2}-4} \\div \\dfrac{x+1}{x-2}',
    steps: [
      {
        label: 'Invertir y multiplicar',
        latex: '\\dfrac{x^{2}+2x+1}{x^{2}-4} \\cdot \\dfrac{x-2}{x+1}',
        explanation: 'División → multiplicamos por el inverso.',
      },
      {
        label: 'Factorizar numerador y denominadores',
        latex: '\\dfrac{(x+1)^{2}}{(x+2)(x-2)} \\cdot \\dfrac{x-2}{x+1}',
        explanation: 'x²+2x+1=(x+1)² y x²−4=(x+2)(x−2).',
      },
      {
        label: 'Cancelar (x+1) y (x−2)',
        latex: '\\dfrac{\\cancel{(x+1)}^{2}}{(x+2)\\cancel{(x-2)}} \\cdot \\dfrac{\\cancel{(x-2)}}{\\cancel{(x+1)}}',
        explanation: 'Un factor (x+1) y el factor (x−2) se cancelan.',
      },
      {
        label: 'Resultado',
        latex: '\\dfrac{x+1}{x+2}',
        explanation: 'Resultado: (x+1)/(x+2). Restricciones: x ≠ ±2, x ≠ −1.',
      },
    ],
    restrictions: ['x \\neq 2', 'x \\neq -2', 'x \\neq -1'],
    finalLatex: '\\dfrac{x+1}{x+2}',
  },
]

// ─── Public API ───────────────────────────────────────────────────────────────

export function getProblemsByOp(op: OpType): FracOpProblem[] {
  const map = { add: ADD_PROBLEMS, sub: SUB_PROBLEMS, mul: MUL_PROBLEMS, div: DIV_PROBLEMS }
  return map[op]
}

export function getRandomOpProblem(op: OpType | 'all'): FracOpProblem {
  const pool = op === 'all'
    ? [...ADD_PROBLEMS, ...SUB_PROBLEMS, ...MUL_PROBLEMS, ...DIV_PROBLEMS]
    : getProblemsByOp(op)
  return pick(pool)
}
