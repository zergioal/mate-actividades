/** Shared mathematical utilities used across modules */

// ─── Coordinate transforms ────────────────────────────────────────────────────

export interface ViewBox {
  width: number
  height: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

/** Convert a math x-value to SVG pixel x */
export function toSVGX(mathX: number, vb: ViewBox): number {
  return ((mathX - vb.xMin) / (vb.xMax - vb.xMin)) * vb.width
}

/** Convert a math y-value to SVG pixel y (flipped axis) */
export function toSVGY(mathY: number, vb: ViewBox): number {
  return vb.height - ((mathY - vb.yMin) / (vb.yMax - vb.yMin)) * vb.height
}

/** Convert SVG pixel x to math x */
export function toMathX(svgX: number, vb: ViewBox): number {
  return (svgX / vb.width) * (vb.xMax - vb.xMin) + vb.xMin
}

/** Convert SVG pixel y to math y */
export function toMathY(svgY: number, vb: ViewBox): number {
  return ((vb.height - svgY) / vb.height) * (vb.yMax - vb.yMin) + vb.yMin
}

// ─── SVG path helpers ─────────────────────────────────────────────────────────

/**
 * Build an SVG polyline path string from an array of (x, y) points.
 * Automatically clips points outside the viewbox by clamping y.
 */
export function buildPath(
  points: Array<{ x: number; y: number }>,
  vb: ViewBox,
): string {
  if (points.length === 0) return ''
  const clampY = (y: number) => Math.max(vb.yMin - 10, Math.min(vb.yMax + 10, y))
  return points
    .map((p, i) => {
      const px = toSVGX(p.x, vb)
      const py = toSVGY(clampY(p.y), vb)
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`
    })
    .join(' ')
}

/** Sample a function f(x) over [xMin, xMax] with the given number of steps */
export function sampleFunction(
  f: (x: number) => number,
  xMin: number,
  xMax: number,
  steps = 400,
): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = []
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin)
    const y = f(x)
    if (isFinite(y)) pts.push({ x, y })
  }
  return pts
}

// ─── Number utilities ─────────────────────────────────────────────────────────

/** Round to n decimal places */
export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/** Greatest common divisor (Euclidean) */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a || 1
}

/** Format a number for display: avoids trailing zeros */
export function fmt(n: number, decimals = 2): string {
  return parseFloat(n.toFixed(decimals)).toString()
}

/** Format a number as a fraction string if it's a simple fraction */
export function toFractionString(numerator: number, denominator: number): string {
  const g = gcd(Math.abs(numerator), Math.abs(denominator))
  const n = numerator / g
  const d = denominator / g
  if (d === 1) return `${n}`
  if (d === -1) return `${-n}`
  return `${d < 0 ? -n : n}/${Math.abs(d)}`
}

// ─── Quadratic solver ─────────────────────────────────────────────────────────

export interface QuadraticResult {
  discriminant: number
  rootType: 'two-real' | 'one-real' | 'complex'
  roots: [number, number] | [number] | []
  vertex: { x: number; y: number }
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  const vertex = { x: -b / (2 * a), y: c - (b * b) / (4 * a) }
  const disc = b * b - 4 * a * c

  if (disc > 0) {
    const r1 = (-b + Math.sqrt(disc)) / (2 * a)
    const r2 = (-b - Math.sqrt(disc)) / (2 * a)
    return { discriminant: disc, rootType: 'two-real', roots: [r1, r2], vertex }
  }
  if (disc === 0) {
    return { discriminant: 0, rootType: 'one-real', roots: [-b / (2 * a)], vertex }
  }
  return { discriminant: disc, rootType: 'complex', roots: [], vertex }
}

// ─── Trig utilities ───────────────────────────────────────────────────────────

/** Format π multiples nicely, e.g. 3.14159… → "π", 6.28… → "2π" */
export function formatPi(value: number, decimals = 2): string {
  const ratio = value / Math.PI
  if (Math.abs(ratio - Math.round(ratio)) < 0.001) {
    const n = Math.round(ratio)
    if (n === 0) return '0'
    if (n === 1) return 'π'
    if (n === -1) return '-π'
    return `${n}π`
  }
  return fmt(value, decimals)
}

// ─── Random helpers ───────────────────────────────────────────────────────────

/** Random integer in [min, max] inclusive */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Pick a random element from an array */
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
