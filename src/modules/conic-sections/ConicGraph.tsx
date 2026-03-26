import { useMemo } from 'react'
import { toSVGX, toSVGY, type ViewBox } from '@/lib/math.utils'
import type { ConicType, CircleParams, ParabolaParams, EllipseParams, HyperbolaParams } from './conicSections.logic'

interface Props {
  type: ConicType
  zoom?: number
  circle?:    CircleParams
  parabola?:  ParabolaParams
  ellipse?:   EllipseParams
  hyperbola?: HyperbolaParams
}

const W = 920
const H = 720
const BASE_HALF_X = 8
const BASE_HALF_Y = 7

function getVB(zoom: number): ViewBox {
  const hx = BASE_HALF_X / zoom
  const hy = BASE_HALF_Y / zoom
  return { width: W, height: H, xMin: -hx, xMax: hx, yMin: -hy, yMax: hy }
}

function Axes({ vb, originX, originY }: { vb: ViewBox; originX: number; originY: number }) {
  const sx = (x: number) => toSVGX(x, vb)
  const sy = (y: number) => toSVGY(y, vb)

  // Always step 1 — show every integer
  const xTicks: number[] = []
  const yTicks: number[] = []
  for (let v = Math.ceil(vb.xMin); v <= Math.floor(vb.xMax); v++) if (v !== 0) xTicks.push(v)
  for (let v = Math.ceil(vb.yMin); v <= Math.floor(vb.yMax); v++) if (v !== 0) yTicks.push(v)

  // Skip label if too close to neighbour (avoids crowding at low zoom-out)
  const pxPerUnit = W / (vb.xMax - vb.xMin)
  const showEvery = pxPerUnit < 28 ? 2 : 1   // label every 2nd tick if very compressed

  return (
    <>
      {/* Grid lines */}
      {xTicks.map((v) => (
        <line key={`gx${v}`} x1={sx(v)} y1={0} x2={sx(v)} y2={H} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {yTicks.map((v) => (
        <line key={`gy${v}`} x1={0} y1={sy(v)} x2={W} y2={sy(v)} stroke="#e2e8f0" strokeWidth="1" />
      ))}

      {/* Axes */}
      <line x1={0} y1={originY} x2={W}       y2={originY} stroke="#94a3b8" strokeWidth="1.8" />
      <line x1={originX} y1={0} x2={originX} y2={H}       stroke="#94a3b8" strokeWidth="1.8" />
      <polygon points={`${W},${originY} ${W-8},${originY-4} ${W-8},${originY+4}`} fill="#94a3b8" />
      <polygon points={`${originX},0 ${originX-4},8 ${originX+4},8`}             fill="#94a3b8" />
      <text x={W-12} y={originY+16} fontSize="13" fill="#64748b" fontFamily="Inter,sans-serif">x</text>
      <text x={originX+7} y={16}    fontSize="13" fill="#64748b" fontFamily="Inter,sans-serif">y</text>

      {/* X tick marks + labels */}
      {xTicks.map((v, i) => (
        <g key={`tx${v}`}>
          <line x1={sx(v)} y1={originY - 5} x2={sx(v)} y2={originY + 5} stroke="#94a3b8" strokeWidth="1.5" />
          {i % showEvery === 0 && (
            <text x={sx(v)} y={originY + 17} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="Inter,sans-serif">{v}</text>
          )}
        </g>
      ))}

      {/* Y tick marks + labels */}
      {yTicks.map((v, i) => (
        <g key={`ty${v}`}>
          <line x1={originX - 5} y1={sy(v)} x2={originX + 5} y2={sy(v)} stroke="#94a3b8" strokeWidth="1.5" />
          {i % showEvery === 0 && (
            <text x={originX - 8} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontFamily="Inter,sans-serif">{v}</text>
          )}
        </g>
      ))}

      {/* Origin */}
      <text x={originX - 8} y={originY + 4} textAnchor="end" fontSize="11" fill="#94a3b8">0</text>
    </>
  )
}

function Dot({ x, y, sx, sy, color = '#2563eb', label = '', dx = 8, dy = -10 }: {
  x: number; y: number; sx: (v: number) => number; sy: (v: number) => number
  color?: string; label?: string; dx?: number; dy?: number
}) {
  const px = sx(x), py = sy(y)
  return (
    <g>
      <circle cx={px} cy={py} r="6" fill={color} stroke="white" strokeWidth="2.5" />
      {label && (
        <text x={px + dx} y={py + dy} fontSize="12" fill={color} fontFamily="Inter,sans-serif" fontWeight="600">
          {label}
        </text>
      )}
    </g>
  )
}

export function ConicGraph({ type, zoom = 1, circle, parabola, ellipse, hyperbola }: Props) {
  const vb = getVB(zoom)
  const sx = (x: number) => toSVGX(x, vb)
  const sy = (y: number) => toSVGY(y, vb)
  const originX = sx(0), originY = sy(0)

  const content = useMemo(() => {
    const scaleX = W / (vb.xMax - vb.xMin)
    const scaleY = H / (vb.yMax - vb.yMin)

    if (type === 'circle' && circle) {
      const { h, k, r } = circle
      return (
        <>
          <circle cx={sx(h)} cy={sy(k)} r={r * scaleX}
            fill="rgba(37,99,235,0.07)" stroke="#2563eb" strokeWidth="3" />
          <line x1={sx(h)} y1={sy(k)} x2={sx(h + r)} y2={sy(k)}
            stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={(sx(h) + sx(h + r)) / 2} y={sy(k) - 8}
            textAnchor="middle" fontSize="12" fill="#0891b2" fontFamily="Inter,sans-serif" fontWeight="600">
            r={r}
          </text>
          <Dot x={h} y={k} sx={sx} sy={sy} color="#f59e0b" label={`C(${h}, ${k})`} />
        </>
      )
    }

    if (type === 'parabola' && parabola) {
      const { h, k, a, vertical } = parabola
      const pts: string[] = []
      const N = 600
      for (let i = 0; i <= N; i++) {
        const t = -8 + (i / N) * 16
        const [px, py] = vertical ? [h + t, k + a * t * t] : [h + a * t * t, k + t]
        if (px < vb.xMin - 0.5 || px > vb.xMax + 0.5 || py < vb.yMin - 0.5 || py > vb.yMax + 0.5) continue
        pts.push(`${pts.length === 0 ? 'M' : 'L'}${sx(px).toFixed(1)},${sy(py).toFixed(1)}`)
      }
      const focusX = vertical ? h : h + 1 / (4 * a)
      const focusY = vertical ? k + 1 / (4 * a) : k
      const dirVal = vertical ? k - 1 / (4 * a) : h - 1 / (4 * a)

      return (
        <>
          {vertical
            ? <line x1={0} y1={sy(dirVal)} x2={W} y2={sy(dirVal)} stroke="#16a34a" strokeWidth="2" strokeDasharray="7 4" />
            : <line x1={sx(dirVal)} y1={0} x2={sx(dirVal)} y2={H} stroke="#16a34a" strokeWidth="2" strokeDasharray="7 4" />
          }
          <path d={pts.join(' ')} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          <Dot x={h} y={k} sx={sx} sy={sy} color="#f59e0b" label={`V(${h}, ${k})`} />
          <Dot x={focusX} y={focusY} sx={sx} sy={sy} color="#dc2626" label="F" dy={-12} />
          <text x={vertical ? W - 80 : sx(dirVal) + 6} y={vertical ? sy(dirVal) - 7 : 22}
            fontSize="11" fill="#16a34a" fontFamily="Inter,sans-serif" fontWeight="600">directriz</text>
        </>
      )
    }

    if (type === 'ellipse' && ellipse) {
      const { h, k, a, b } = ellipse
      const major = Math.max(a, b), minor = Math.min(a, b)
      const c = Math.sqrt(Math.max(0, major * major - minor * minor))
      const isHoriz = a >= b
      const [f1x, f1y] = isHoriz ? [h - c, k] : [h, k - c]
      const [f2x, f2y] = isHoriz ? [h + c, k] : [h, k + c]
      return (
        <>
          <line x1={sx(h-a)} y1={sy(k)} x2={sx(h+a)} y2={sy(k)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
          <line x1={sx(h)} y1={sy(k-b)} x2={sx(h)} y2={sy(k+b)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
          <ellipse cx={sx(h)} cy={sy(k)} rx={a * scaleX} ry={b * scaleY}
            fill="rgba(37,99,235,0.07)" stroke="#2563eb" strokeWidth="3" />
          <Dot x={h}   y={k}   sx={sx} sy={sy} color="#f59e0b" label={`C(${h}, ${k})`} />
          <Dot x={f1x} y={f1y} sx={sx} sy={sy} color="#dc2626" label="F₁" dy={-12} />
          <Dot x={f2x} y={f2y} sx={sx} sy={sy} color="#dc2626" label="F₂" dy={-12} />
          {isHoriz && (
            <>
              <Dot x={h - a} y={k} sx={sx} sy={sy} color="#7c3aed" label="-a" dy={14} dx={-16} />
              <Dot x={h + a} y={k} sx={sx} sy={sy} color="#7c3aed" label="a"  dy={14} />
            </>
          )}
        </>
      )
    }

    if (type === 'hyperbola' && hyperbola) {
      const { h, k, a, b, horizontal } = hyperbola
      const c = Math.sqrt(a * a + b * b)
      const [f1x, f1y] = horizontal ? [h - c, k] : [h, k - c]
      const [f2x, f2y] = horizontal ? [h + c, k] : [h, k + c]

      const branch = (sign: 1 | -1): string => {
        const pts: string[] = []
        for (let i = 0; i <= 400; i++) {
          const t = -5 + (i / 400) * 10
          const ct = Math.cosh(t), st = Math.sinh(t)
          const [px, py] = horizontal
            ? [h + sign * a * ct, k + b * st]
            : [h + b * st, k + sign * a * ct]
          if (px < vb.xMin - 0.3 || px > vb.xMax + 0.3 || py < vb.yMin - 0.3 || py > vb.yMax + 0.3) continue
          pts.push(`${pts.length === 0 ? 'M' : 'L'}${sx(px).toFixed(1)},${sy(py).toFixed(1)}`)
        }
        return pts.join(' ')
      }

      const slope = b / a
      return (
        <>
          <line x1={sx(h - 9)} y1={sy(k - slope * 9)} x2={sx(h + 9)} y2={sy(k + slope * 9)}
            stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.8" />
          <line x1={sx(h - 9)} y1={sy(k + slope * 9)} x2={sx(h + 9)} y2={sy(k - slope * 9)}
            stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.8" />
          <rect x={sx(h-a)} y={sy(k+b)} width={2*a*scaleX} height={2*b*scaleY}
            fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
          <path d={branch(1)}  fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          <path d={branch(-1)} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          <Dot x={h}   y={k}   sx={sx} sy={sy} color="#f59e0b" label={`C(${h}, ${k})`} />
          <Dot x={f1x} y={f1y} sx={sx} sy={sy} color="#dc2626" label="F₁" dy={-12} />
          <Dot x={f2x} y={f2y} sx={sx} sy={sy} color="#dc2626" label="F₂" dy={-12} />
          {horizontal && (
            <>
              <Dot x={h-a} y={k} sx={sx} sy={sy} color="#7c3aed" label="-a" dy={14} dx={-16} />
              <Dot x={h+a} y={k} sx={sx} sy={sy} color="#7c3aed" label="a"  dy={14} />
            </>
          )}
        </>
      )
    }

    return null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, circle, parabola, ellipse, hyperbola, zoom])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: '#f8fafc' }}>
      <Axes vb={vb} originX={originX} originY={originY} />
      {content}
    </svg>
  )
}
