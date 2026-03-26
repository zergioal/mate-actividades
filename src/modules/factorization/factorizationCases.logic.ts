import { randInt, pick } from '@/lib/math.utils'

export type FactorizationCaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface MCQChallenge {
  caseNumber: FactorizationCaseNumber
  expressionLatex: string
  options: string[]       // 4 LaTeX strings
  correctIndex: number
  hint: string
  solutionLatex: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle4(correct: string, w1: string, w2: string, w3: string): { options: string[]; correctIndex: number } {
  const pool = [correct, w1, w2, w3]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return { options: pool, correctIndex: pool.indexOf(correct) }
}

/** Signed term in a polynomial, e.g. "+3x^{2}" or "-x" */
function pt(c: number, d: number, isFirst = false): string {
  if (c === 0) return ''
  const sign = isFirst ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + '
  const abs  = Math.abs(c)
  const cStr = abs === 1 && d > 0 ? '' : `${abs}`
  const xStr = d === 0 ? '' : d === 1 ? 'x' : `x^{${d}}`
  return `${sign}${cStr}${xStr}`
}

function poly2(a: number, b: number, c: number): string {
  const t1 = pt(a, 2, true)
  const t2 = pt(b, 1, t1 === '')
  const t3 = pt(c, 0, t1 === '' && t2 === '')
  return (t1 + t2 + t3) || '0'
}

// ─── Case 1: Factor Común ────────────────────────────────────────────────────

export function genCase1(): MCQChallenge {
  const k  = randInt(2, 5)            // numeric GCF
  const m  = pick([1, 2] as const)    // variable power of GCF
  const a1 = randInt(2, 5), b1 = randInt(1, 6), c1 = randInt(1, 5)
  // inner polynomial: a1·x^2 + b1·x + c1
  const A = k * a1, B = k * b1, C = k * c1  // expanded coefficients

  // Build the expanded expression: A·x^(m+2) + B·x^(m+1) + C·x^m
  const t1 = pt(A, m + 2, true)
  const t2 = pt(B, m + 1)
  const t3 = pt(C, m)
  const expr = t1 + t2 + t3

  // Correct factored form
  const kxm  = m === 1 ? `${k}x` : `${k}x^{${m}}`
  const inner = poly2(a1, b1, c1)
  const correct = `${kxm}(${inner})`

  // Distractors
  const w1 = `${k}(${poly2(a1, m + 2 === 2 ? b1 : 0, C / k)})` // forgot x^m factor
  const w2 = `x^{${m}}(${poly2(A, B, C)})` // forgot numeric GCF
  const w3 = `${kxm}(${poly2(a1, b1, -c1)})` // sign error on last term

  const { options, correctIndex } = shuffle4(correct, w1, w2, w3)
  return {
    caseNumber: 1,
    expressionLatex: expr,
    options, correctIndex,
    hint: 'Identifica el máximo factor común (MFC) entre todos los términos.',
    solutionLatex: `${kxm}(${inner})`,
  }
}

// ─── Case 2: Diferencia de Cuadrados ─────────────────────────────────────────

export function genCase2(): MCQChallenge {
  const a = pick([1, 2, 3] as const)  // ax
  const b = randInt(2, 8)

  // Expression: (ax)^2 - b^2
  const A2 = a * a, B2 = b * b
  const aStr = a === 1 ? '' : `${a}`
  const expr = A2 === 1 ? `x^{2} - ${B2}` : `${A2}x^{2} - ${B2}`

  // Correct: (ax + b)(ax - b)
  const fa = `(${aStr}x + ${b})`
  const fb = `(${aStr}x - ${b})`
  const correct = `${fa}${fb}`

  const { options, correctIndex } = shuffle4(
    correct,
    `(${aStr}x - ${b})^2`,           // wrong: perfect square
    `(${aStr}x + ${b})^2`,           // wrong: perfect square other sign
    `(${A2}x + ${b})(x - ${b})`,     // wrong: inconsistent factoring
  )
  return {
    caseNumber: 2,
    expressionLatex: expr,
    options, correctIndex,
    hint: `a² - b² = (a + b)(a - b). Aquí a = ${aStr}x y b = ${b}.`,
    solutionLatex: `(${aStr}x)^{2} - ${b}^{2} = (${aStr}x+${b})(${aStr}x-${b})`,
  }
}

// ─── Case 3: Trinomio Cuadrado Perfecto ───────────────────────────────────────

export function genCase3(): MCQChallenge {
  const a = pick([1, 2, 3] as const)
  const b = randInt(2, 7)
  const sign = pick([1, -1] as const)

  // (ax ± b)² = a²x² ± 2abx + b²
  const A2 = a * a, twoAB = 2 * a * b, B2 = b * b
  const signStr = sign > 0 ? '+' : '-'
  const middleSign = sign > 0 ? '+' : '-'

  const aStr = a === 1 ? '' : `${a}`
  const expr =
    A2 === 1
      ? `x^{2} ${middleSign} ${twoAB}x + ${B2}`
      : `${A2}x^{2} ${middleSign} ${twoAB}x + ${B2}`

  const correct = `(${aStr}x ${signStr} ${b})^{2}`

  const { options, correctIndex } = shuffle4(
    correct,
    `(${aStr}x ${sign > 0 ? '-' : '+'} ${b})^{2}`,      // wrong sign
    `(${aStr}x + ${b})(${aStr}x - ${b})`,                 // wrong: diff of squares
    `(${A2}x ${signStr} ${b})(x ${signStr} ${b})`,         // wrong factoring
  )
  return {
    caseNumber: 3,
    expressionLatex: expr,
    options, correctIndex,
    hint: `(a ± b)² = a² ± 2ab + b². Aquí a = ${aStr}x, b = ${b}.`,
    solutionLatex: `(${aStr}x ${signStr} ${b})^{2}`,
  }
}

// ─── Case 4: Trinomio Mónico x² + bx + c ────────────────────────────────────

export function genCase4(): MCQChallenge {
  // x² + bx + c = (x + p)(x + q)  where p + q = b, p*q = c
  const p = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6] as const)
  const q = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6] as const)
  const b = p + q, c = p * q

  const expr = poly2(1, b, c)

  const correct = `(x${p >= 0 ? '+' : ''}${p})(x${q >= 0 ? '+' : ''}${q})`

  const { options, correctIndex } = shuffle4(
    correct,
    `(x${p >= 0 ? '+' : ''}${p})(x${-q >= 0 ? '+' : ''}${-q})`,
    `(x${p >= 0 ? '+' : ''}${-p})(x${q >= 0 ? '+' : ''}${q})`,
    `(x${c >= 0 ? '+' : ''}${c})(x${b >= 0 ? '+' : ''}${b})`,
  )
  return {
    caseNumber: 4,
    expressionLatex: expr,
    options, correctIndex,
    hint: 'Busca dos números p, q tal que p + q = b y p · q = c.',
    solutionLatex: `(x${p >= 0 ? '+' : ''}${p})(x${q >= 0 ? '+' : ''}${q})`,
  }
}

// ─── Case 5: Trinomio No Mónico ax² + bx + c ─────────────────────────────────

export function genCase5(): MCQChallenge {
  const ra = pick([2, 3] as const)
  const sa = 1
  const rp = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const)
  const sq = pick([-4, -3, -2, -1, 1, 2, 3, 4] as const)

  const a = ra * sa
  const b = ra * sq + sa * rp
  const c = rp * sq
  const expr = poly2(a, b, c)

  const rStr = `${ra}`
  const correct = `(${rStr}x${rp >= 0 ? '+' : ''}${rp})(x${sq >= 0 ? '+' : ''}${sq})`

  const { options, correctIndex } = shuffle4(
    correct,
    `(${rStr}x${rp >= 0 ? '+' : ''}${-rp})(x${sq >= 0 ? '+' : ''}${sq})`,
    `(${rStr}x${sq >= 0 ? '+' : ''}${sq})(x${rp >= 0 ? '+' : ''}${rp})`,
    `(x${rp >= 0 ? '+' : ''}${rp})(${rStr}x${sq >= 0 ? '+' : ''}${-sq})`,
  )
  return {
    caseNumber: 5,
    expressionLatex: expr,
    options, correctIndex,
    hint: `Usa el método de la X: busca dos números que sumen ${b} y multipliquen ${a * c}.`,
    solutionLatex: correct,
  }
}

// ─── Case 6: Suma / Diferencia de Cubos ──────────────────────────────────────

export function genCase6(): MCQChallenge {
  const a = pick([1, 2, 3] as const)
  const b = randInt(1, 4)
  const isSum = pick([true, false] as const)

  const A3 = a * a * a, B3 = b * b * b
  const A2 = a * a, AB = a * b, B2 = b * b

  const aStr = a === 1 ? '' : `${a}`
  const A3str = A3 === 1 ? '' : `${A3}`
  const expr = `${A3str}x^{3} ${isSum ? '+' : '-'} ${B3}`

  const sign1 = isSum ? '+' : '-'
  const sign2 = isSum ? '-' : '+'

  const factor1 = `(${aStr}x ${sign1} ${b})`
  const factor2 = `(${A2 === 1 ? '' : A2}x^{2} ${sign2} ${AB}x + ${B2})`
  const correct = `${factor1}${factor2}`

  const w1 = `(${aStr}x ${sign2} ${b})(${A2 === 1 ? '' : A2}x^{2} ${sign1} ${AB}x + ${B2})` // wrong signs
  const w2 = `(${aStr}x ${sign1} ${b})^{3}`
  const w3 = `(${aStr}x ${sign1} ${b})(${A2 === 1 ? '' : A2}x^{2} ${sign2} ${AB}x - ${B2})` // middle sign flipped

  const { options, correctIndex } = shuffle4(correct, w1, w2, w3)
  return {
    caseNumber: 6,
    expressionLatex: expr,
    options, correctIndex,
    hint: `a³ ${isSum ? '+' : '-'} b³ = (a ${isSum ? '+' : '-'} b)(a² ${isSum ? '∓' : '±'} ab + b²)`,
    solutionLatex: correct,
  }
}

// ─── Case 7: Factorización por Agrupación ─────────────────────────────────────

export function genCase7(): MCQChallenge {
  // Pattern: ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y)
  const a = randInt(2, 6)
  const b = randInt(2, 6)
  const x = pick([2, 3, 5] as const)  // coefficient of 'x' group
  const y = randInt(2, 7)              // constant

  // Expression: a*x·t + a*y + b*x·t + b*y  with variable t
  // Let's use: a*x·t² + a*y*t + b*x*t + b*y  to make it less trivial
  // = at(xt + y) + b(xt + y) = (at + b)(xt + y)
  // So: axt² + ayt + bxt + by

  const c1 = a * x   // coeff of t²
  const c2 = a * y   // coeff of t (first group)
  const c3 = b * x   // coeff of t (second group)
  const c4 = b * y   // constant

  const bMid = c2 + c3  // total coeff of t
  const expr = `${c1}x^{2} + ${bMid}x + ${c4}` +
    (c2 !== c3 ? ` \\;\\text{(grupos: }${c1}x^{2}+${c2}x\\text{ y }${c3}x+${c4}\\text{)}` : '')

  // Simpler: just show 4-term polynomial
  const expr2 = `${c1}x^{2} + ${c2}x + ${c3}x + ${c4}`

  const correct = `(${a}x + ${b})(${x}x + ${y})`
  const w1 = `(${a}x - ${b})(${x}x + ${y})`
  const w2 = `(${a}x + ${b})(${x}x - ${y})`
  const w3 = `(${a + b}x)(${x}x + ${y})`

  const { options, correctIndex } = shuffle4(correct, w1, w2, w3)
  return {
    caseNumber: 7,
    expressionLatex: expr2,
    options, correctIndex,
    hint: `Agrupa los primeros dos y últimos dos términos: (${c1}x²+${c2}x) + (${c3}x+${c4})`,
    solutionLatex: `${a}x(${x}x+${y})+${b}(${x}x+${y}) = (${a}x+${b})(${x}x+${y})`,
  }
}

// ─── Public dispatcher ────────────────────────────────────────────────────────

const GENERATORS: Record<FactorizationCaseNumber, () => MCQChallenge> = {
  1: genCase1, 2: genCase2, 3: genCase3,
  4: genCase4, 5: genCase5, 6: genCase6, 7: genCase7,
}

export function generateCase(n: FactorizationCaseNumber): MCQChallenge {
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      return GENERATORS[n]()
    } catch {
      // retry on edge-case generation failures
    }
  }
  return GENERATORS[n]()
}

export const CASE_LABELS: Record<FactorizationCaseNumber, string> = {
  1: 'Factor Común',
  2: 'Dif. de Cuadrados',
  3: 'Cuad. Perfecto',
  4: 'Trinomio x²+bx+c',
  5: 'Trinomio ax²+bx+c',
  6: 'Suma/Dif. Cubos',
  7: 'Agrupación',
}
