import { useMemo } from 'react'
import { toSVGX, toSVGY, type ViewBox } from '@/lib/math.utils'
import { evaluate, type TrigParams } from './trigFunctions.logic'

interface Props {
  params: TrigParams
  zoom?: number
}

const W = 840
const H = 500
const BASE_X = 3.2 * Math.PI   // show ±3.2π by default
const BASE_Y = 6

function getVB(zoom: number): ViewBox {
  return {
    width: W, height: H,
    xMin: -BASE_X / zoom, xMax: BASE_X / zoom,
    yMin: -BASE_Y / zoom, yMax: BASE_Y / zoom,
  }
}

const PI_LABELS: Record<number, string> = {
  [-3]: '-3π', [-2.5]: '-5π/2', [-2]: '-2π', [-1.5]: '-3π/2', [-1]: '-π', [-0.5]: '-π/2',
  [0.5]: 'π/2', [1]: 'π', [1.5]: '3π/2', [2]: '2π', [2.5]: '5π/2', [3]: '3π',
}

export function WaveGraph({ params, zoom = 1 }: Props) {
  const vb = getVB(zoom)
  const sx = (x: number) => toSVGX(x, vb)
  const sy = (y: number) => toSVGY(y, vb)

  const pathData = useMemo(() => {
    const STEPS = 1000
    const parts: string[] = []
    const isTan = params.type === 'tan'
    let penDown = false
    let prevY    = NaN

    for (let i = 0; i <= STEPS; i++) {
      const x = vb.xMin + (i / STEPS) * (vb.xMax - vb.xMin)
      const y = evaluate(params, x)
      const clampedY = Math.max(vb.yMin - 2, Math.min(vb.yMax + 2, y))

      if (!isFinite(y) || Math.abs(y) > 50) { penDown = false; prevY = NaN; continue }
      if (isTan && !isNaN(prevY) && Math.abs(y - prevY) > 8) { penDown = false }

      parts.push(`${penDown ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(clampedY).toFixed(1)}`)
      penDown = true
      prevY = y
    }
    return parts.join(' ')
  }, [params, vb])

  const originX = sx(0)
  const originY = sy(0)

  // Which π labels fit in current view?
  const piTicksInView = Object.keys(PI_LABELS)
    .map(Number)
    .filter((m) => m * Math.PI >= vb.xMin && m * Math.PI <= vb.xMax)

  const yTicksInView = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter(
    (v) => v >= vb.yMin && v <= vb.yMax,
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: '#f8fafc' }}>
      <defs>
        <clipPath id="wave-clip">
          <rect x={0} y={0} width={W} height={H} />
        </clipPath>
      </defs>

      {/* Grid */}
      {piTicksInView.map((m) => (
        <line key={`gx${m}`} x1={sx(m * Math.PI)} y1={0} x2={sx(m * Math.PI)} y2={H} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {yTicksInView.map((v) => (
        <line key={`gy${v}`} x1={0} y1={sy(v)} x2={W} y2={sy(v)} stroke="#e2e8f0" strokeWidth="1" />
      ))}

      {/* Axes */}
      <line x1={0} y1={originY} x2={W} y2={originY} stroke="#94a3b8" strokeWidth="1.5" />
      <line x1={originX} y1={0} x2={originX} y2={H} stroke="#94a3b8" strokeWidth="1.5" />

      {/* Amplitude reference lines */}
      {params.type !== 'tan' && (
        <>
          <line x1={0} y1={sy(params.D + Math.abs(params.A))} x2={W} y2={sy(params.D + Math.abs(params.A))}
            stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <line x1={0} y1={sy(params.D - Math.abs(params.A))} x2={W} y2={sy(params.D - Math.abs(params.A))}
            stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
        </>
      )}

      {/* Vertical shift line */}
      {params.D !== 0 && (
        <line x1={0} y1={sy(params.D)} x2={W} y2={sy(params.D)}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.7" />
      )}

      {/* Wave */}
      <path d={pathData} fill="none" stroke="#2563eb" strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round" clipPath="url(#wave-clip)" />

      {/* π axis tick labels */}
      {piTicksInView.filter((_, i) => i % (zoom < 1.5 ? 2 : 1) === 0).map((m) => (
        <text key={`lx${m}`} x={sx(m * Math.PI)} y={originY + 16}
          textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="Inter,sans-serif">
          {PI_LABELS[m]}
        </text>
      ))}

      {/* Y axis labels */}
      {yTicksInView.filter((v) => Math.abs(v) <= 4).map((v) => (
        <g key={`ty${v}`}>
          <line x1={originX - 3} y1={sy(v)} x2={originX + 3} y2={sy(v)} stroke="#94a3b8" strokeWidth="1.5" />
          <text x={originX - 7} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontFamily="Inter,sans-serif">{v}</text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={W - 12} y={originY + 16} fontSize="14" fill="#64748b" fontFamily="Inter,sans-serif">x</text>
      <text x={originX + 6} y={14} fontSize="14" fill="#64748b" fontFamily="Inter,sans-serif">y</text>
    </svg>
  )
}
