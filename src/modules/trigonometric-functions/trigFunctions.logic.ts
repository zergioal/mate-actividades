import { fmt, formatPi } from '@/lib/math.utils'

export type TrigType = 'sin' | 'cos' | 'tan'

export interface TrigParams {
  type: TrigType
  A: number   // amplitude
  B: number   // frequency multiplier
  C: number   // phase shift (radians)
  D: number   // vertical shift
}

/** Evaluate y = A·f(Bx + C) + D */
export function evaluate(params: TrigParams, x: number): number {
  const { type, A, B, C, D } = params
  const arg = B * x + C
  switch (type) {
    case 'sin': return A * Math.sin(arg) + D
    case 'cos': return A * Math.cos(arg) + D
    case 'tan': return A * Math.tan(arg) + D
  }
}

/** Period of the function */
export function period(B: number): number {
  return (2 * Math.PI) / Math.abs(B)
}

/** Phase shift (x-value where the inner argument is 0) */
export function phaseShift(B: number, C: number): number {
  return -C / B
}

/** Build the LaTeX equation string */
export function buildLatex(p: TrigParams): string {
  const { type, A, B, C, D } = p

  const aStr  = A === 1 ? '' : A === -1 ? '-' : fmt(A, 2)
  const bStr  = B === 1 ? '' : B === -1 ? '-' : fmt(B, 2)
  const cStr  = C === 0 ? '' : C > 0 ? `+ ${formatPi(C)}` : `- ${formatPi(Math.abs(C))}`
  const dStr  = D === 0 ? '' : D > 0 ? `+ ${fmt(D, 2)}` : `- ${fmt(Math.abs(D), 2)}`

  return `y = ${aStr}\\${type}\\left(${bStr}x ${cStr}\\right) ${dStr}`
}

/** Key properties as display strings */
export function getProperties(p: TrigParams): Array<{ label: string; value: string; latex?: string }> {
  const T = period(p.B)
  const ps = phaseShift(p.B, p.C)

  const props: Array<{ label: string; value: string; latex?: string }> = [
    { label: 'Amplitud',           value: `|${fmt(p.A, 2)}|`, latex: `|A| = ${fmt(Math.abs(p.A), 2)}` },
    { label: 'Período',            value: formatPi(T),         latex: `T = \\dfrac{2\\pi}{|B|} = ${formatPi(T)}` },
    { label: 'Desplaz. fase',      value: formatPi(ps),        latex: `\\phi = -\\dfrac{C}{B} = ${formatPi(ps)}` },
    { label: 'Desplaz. vertical',  value: fmt(p.D, 2),         latex: `D = ${fmt(p.D, 2)}` },
  ]

  if (p.type !== 'tan') {
    props.push({ label: 'Máximo', value: fmt(Math.abs(p.A) + p.D, 2) })
    props.push({ label: 'Mínimo', value: fmt(-Math.abs(p.A) + p.D, 2) })
  }

  return props
}
