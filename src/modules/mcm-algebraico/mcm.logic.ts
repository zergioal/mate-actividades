import { pick } from '@/lib/math.utils'

export interface MCMProblem {
  expr1Latex: string
  expr2Latex: string
  options: string[]      // 4 LaTeX options
  correctIndex: number
  hint: string
  solutionSteps: string[]
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function shuffle4(
  correct: string,
  w1: string, w2: string, w3: string,
): { options: string[]; correctIndex: number } {
  const pool = [correct, w1, w2, w3]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return { options: pool, correctIndex: pool.indexOf(correct) }
}

// ─── Problem banks ────────────────────────────────────────────────────────────

// MONOMIALS – MCM by taking highest exponents and LCM of coefficients
const MONOMIAL_BANK: MCMProblem[] = [
  {
    expr1Latex: '6x^{2}', expr2Latex: '4x^{3}',
    ...shuffle4('12x^{3}', '2x^{2}', '24x^{3}', '12x^{2}'),
    hint: 'MCM de coeficientes × mayor potencia de cada variable.',
    solutionSteps: [
      '\\text{MCM}(6x^2,\\,4x^3)',
      '\\text{MCM de coeficientes: }\\text{MCM}(6,4)=12',
      '\\text{Mayor potencia de }x\\text{: }x^3',
      '\\text{MCM} = 12x^3',
    ],
  },
  {
    expr1Latex: '4x^{2}y', expr2Latex: '6xy^{2}',
    ...shuffle4('12x^{2}y^{2}', '2xy', '24x^{2}y^{2}', '12xy'),
    hint: 'Toma el MCM de coeficientes y la mayor potencia de cada variable.',
    solutionSteps: [
      '\\text{MCM}(4x^2y,\\,6xy^2)',
      '\\text{MCM}(4,6)=12',
      '\\text{Mayor potencia }x^2\\text{ y }y^2',
      '\\text{MCM} = 12x^2y^2',
    ],
  },
  {
    expr1Latex: '8x^{3}', expr2Latex: '12x^{2}',
    ...shuffle4('24x^{3}', '4x^{2}', '96x^{3}', '24x^{2}'),
    hint: 'MCM(8,12) = 24; mayor potencia x³.',
    solutionSteps: [
      '\\text{MCM}(8x^3,\\,12x^2)',
      '\\text{MCM}(8,12)=24',
      '\\text{Mayor potencia: }x^3',
      '\\text{MCM} = 24x^3',
    ],
  },
  {
    expr1Latex: '5x^{2}z', expr2Latex: '15xz^{2}',
    ...shuffle4('15x^{2}z^{2}', '5xz', '75x^{2}z^{2}', '15x^{2}z'),
    hint: 'MCM(5,15)=15; potencias máximas x² y z².',
    solutionSteps: [
      '\\text{MCM}(5x^2z,\\,15xz^2)',
      '\\text{MCM}(5,15)=15',
      '\\text{Mayor potencia: }x^2,\\,z^2',
      '\\text{MCM} = 15x^2z^2',
    ],
  },
]

// BINOMIALS – factored forms share / don't share factors
const BINOMIAL_BANK: MCMProblem[] = [
  {
    expr1Latex: 'x+2', expr2Latex: 'x-3',
    ...shuffle4('(x+2)(x-3)', '(x+2)', 'x^2-x-6', '(x-3)'),
    hint: 'Como no tienen factores comunes, el MCM es su producto.',
    solutionSteps: [
      '\\text{Factores de }(x+2)\\text{: }(x+2)',
      '\\text{Factores de }(x-3)\\text{: }(x-3)',
      '\\text{No comparten factores}',
      '\\text{MCM} = (x+2)(x-3)',
    ],
  },
  {
    expr1Latex: 'x^{2}-1', expr2Latex: 'x+1',
    ...shuffle4('(x+1)(x-1)', '(x-1)', '(x+1)', '(x^2-1)(x+1)'),
    hint: 'Factoriza: x²-1 = (x+1)(x-1). El MCM es el que ya contiene al otro.',
    solutionSteps: [
      'x^2-1 = (x+1)(x-1)',
      '\\text{Factores de }(x+1)\\text{: }(x+1)',
      '\\text{MCM incluye }(x+1)\\text{ y }(x-1)',
      '\\text{MCM} = (x+1)(x-1)',
    ],
  },
  {
    expr1Latex: 'x^{2}-4', expr2Latex: 'x-2',
    ...shuffle4('(x+2)(x-2)', '(x-2)', '(x^2-4)(x-2)', '(x+2)'),
    hint: 'x²-4 = (x+2)(x-2). Como (x-2) ya está en la factorización, el MCM = x²-4.',
    solutionSteps: [
      'x^2-4=(x+2)(x-2)',
      '\\text{(x-2) está contenido en }x^2-4',
      '\\text{MCM} = (x+2)(x-2)',
    ],
  },
  {
    expr1Latex: 'x^{2}+2x+1', expr2Latex: 'x+1',
    ...shuffle4('(x+1)^{2}', '(x+1)', '(x+1)^3', 'x^2+2x+1'),
    hint: 'x²+2x+1 = (x+1)². El MCM es (x+1)².',
    solutionSteps: [
      'x^2+2x+1=(x+1)^2',
      '\\text{Factores de }(x+1)\\text{: }(x+1)',
      '\\text{Mayor potencia de }(x+1)\\text{: }(x+1)^2',
      '\\text{MCM} = (x+1)^2',
    ],
  },
]

// MIXED – combination of numeric and polynomial factors
const MIXED_BANK: MCMProblem[] = [
  {
    expr1Latex: '2x+4', expr2Latex: 'x^{2}-4',
    ...shuffle4('2(x+2)(x-2)', '2(x+2)', '(x+2)(x-2)', '2(x^2-4)'),
    hint: 'Factoriza ambos: 2x+4=2(x+2), x²-4=(x+2)(x-2).',
    solutionSteps: [
      '2x+4 = 2(x+2)',
      'x^2-4 = (x+2)(x-2)',
      '\\text{MCM toma cada factor a mayor potencia}',
      '\\text{MCM} = 2(x+2)(x-2)',
    ],
  },
  {
    expr1Latex: 'x^{2}-x', expr2Latex: 'x^{2}-1',
    ...shuffle4('x(x+1)(x-1)', 'x(x-1)', '(x-1)', 'x(x^2-1)'),
    hint: 'x²-x = x(x-1); x²-1 = (x+1)(x-1). MCM toma todos los factores distintos.',
    solutionSteps: [
      'x^2-x = x(x-1)',
      'x^2-1 = (x+1)(x-1)',
      '\\text{Factores únicos: }x,\\,(x-1),\\,(x+1)',
      '\\text{MCM} = x(x-1)(x+1)',
    ],
  },
  {
    expr1Latex: '3x^{2}', expr2Latex: 'x^{2}-9',
    ...shuffle4('3x^{2}(x+3)(x-3)', '3x^2', '(x^2-9)', '3(x+3)(x-3)'),
    hint: 'No comparten factores: MCM = producto.',
    solutionSteps: [
      '3x^2 = 3 \\cdot x^2',
      'x^2-9 = (x+3)(x-3)',
      '\\text{Sin factores comunes}',
      '\\text{MCM} = 3x^2(x+3)(x-3)',
    ],
  },
  {
    expr1Latex: 'x^{2}+3x+2', expr2Latex: 'x^{2}-1',
    ...shuffle4('(x+1)(x+2)(x-1)', '(x+1)(x+2)', '(x+1)(x-1)', '(x^2+3x+2)(x^2-1)'),
    hint: 'Factoriza ambos: (x+1)(x+2) y (x+1)(x-1). MCM incluye cada factor una vez.',
    solutionSteps: [
      'x^2+3x+2 = (x+1)(x+2)',
      'x^2-1 = (x+1)(x-1)',
      '\\text{Factor común: }(x+1)',
      '\\text{MCM} = (x+1)(x+2)(x-1)',
    ],
  },
]

const ALL_PROBLEMS = [...MONOMIAL_BANK, ...BINOMIAL_BANK, ...MIXED_BANK]

let _lastIdx = -1

export function getNextMCMProblem(): MCMProblem {
  let idx: number
  do { idx = Math.floor(Math.random() * ALL_PROBLEMS.length) } while (idx === _lastIdx && ALL_PROBLEMS.length > 1)
  _lastIdx = idx
  // Re-shuffle options each call
  const p = ALL_PROBLEMS[idx]
  const { options, correctIndex } = shuffle4(
    p.options[p.correctIndex],
    p.options[(p.correctIndex + 1) % 4],
    p.options[(p.correctIndex + 2) % 4],
    p.options[(p.correctIndex + 3) % 4],
  )
  return { ...p, options, correctIndex }
}

export function getMCMByCategory(cat: 'monomials' | 'binomials' | 'mixed'): MCMProblem {
  const bank = cat === 'monomials' ? MONOMIAL_BANK : cat === 'binomials' ? BINOMIAL_BANK : MIXED_BANK
  const p = pick(bank)
  const { options, correctIndex } = shuffle4(
    p.options[p.correctIndex],
    p.options[(p.correctIndex + 1) % 4],
    p.options[(p.correctIndex + 2) % 4],
    p.options[(p.correctIndex + 3) % 4],
  )
  return { ...p, options, correctIndex }
}
