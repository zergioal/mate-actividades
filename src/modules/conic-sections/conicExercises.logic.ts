import { pick, randInt } from '@/lib/math.utils'
import type { ConicType } from './conicSections.logic'

export interface ConicExercise {
  conicType: ConicType
  questionText: string          // plain text preamble
  questionLatex: string         // equation/expression shown in KaTeX
  options: string[]             // 4 KaTeX/text options
  correctIndex: number
  hint: string
  solutionLatex: string         // full worked explanation (KaTeX)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle4(
  correct: string, w1: string, w2: string, w3: string,
): { options: string[]; correctIndex: number } {
  const pool = [correct, w1, w2, w3]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return { options: pool, correctIndex: pool.indexOf(correct) }
}

/** (x - h) or (x + |h|) in LaTeX */
function shift(val: number, axis: string): string {
  if (val === 0) return axis
  if (val > 0)   return `(${axis} - ${val})`
  return `(${axis} + ${Math.abs(val)})`
}

function signStr(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}

// ─── Circle Exercises ─────────────────────────────────────────────────────────

function circleCenter(): ConicExercise {
  const h = randInt(-4, 4), k = randInt(-4, 4)
  const r = randInt(1, 5)
  const eq = `${shift(h,'x')}^{2} + ${shift(k,'y')}^{2} = ${r*r}`

  const correct = `(${h},\\;${k})`
  const { options, correctIndex } = shuffle4(
    correct,
    `(${-h},\\;${-k})`,
    `(${k},\\;${h})`,
    `(${h + 1},\\;${k - 1})`,
  )
  return {
    conicType: 'circle',
    questionText: '¿Cuál es el centro de la circunferencia?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'La forma canónica es (x−h)²+(y−k)²=r². El centro es (h, k).',
    solutionLatex: `\\text{Centro} = (${h},\\;${k})`,
  }
}

function circleRadius(): ConicExercise {
  const h = randInt(-3, 3), k = randInt(-3, 3)
  const r = randInt(1, 6)
  const eq = `${shift(h,'x')}^{2} + ${shift(k,'y')}^{2} = ${r*r}`

  const correct = `r = ${r}`
  const { options, correctIndex } = shuffle4(
    correct,
    `r = ${r*r}`,
    `r = ${r + 1}`,
    `r = ${Math.max(1, r - 1)}`,
  )
  return {
    conicType: 'circle',
    questionText: '¿Cuál es el radio de la circunferencia?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'El radio es la raíz cuadrada del término independiente: r = √(r²).',
    solutionLatex: `r^2 = ${r*r} \\Rightarrow r = \\sqrt{${r*r}} = ${r}`,
  }
}

function circleEquation(): ConicExercise {
  const h = randInt(-3, 3), k = randInt(-3, 3)
  const r = randInt(2, 5)
  const eq = `${shift(h,'x')}^{2} + ${shift(k,'y')}^{2} = ${r*r}`
  const wrong1 = `${shift(h,'x')}^{2} + ${shift(k,'y')}^{2} = ${r}`
  const wrong2 = `${shift(-h,'x')}^{2} + ${shift(-k,'y')}^{2} = ${r*r}`
  const wrong3 = `${shift(h,'x')}^{2} - ${shift(k,'y')}^{2} = ${r*r}`

  const { options, correctIndex } = shuffle4(eq, wrong1, wrong2, wrong3)
  return {
    conicType: 'circle',
    questionText: `¿Cuál es la ecuación de la circunferencia con centro (${h}, ${k}) y radio ${r}?`,
    questionLatex: `\\text{Centro}=(${h},\\;${k}),\\quad r=${r}`,
    options, correctIndex,
    hint: 'Sustituye directamente: (x−h)²+(y−k)²=r².',
    solutionLatex: eq,
  }
}

function circleDiameter(): ConicExercise {
  const h = randInt(-3, 3), k = randInt(-3, 3)
  const r = randInt(2, 6)
  const eq = `${shift(h,'x')}^{2} + ${shift(k,'y')}^{2} = ${r*r}`
  const d = 2 * r

  const correct = `d = ${d}`
  const { options, correctIndex } = shuffle4(
    correct,
    `d = ${r}`,
    `d = ${r*r}`,
    `d = ${d + 2}`,
  )
  return {
    conicType: 'circle',
    questionText: '¿Cuánto mide el diámetro?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'El diámetro es el doble del radio.',
    solutionLatex: `r = ${r} \\Rightarrow d = 2r = ${d}`,
  }
}

// ─── Parabola Exercises ───────────────────────────────────────────────────────

function parabolaVertex(): ConicExercise {
  const h = randInt(-4, 4), k = randInt(-4, 4)
  const a = pick([0.5, 1, 2, -1, -0.5, -2] as const)
  const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`
  const eq = `y ${k >= 0 ? signStr(-k) : `+ ${-k}`} = ${aStr}${shift(h,'x')}^{2}`
    .replace('+ -', '- ').replace('- -', '+ ')
  const eqClean = `y ${k > 0 ? '- ' + k : k < 0 ? '+ ' + Math.abs(k) : ''} = ${aStr}${shift(h,'x')}^{2}`.trim()

  const correct = `(${h},\\;${k})`
  const { options, correctIndex } = shuffle4(
    correct,
    `(${-h},\\;${-k})`,
    `(${h},\\;${-k})`,
    `(${-h},\\;${k})`,
  )
  return {
    conicType: 'parabola',
    questionText: '¿Cuál es el vértice de la parábola?',
    questionLatex: eqClean,
    options, correctIndex,
    hint: 'La forma vértice es y−k = a(x−h)². El vértice es (h, k).',
    solutionLatex: `\\text{Vértice} = (${h},\\;${k})`,
  }
}

function parabolaOpening(): ConicExercise {
  const h = randInt(-3, 3), k = randInt(-3, 3)
  const a = pick([-2, -1, -0.5, 0.5, 1, 2] as const)
  const vertical = pick([true, false] as const)
  const aStr = Math.abs(a) === 1 ? (a < 0 ? '-' : '') : `${a}`

  let eq: string
  let correct: string
  let w1: string, w2: string, w3: string
  if (vertical) {
    eq = `y ${k > 0 ? '- ' + k : k < 0 ? '+ ' + Math.abs(k) : ''} = ${aStr}${shift(h,'x')}^{2}`.trim()
    correct = a > 0 ? 'Hacia arriba' : 'Hacia abajo'
    w1 = a > 0 ? 'Hacia abajo' : 'Hacia arriba'
    w2 = 'Hacia la derecha'
    w3 = 'Hacia la izquierda'
  } else {
    eq = `x ${h > 0 ? '- ' + h : h < 0 ? '+ ' + Math.abs(h) : ''} = ${aStr}${shift(k,'y')}^{2}`.trim()
    correct = a > 0 ? 'Hacia la derecha' : 'Hacia la izquierda'
    w1 = a > 0 ? 'Hacia la izquierda' : 'Hacia la derecha'
    w2 = 'Hacia arriba'
    w3 = 'Hacia abajo'
  }
  const { options, correctIndex } = shuffle4(correct, w1, w2, w3)
  return {
    conicType: 'parabola',
    questionText: '¿Hacia dónde abre la parábola?',
    questionLatex: eq,
    options, correctIndex,
    hint: vertical
      ? 'Parábola vertical: a > 0 abre arriba, a < 0 abre abajo.'
      : 'Parábola horizontal: a > 0 abre a la derecha, a < 0 a la izquierda.',
    solutionLatex: `a = ${a} ${a > 0 ? '> 0' : '< 0'} \\Rightarrow \\text{${correct}}`,
  }
}

function parabolaFocus(): ConicExercise {
  // Use simple cases where 1/(4a) is a nice number: a = 1/4 → focus at 1, a=1 → 1/4
  const cases = [
    { h: 0, k: 0, a: 0.25, vert: true, focTxt: '(0,\\;1)', eq: 'y = \\dfrac{1}{4}x^{2}' },
    { h: 0, k: 0, a: 1,    vert: true, focTxt: '\\left(0,\\;\\dfrac{1}{4}\\right)', eq: 'y = x^{2}' },
    { h: 0, k: 0, a: -0.25,vert: true, focTxt: '(0,\\;-1)', eq: 'y = -\\dfrac{1}{4}x^{2}' },
    { h: 2, k: 1, a: 0.25, vert: true, focTxt: '(2,\\;2)', eq: 'y - 1 = \\dfrac{1}{4}(x-2)^{2}' },
    { h: 0, k: 0, a: 0.25, vert: false, focTxt: '(1,\\;0)', eq: 'x = \\dfrac{1}{4}y^{2}' },
  ]
  const c = pick(cases)
  const focLatex = c.focTxt

  // Distractors: wrong signs / wrong value
  const { options, correctIndex } = shuffle4(
    focLatex,
    `(${c.h},\\;${c.k})`,          // vertex, not focus
    `(-${c.h > 0 ? c.h : 1},\\;${c.k})`,
    `(${c.h},\\;${c.k + 2})`,
  )
  return {
    conicType: 'parabola',
    questionText: '¿Cuáles son las coordenadas del foco?',
    questionLatex: c.eq,
    options, correctIndex,
    hint: 'El foco está a distancia p = 1/(4a) del vértice.',
    solutionLatex: `p = \\dfrac{1}{4a} \\Rightarrow F = ${focLatex}`,
  }
}

// ─── Ellipse Exercises ────────────────────────────────────────────────────────

function ellipseAxes(): ConicExercise {
  const a = randInt(3, 6), b = randInt(1, a - 1)
  const eq = `\\dfrac{x^{2}}{${a*a}} + \\dfrac{y^{2}}{${b*b}} = 1`

  const correct = `a = ${a},\\; b = ${b}`
  const { options, correctIndex } = shuffle4(
    correct,
    `a = ${a*a},\\; b = ${b*b}`,
    `a = ${b},\\; b = ${a}`,
    `a = ${a + 1},\\; b = ${b}`,
  )
  return {
    conicType: 'ellipse',
    questionText: '¿Cuáles son los semiejes de la elipse?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'En x²/a²+y²/b²=1, el semieje mayor es a = √(denominador de x²).',
    solutionLatex: `a = \\sqrt{${a*a}} = ${a},\\quad b = \\sqrt{${b*b}} = ${b}`,
  }
}

function ellipseFocalDist(): ConicExercise {
  // Choose a, b with integer c: Pythagorean-like triples
  const triples: [number, number, number][] = [[5,4,3],[5,3,4],[10,8,6],[13,12,5],[17,15,8]]
  const [hyp, leg1, leg2] = pick(triples)
  // a = hyp/2 -- no, let's just pick clean values
  const a2 = hyp, b2 = leg1, c2 = leg2  // a²=25 etc... actually set a=5,b=4,c=3
  const eq = `\\dfrac{x^{2}}{${a2*a2}} + \\dfrac{y^{2}}{${b2*b2}} = 1`
  const cVal = c2

  const correct = `c = ${cVal}`
  const { options, correctIndex } = shuffle4(
    correct,
    `c = ${cVal + 1}`,
    `c = ${a2*a2 + b2*b2}`,
    `c = ${a2 + b2}`,
  )
  return {
    conicType: 'ellipse',
    questionText: '¿Cuánto vale c (distancia focal)?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'c = √(a² − b²) para elipse con a > b.',
    solutionLatex: `c = \\sqrt{${a2}^2 - ${b2}^2} = \\sqrt{${a2*a2 - b2*b2}} = ${cVal}`,
  }
}

function ellipseOrientation(): ConicExercise {
  const horiz = pick([true, false] as const)
  const a = randInt(3, 6), b = randInt(1, a - 1)
  const eq = horiz
    ? `\\dfrac{x^{2}}{${a*a}} + \\dfrac{y^{2}}{${b*b}} = 1`
    : `\\dfrac{x^{2}}{${b*b}} + \\dfrac{y^{2}}{${a*a}} = 1`

  const correct = horiz ? 'Eje mayor horizontal' : 'Eje mayor vertical'
  const { options, correctIndex } = shuffle4(
    correct,
    horiz ? 'Eje mayor vertical' : 'Eje mayor horizontal',
    'Es una circunferencia',
    'No es una elipse',
  )
  return {
    conicType: 'ellipse',
    questionText: '¿Cuál es la orientación del eje mayor de la elipse?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'El eje mayor está en la dirección del denominador mayor.',
    solutionLatex: horiz
      ? `${a*a} > ${b*b} \\Rightarrow \\text{eje mayor horizontal}`
      : `${a*a} > ${b*b} \\Rightarrow \\text{eje mayor vertical}`,
  }
}

function ellipseEccentricity(): ConicExercise {
  const triples: [number, number, number][] = [[5,4,3],[5,3,4],[13,12,5],[10,6,8]]
  const [a2, b2, c2] = pick(triples)
  const eq = `\\dfrac{x^{2}}{${a2*a2}} + \\dfrac{y^{2}}{${b2*b2}} = 1`
  const eNum = c2, eDen = a2
  const eLatex = `\\dfrac{${eNum}}{${eDen}}`

  const { options, correctIndex } = shuffle4(
    eLatex,
    `\\dfrac{${eNum+1}}{${eDen}}`,
    `\\dfrac{${c2*c2}}{${a2*a2}}`,
    `\\dfrac{${b2}}{${a2}}`,
  )
  return {
    conicType: 'ellipse',
    questionText: '¿Cuál es la excentricidad de la elipse?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'e = c/a, donde c = √(a²−b²). Para una elipse, 0 < e < 1.',
    solutionLatex: `c = ${c2},\\quad e = \\dfrac{c}{a} = \\dfrac{${c2}}{${a2}} = ${eLatex}`,
  }
}

// ─── Hyperbola Exercises ──────────────────────────────────────────────────────

function hyperbolaAsymptotes(): ConicExercise {
  const a = randInt(2, 5), b = randInt(1, 4)
  const horiz = pick([true, false] as const)
  const eq = horiz
    ? `\\dfrac{x^{2}}{${a*a}} - \\dfrac{y^{2}}{${b*b}} = 1`
    : `\\dfrac{y^{2}}{${a*a}} - \\dfrac{x^{2}}{${b*b}} = 1`

  const slopeNum = horiz ? b : a
  const slopeDen = horiz ? a : b
  const slopeStr = slopeDen === 1 ? `${slopeNum}` : `\\dfrac{${slopeNum}}{${slopeDen}}`
  const correct = `y = \\pm ${slopeStr} x`

  const { options, correctIndex } = shuffle4(
    correct,
    `y = \\pm ${slopeDen === 1 ? slopeNum + 1 : `\\dfrac{${slopeNum+1}}{${slopeDen}}`} x`,
    `y = \\pm ${slopeStr} x^{2}`,
    `y = ${slopeStr} x`,   // missing ±
  )
  return {
    conicType: 'hyperbola',
    questionText: '¿Cuáles son las ecuaciones de las asíntotas?',
    questionLatex: eq,
    options, correctIndex,
    hint: horiz ? 'Asíntotas: y = ±(b/a)x' : 'Asíntotas: y = ±(a/b)x',
    solutionLatex: `y = \\pm \\dfrac{${slopeNum}}{${slopeDen}} x`,
  }
}

function hyperbolaFoci(): ConicExercise {
  const a = randInt(2, 5), b = randInt(1, 4)
  const c = Math.round(Math.sqrt(a * a + b * b) * 100) / 100
  const horiz = pick([true, false] as const)
  const eq = horiz
    ? `\\dfrac{x^{2}}{${a*a}} - \\dfrac{y^{2}}{${b*b}} = 1`
    : `\\dfrac{y^{2}}{${a*a}} - \\dfrac{x^{2}}{${b*b}} = 1`

  const cLatex = `c = \\sqrt{${a*a + b*b}} \\approx ${c}`
  const correct = cLatex
  const { options, correctIndex } = shuffle4(
    correct,
    `c = \\sqrt{${a*a - b*b > 0 ? a*a - b*b : b*b - a*a}}`,
    `c = ${a + b}`,
    `c = \\sqrt{${a*a}} = ${a}`,
  )
  return {
    conicType: 'hyperbola',
    questionText: '¿Cuánto vale c (distancia focal)?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'Para hipérbola: c = √(a² + b²). Notar que c > a.',
    solutionLatex: `c = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a+b*b}} \\approx ${c}`,
  }
}

function hyperbolaOrientation(): ConicExercise {
  const horiz = pick([true, false] as const)
  const a = randInt(2, 5), b = randInt(2, 4)
  const eq = horiz
    ? `\\dfrac{x^{2}}{${a*a}} - \\dfrac{y^{2}}{${b*b}} = 1`
    : `\\dfrac{y^{2}}{${a*a}} - \\dfrac{x^{2}}{${b*b}} = 1`

  const correct = horiz ? 'Eje real horizontal (ramas izq/der)' : 'Eje real vertical (ramas arriba/abajo)'
  const { options, correctIndex } = shuffle4(
    correct,
    horiz ? 'Eje real vertical (ramas arriba/abajo)' : 'Eje real horizontal (ramas izq/der)',
    'Es una elipse',
    'No tiene ramas reales',
  )
  return {
    conicType: 'hyperbola',
    questionText: '¿Cuál es la orientación de la hipérbola?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'Si el término positivo es x², las ramas van a izquierda/derecha (horizontal).',
    solutionLatex: horiz
      ? '\\text{Término } x^2 \\text{ positivo} \\Rightarrow \\text{eje real horizontal}'
      : '\\text{Término } y^2 \\text{ positivo} \\Rightarrow \\text{eje real vertical}',
  }
}

function hyperbolaVertices(): ConicExercise {
  const a = randInt(2, 5)
  const b = randInt(1, 4)
  const h = randInt(-2, 2), k = randInt(-2, 2)
  const eq = `\\dfrac{${shift(h,'x')}^{2}}{${a*a}} - \\dfrac{${shift(k,'y')}^{2}}{${b*b}} = 1`

  const correct = `(${h - a},\\;${k})\\text{ y }(${h + a},\\;${k})`
  const { options, correctIndex } = shuffle4(
    correct,
    `(${h},\\;${k - a})\\text{ y }(${h},\\;${k + a})`,
    `(${h - b},\\;${k})\\text{ y }(${h + b},\\;${k})`,
    `(${h - a*a},\\;${k})\\text{ y }(${h + a*a},\\;${k})`,
  )
  return {
    conicType: 'hyperbola',
    questionText: '¿Cuáles son los vértices de la hipérbola?',
    questionLatex: eq,
    options, correctIndex,
    hint: 'Para hipérbola horizontal, los vértices están en (h±a, k).',
    solutionLatex: `V_1=(${h-a},\\;${k}),\\quad V_2=(${h+a},\\;${k})`,
  }
}

// ─── Public generators ────────────────────────────────────────────────────────

const CIRCLE_GENS    = [circleCenter, circleRadius, circleEquation, circleDiameter]
const PARABOLA_GENS  = [parabolaVertex, parabolaOpening, parabolaFocus]
const ELLIPSE_GENS   = [ellipseAxes, ellipseFocalDist, ellipseOrientation, ellipseEccentricity]
const HYPERBOLA_GENS = [hyperbolaAsymptotes, hyperbolaFoci, hyperbolaOrientation, hyperbolaVertices]

const GENS: Record<ConicType, Array<() => ConicExercise>> = {
  circle: CIRCLE_GENS,
  parabola: PARABOLA_GENS,
  ellipse: ELLIPSE_GENS,
  hyperbola: HYPERBOLA_GENS,
}

let _lastGen: string = ''

export function generateExercise(type: ConicType): ConicExercise {
  const pool = GENS[type]
  let gen: () => ConicExercise
  let key: string
  do {
    gen = pick(pool)
    key = `${type}-${gen.name}`
  } while (key === _lastGen && pool.length > 1)
  _lastGen = key

  for (let i = 0; i < 10; i++) {
    try { return gen() } catch { /* retry */ }
  }
  return gen()
}
