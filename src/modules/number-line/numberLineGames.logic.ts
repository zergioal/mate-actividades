import { pick, randInt } from '@/lib/math.utils'
import type { MatchItem } from '@/components/shared/MatchingGame'

export interface MatchingGameData {
  leftItems: MatchItem[]
  rightItems: MatchItem[]
  correctPairs: Record<string, string>
}

export interface IrrationalOpChallenge {
  expressionLatex: string
  options: string[]
  correctIndex: number
  hint: string
  solutionLatex: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffleWithCorrect(correct: string, wrongs: string[]): { options: string[]; correctIndex: number } {
  const pool = [correct, ...wrongs.slice(0, 3)]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return { options: pool, correctIndex: pool.indexOf(correct) }
}

function simplifyRadical(n: number): { coeff: number; radicand: number } {
  let coeff = 1
  let radicand = n
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    if (n % (k * k) === 0) {
      coeff = k
      radicand = n / (k * k)
      break
    }
  }
  return { coeff, radicand }
}

function radicalLatex(coeff: number, radicand: number): string {
  if (radicand === 1) return `${coeff}`
  return coeff === 1 ? `\\sqrt{${radicand}}` : `${coeff}\\sqrt{${radicand}}`
}

// ─── Interval Matching Game ───────────────────────────────────────────────────

interface FiniteInterval { a: number; b: number; lo: boolean; ro: boolean }
interface SemiInterval { val: number; openAtFinite: boolean; side: 'left' | 'right' }

const FINITE_POOL: FiniteInterval[] = [
  { a: -3, b: 2,  lo: true,  ro: true  },
  { a:  1, b: 5,  lo: false, ro: false },
  { a: -4, b: 0,  lo: true,  ro: false },
  { a:  0, b: 3,  lo: false, ro: true  },
  { a: -2, b: 4,  lo: false, ro: true  },
  { a: -5, b: -1, lo: true,  ro: false },
  { a:  2, b: 7,  lo: true,  ro: false },
  { a: -1, b: 1,  lo: false, ro: false },
  { a:  3, b: 8,  lo: false, ro: true  },
  { a: -6, b: -2, lo: false, ro: false },
]

const SEMI_POOL: SemiInterval[] = [
  { val:  2, openAtFinite: true,  side: 'left'  },
  { val: -3, openAtFinite: false, side: 'left'  },
  { val:  5, openAtFinite: true,  side: 'right' },
  { val:  0, openAtFinite: false, side: 'right' },
  { val:  1, openAtFinite: false, side: 'left'  },
  { val: -2, openAtFinite: true,  side: 'right' },
  { val:  4, openAtFinite: false, side: 'left'  },
  { val: -1, openAtFinite: true,  side: 'right' },
]

function finiteIntervalLatex({ a, b, lo, ro }: FiniteInterval): string {
  return `${lo ? '(' : '['}${a},\\;${b}${ro ? ')' : ']'}`
}

function finiteIneqLatex({ a, b, lo, ro }: FiniteInterval): string {
  return `${a} ${lo ? '<' : '\\leq'} x ${ro ? '<' : '\\leq'} ${b}`
}

function semiIntervalLatex({ val, openAtFinite, side }: SemiInterval): string {
  if (side === 'left') return `${openAtFinite ? '(' : '['}${val},\\;+\\infty)`
  return `(-\\infty,\\;${val}${openAtFinite ? ')' : ']'}`
}

function semiIneqLatex({ val, openAtFinite, side }: SemiInterval): string {
  if (side === 'left') return openAtFinite ? `x > ${val}` : `x \\geq ${val}`
  return openAtFinite ? `x < ${val}` : `x \\leq ${val}`
}

export function generateIntervalGame(): MatchingGameData {
  const finite = [...FINITE_POOL].sort(() => Math.random() - 0.5).slice(0, 3)
  const semi   = [...SEMI_POOL].sort(() => Math.random() - 0.5).slice(0, 3)

  const leftItems: MatchItem[]  = []
  const rightItems: MatchItem[] = []
  const correctPairs: Record<string, string> = {}

  finite.forEach((iv, i) => {
    const lid = `fl${i}`, rid = `fr${i}`
    leftItems.push({ id: lid, label: finiteIntervalLatex(iv), isLatex: true })
    rightItems.push({ id: rid, label: finiteIneqLatex(iv), isLatex: true })
    correctPairs[lid] = rid
  })

  semi.forEach((iv, i) => {
    const lid = `sl${i}`, rid = `sr${i}`
    leftItems.push({ id: lid, label: semiIntervalLatex(iv), isLatex: true })
    rightItems.push({ id: rid, label: semiIneqLatex(iv), isLatex: true })
    correctPairs[lid] = rid
  })

  return { leftItems, rightItems, correctPairs }
}

// ─── Radical Simplification Matching ─────────────────────────────────────────

const RADICAL_BANK = [
  { u: '\\sqrt{8}',   s: '2\\sqrt{2}'   },
  { u: '\\sqrt{12}',  s: '2\\sqrt{3}'   },
  { u: '\\sqrt{18}',  s: '3\\sqrt{2}'   },
  { u: '\\sqrt{20}',  s: '2\\sqrt{5}'   },
  { u: '\\sqrt{24}',  s: '2\\sqrt{6}'   },
  { u: '\\sqrt{27}',  s: '3\\sqrt{3}'   },
  { u: '\\sqrt{32}',  s: '4\\sqrt{2}'   },
  { u: '\\sqrt{45}',  s: '3\\sqrt{5}'   },
  { u: '\\sqrt{48}',  s: '4\\sqrt{3}'   },
  { u: '\\sqrt{50}',  s: '5\\sqrt{2}'   },
  { u: '\\sqrt{72}',  s: '6\\sqrt{2}'   },
  { u: '\\sqrt{75}',  s: '5\\sqrt{3}'   },
  { u: '\\sqrt{98}',  s: '7\\sqrt{2}'   },
  { u: '\\sqrt{108}', s: '6\\sqrt{3}'   },
  { u: '\\sqrt{200}', s: '10\\sqrt{2}'  },
  { u: '\\sqrt{125}', s: '5\\sqrt{5}'   },
  { u: '\\sqrt{80}',  s: '4\\sqrt{5}'   },
  { u: '\\sqrt{243}', s: '9\\sqrt{3}'   },
]

export function generateRadicalGame(): MatchingGameData {
  const pairs = [...RADICAL_BANK].sort(() => Math.random() - 0.5).slice(0, 6)

  const leftItems: MatchItem[]  = []
  const rightItems: MatchItem[] = []
  const correctPairs: Record<string, string> = {}

  pairs.forEach(({ u, s }, i) => {
    const lid = `rl${i}`, rid = `rr${i}`
    leftItems.push({ id: lid, label: u, isLatex: true })
    rightItems.push({ id: rid, label: s, isLatex: true })
    correctPairs[lid] = rid
  })

  return { leftItems, rightItems, correctPairs }
}

// ─── Irrational Operations MCQ ────────────────────────────────────────────────

export function generateIrrationalOp(): IrrationalOpChallenge {
  const type = pick(['add', 'sub', 'mul-same', 'mul-diff', 'power', 'div'] as const)

  // ── like terms: add ──────────────────────────────────────────────
  if (type === 'add') {
    const n = pick([2, 3, 5, 6, 7])
    const a = randInt(2, 7), b = randInt(2, 7)
    const sum = a + b
    const correct = `${sum}\\sqrt{${n}}`
    const { options, correctIndex } = shuffleWithCorrect(correct, [
      `${a * b}\\sqrt{${n}}`,
      `${sum}\\sqrt{${2 * n}}`,
      `\\sqrt{${(a + b) * n}}`,
    ])
    return {
      expressionLatex: `${a}\\sqrt{${n}} + ${b}\\sqrt{${n}}`,
      options, correctIndex,
      hint: 'Los radicales semejantes se suman por sus coeficientes.',
      solutionLatex: `(${a}+${b})\\sqrt{${n}} = ${sum}\\sqrt{${n}}`,
    }
  }

  // ── like terms: subtract ─────────────────────────────────────────
  if (type === 'sub') {
    const n = pick([2, 3, 5, 6, 7])
    const a = randInt(3, 9), b = randInt(1, a - 1)
    const diff = a - b
    const correct = `${diff}\\sqrt{${n}}`
    const { options, correctIndex } = shuffleWithCorrect(correct, [
      `${a + b}\\sqrt{${n}}`,
      `${diff + 1}\\sqrt{${n}}`,
      `\\sqrt{${diff * n}}`,
    ])
    return {
      expressionLatex: `${a}\\sqrt{${n}} - ${b}\\sqrt{${n}}`,
      options, correctIndex,
      hint: 'Los radicales semejantes se restan por sus coeficientes.',
      solutionLatex: `(${a}-${b})\\sqrt{${n}} = ${diff}\\sqrt{${n}}`,
    }
  }

  // ── multiply same radical ────────────────────────────────────────
  if (type === 'mul-same') {
    const n = pick([2, 3, 5])
    const a = randInt(2, 5), b = randInt(2, 5)
    const result = a * b * n
    const correct = `${result}`
    const { options, correctIndex } = shuffleWithCorrect(correct, [
      `${a * b}\\sqrt{${n}}`,
      `${a * b}`,
      `${a + b}\\sqrt{${n}}`,
    ])
    return {
      expressionLatex: `${a}\\sqrt{${n}} \\cdot ${b}\\sqrt{${n}}`,
      options, correctIndex,
      hint: '√n · √n = n',
      solutionLatex: `${a * b} \\cdot (\\sqrt{${n}})^2 = ${a * b} \\cdot ${n} = ${result}`,
    }
  }

  // ── multiply different radicands ─────────────────────────────────
  if (type === 'mul-diff') {
    const pair = pick([[2, 8], [3, 12], [2, 18], [3, 27], [5, 20]] as const)
    const [ra, rb] = pair
    const ab = ra * rb
    const { coeff, radicand } = simplifyRadical(ab)
    const correct = radicalLatex(coeff, radicand)
    const { options, correctIndex } = shuffleWithCorrect(correct, [
      `\\sqrt{${ra + rb}}`,
      `${ra * rb}`,
      `\\sqrt{${ra}}+\\sqrt{${rb}}`,
    ])
    return {
      expressionLatex: `\\sqrt{${ra}} \\cdot \\sqrt{${rb}}`,
      options, correctIndex,
      hint: '√a · √b = √(a·b), luego simplifica.',
      solutionLatex: `\\sqrt{${ra} \\cdot ${rb}} = \\sqrt{${ab}} = ${correct}`,
    }
  }

  // ── power ────────────────────────────────────────────────────────
  if (type === 'power') {
    const n = pick([2, 3, 5, 6, 7])
    const a = randInt(2, 5)
    const result = a * a * n
    const correct = `${result}`
    const { options, correctIndex } = shuffleWithCorrect(correct, [
      `${a * n}`,
      `${a * a}\\sqrt{${n}}`,
      `${2 * a * n}`,
    ])
    return {
      expressionLatex: `(${a}\\sqrt{${n}})^2`,
      options, correctIndex,
      hint: '(a√n)² = a² · n',
      solutionLatex: `${a}^2 \\cdot (\\sqrt{${n}})^2 = ${a * a} \\cdot ${n} = ${result}`,
    }
  }

  // ── division ─────────────────────────────────────────────────────
  const pair = pick([[8, 2], [12, 3], [18, 2], [27, 3], [50, 2], [45, 5]] as const)
  const [ra, rb] = pair
  const quotient = ra / rb
  const { coeff, radicand } = simplifyRadical(quotient)
  const correct = radicalLatex(coeff, radicand)
  const { options, correctIndex } = shuffleWithCorrect(correct, [
    `\\sqrt{${ra + rb}}`,
    `\\dfrac{\\sqrt{${ra}}}{${rb}}`,
    `\\sqrt{${ra * rb}}`,
  ])
  return {
    expressionLatex: `\\dfrac{\\sqrt{${ra}}}{\\sqrt{${rb}}}`,
    options, correctIndex,
    hint: '√a / √b = √(a/b)',
    solutionLatex: `\\sqrt{\\dfrac{${ra}}{${rb}}} = \\sqrt{${quotient}} = ${correct}`,
  }
}
