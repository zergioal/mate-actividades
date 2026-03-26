import { useMemo } from 'react'
import { toSVGX, toSVGY, buildPath, sampleFunction, type ViewBox } from '@/lib/math.utils'
import { solveQuadratic } from './quadratic.logic'

interface Props {
  a: number
  b: number
  c: number
  zoom?: number  // 1 = default, >1 = zoomed in
}

const BASE_VB: ViewBox = { width: 700, height: 520, xMin: -8, xMax: 8, yMin: -7, yMax: 9 }

function getVB(zoom: number): ViewBox {
  const cx = 0, cy = 1  // zoom center
  const xHalf = (BASE_VB.xMax - BASE_VB.xMin) / 2 / zoom
  const yHalf = (BASE_VB.yMax - BASE_VB.yMin) / 2 / zoom
  return {
    ...BASE_VB,
    xMin: cx - xHalf, xMax: cx + xHalf,
    yMin: cy - yHalf, yMax: cy + yHalf,
  }
}

export function ParabolaGraph({ a, b, c, zoom = 1 }: Props) {
  const vb = getVB(zoom)
  const sx = (x: number) => toSVGX(x, vb)
  const sy = (y: number) => toSVGY(y, vb)

  const { roots, vertex, rootType } = useMemo(() => solveQuadratic(a, b, c), [a, b, c])

  const parabolaPath = useMemo(() => {
    const f = (x: number) => a * x * x + b * x + c
    return buildPath(sampleFunction(f, vb.xMin, vb.xMax, 600), vb)
  }, [a, b, c, vb])

  // Adaptive ticks
  const range = vb.xMax - vb.xMin
  const tickStep = range <= 4 ? 0.5 : range <= 8 ? 1 : 2
  const xTicks: number[] = []
  const yTicks: number[] = []
  for (let v = Math.ceil(vb.xMin); v <= vb.xMax; v += tickStep) xTicks.push(v)
  for (let v = Math.ceil(vb.yMin); v <= vb.yMax; v += tickStep) yTicks.push(v)

  const originX = sx(0)
  const originY = sy(0)

  return (
    <svg viewBox={`0 0 ${BASE_VB.width} ${BASE_VB.height}`} className="w-full rounded-xl" style={{ background: '#f8fafc' }}>
      {/* Grid */}
      {xTicks.filter(v => v !== 0).map((v) => (
        <line key={`gx${v}`} x1={sx(v)} y1={0} x2={sx(v)} y2={BASE_VB.height} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {yTicks.filter(v => v !== 0).map((v) => (
        <line key={`gy${v}`} x1={0} y1={sy(v)} x2={BASE_VB.width} y2={sy(v)} stroke="#e2e8f0" strokeWidth="1" />
      ))}

      {/* Axes */}
      <line x1={0}             y1={originY}          x2={BASE_VB.width}  y2={originY}          stroke="#94a3b8" strokeWidth="1.5" />
      <line x1={originX}       y1={0}                x2={originX}        y2={BASE_VB.height}   stroke="#94a3b8" strokeWidth="1.5" />
      <polygon points={`${BASE_VB.width},${originY} ${BASE_VB.width-8},${originY-4} ${BASE_VB.width-8},${originY+4}`} fill="#94a3b8" />
      <polygon points={`${originX},0 ${originX-4},8 ${originX+4},8`} fill="#94a3b8" />
      <text x={BASE_VB.width-14} y={originY+16} fontSize="13" fill="#64748b" fontFamily="Inter,sans-serif">x</text>
      <text x={originX+6}        y={14}          fontSize="13" fill="#64748b" fontFamily="Inter,sans-serif">y</text>

      {/* Tick marks + labels */}
      {xTicks.filter(v => v !== 0).map((v) => (
        <g key={`tx${v}`}>
          <line x1={sx(v)} y1={originY-4} x2={sx(v)} y2={originY+4} stroke="#94a3b8" strokeWidth="1.5" />
          <text x={sx(v)} y={originY+16} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="Inter,sans-serif">{v}</text>
        </g>
      ))}
      {yTicks.filter(v => v !== 0).map((v) => (
        <g key={`ty${v}`}>
          <line x1={originX-4} y1={sy(v)} x2={originX+4} y2={sy(v)} stroke="#94a3b8" strokeWidth="1.5" />
          <text x={originX-7} y={sy(v)+4} textAnchor="end" fontSize="11" fill="#94a3b8" fontFamily="Inter,sans-serif">{v}</text>
        </g>
      ))}
      <text x={originX-7} y={originY+4} textAnchor="end" fontSize="11" fill="#94a3b8" fontFamily="Inter,sans-serif">0</text>

      {/* Axis of symmetry */}
      {vertex.x >= vb.xMin && vertex.x <= vb.xMax && (
        <line x1={sx(vertex.x)} y1={0} x2={sx(vertex.x)} y2={BASE_VB.height}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
      )}

      {/* Parabola */}
      <path d={parabolaPath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

      {/* Vertex */}
      {vertex.x >= vb.xMin && vertex.x <= vb.xMax && vertex.y >= vb.yMin && vertex.y <= vb.yMax && (
        <g>
          <circle cx={sx(vertex.x)} cy={sy(vertex.y)} r="7" fill="#f59e0b" stroke="white" strokeWidth="2.5" />
          <text x={sx(vertex.x)+12} y={sy(vertex.y)-10}
            fontSize="12" fill="#b45309" fontFamily="Inter,sans-serif" fontWeight="600">
            V({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
          </text>
        </g>
      )}

      {/* Roots */}
      {rootType === 'two-real' && roots.length === 2 &&
        (roots as [number, number]).map((r, i) => (
          r >= vb.xMin && r <= vb.xMax ? (
            <g key={i}>
              <circle cx={sx(r)} cy={sy(0)} r="6" fill="#dc2626" stroke="white" strokeWidth="2.5" />
              <text x={sx(r)} y={sy(0)+20} textAnchor="middle" fontSize="12" fill="#dc2626" fontFamily="Inter,sans-serif" fontWeight="600">
                x{i+1}={r.toFixed(2)}
              </text>
            </g>
          ) : null
        ))
      }
      {rootType === 'one-real' && roots.length === 1 && (
        <circle cx={sx((roots as [number])[0])} cy={sy(0)} r="6" fill="#dc2626" stroke="white" strokeWidth="2.5" />
      )}
    </svg>
  )
}
