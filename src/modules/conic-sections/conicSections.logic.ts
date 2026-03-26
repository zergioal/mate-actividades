import { fmt } from '@/lib/math.utils'

export type ConicType = 'circle' | 'parabola' | 'ellipse' | 'hyperbola'

// ─── Parameter interfaces per conic type ──────────────────────────────────────

export interface CircleParams    { h: number; k: number; r: number }
export interface ParabolaParams  { h: number; k: number; a: number; vertical: boolean }
export interface EllipseParams   { h: number; k: number; a: number; b: number }
export interface HyperbolaParams { h: number; k: number; a: number; b: number; horizontal: boolean }

// ─── Equation builders ────────────────────────────────────────────────────────

function centerShift(val: number, axis: string): string {
  if (val === 0) return axis
  if (val > 0)   return `(${axis} - ${fmt(val, 2)})`
  return `(${axis} + ${fmt(Math.abs(val), 2)})`
}

export function circleEquationLatex(p: CircleParams): string {
  return `${centerShift(p.h, 'x')}^2 + ${centerShift(p.k, 'y')}^2 = ${fmt(p.r * p.r, 2)}`
}

export function parabolaEquationLatex(p: ParabolaParams): string {
  const aStr = p.a === 1 ? '' : p.a === -1 ? '-' : fmt(p.a, 2)
  if (p.vertical) {
    return `${centerShift(p.k, 'y')} = ${aStr}${centerShift(p.h, 'x')}^2`
  }
  return `${centerShift(p.h, 'x')} = ${aStr}${centerShift(p.k, 'y')}^2`
}

export function ellipseEquationLatex(p: EllipseParams): string {
  return `\\dfrac{${centerShift(p.h, 'x')}^2}{${fmt(p.a * p.a, 2)}} + \\dfrac{${centerShift(p.k, 'y')}^2}{${fmt(p.b * p.b, 2)}} = 1`
}

export function hyperbolaEquationLatex(p: HyperbolaParams): string {
  if (p.horizontal) {
    return `\\dfrac{${centerShift(p.h, 'x')}^2}{${fmt(p.a * p.a, 2)}} - \\dfrac{${centerShift(p.k, 'y')}^2}{${fmt(p.b * p.b, 2)}} = 1`
  }
  return `\\dfrac{${centerShift(p.k, 'y')}^2}{${fmt(p.a * p.a, 2)}} - \\dfrac{${centerShift(p.h, 'x')}^2}{${fmt(p.b * p.b, 2)}} = 1`
}

// ─── Key properties ───────────────────────────────────────────────────────────

export function circleProperties(p: CircleParams): string[] {
  return [
    `Centro: (${fmt(p.h, 2)}, ${fmt(p.k, 2)})`,
    `Radio: r = ${fmt(p.r, 2)}`,
    `Diámetro: ${fmt(2 * p.r, 2)}`,
    `Área: π·r² ≈ ${fmt(Math.PI * p.r * p.r, 2)}`,
  ]
}

export function parabolaProperties(p: ParabolaParams): string[] {
  const focus = p.vertical
    ? { x: p.h, y: p.k + 1 / (4 * p.a) }
    : { x: p.h + 1 / (4 * p.a), y: p.k }
  const directrix = p.vertical
    ? `y = ${fmt(p.k - 1 / (4 * p.a), 2)}`
    : `x = ${fmt(p.h - 1 / (4 * p.a), 2)}`

  return [
    `Vértice: (${fmt(p.h, 2)}, ${fmt(p.k, 2)})`,
    `Foco: (${fmt(focus.x, 2)}, ${fmt(focus.y, 2)})`,
    `Directriz: ${directrix}`,
    `Abre hacia: ${p.a > 0 ? (p.vertical ? 'arriba' : 'derecha') : (p.vertical ? 'abajo' : 'izquierda')}`,
  ]
}

export function ellipseProperties(p: EllipseParams): string[] {
  const major = Math.max(p.a, p.b)
  const minor = Math.min(p.a, p.b)
  const c = Math.sqrt(Math.max(0, major * major - minor * minor))
  const e = c / major
  return [
    `Centro: (${fmt(p.h, 2)}, ${fmt(p.k, 2)})`,
    `Semiejes: a = ${fmt(p.a, 2)}, b = ${fmt(p.b, 2)}`,
    `c = √(a²−b²) = ${fmt(c, 2)}`,
    `Excentricidad: e = ${fmt(e, 3)}`,
  ]
}

export function hyperbolaProperties(p: HyperbolaParams): string[] {
  const c = Math.sqrt(p.a * p.a + p.b * p.b)
  const slope = fmt(p.b / p.a, 2)
  return [
    `Centro: (${fmt(p.h, 2)}, ${fmt(p.k, 2)})`,
    `Semiejes: a = ${fmt(p.a, 2)}, b = ${fmt(p.b, 2)}`,
    `c = √(a²+b²) = ${fmt(c, 2)}`,
    `Asíntotas: y = ±${slope}x`,
  ]
}
