import { useRef, useEffect, useCallback } from 'react'
import type { NumberLineChallenge } from './numberLine.logic'

interface Props {
  challenge: NumberLineChallenge
  placedValue: number | null
  revealAnswer: boolean
  onPlace: (value: number) => void
}

const CANVAS_W = 960
const CANVAS_H = 220
const LINE_Y   = 130
const PAD_X    = 70
const TICK_MAJOR = 16
const TICK_MINOR = 8

function toCanvasX(v: number, min: number, max: number): number {
  return PAD_X + ((v - min) / (max - min)) * (CANVAS_W - PAD_X * 2)
}

function toMathVal(cx: number, min: number, max: number): number {
  return min + ((cx - PAD_X) / (CANVAS_W - PAD_X * 2)) * (max - min)
}

export function NumberLineCanvas({ challenge, placedValue, revealAnswer, onPlace }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { rangeMin, rangeMax } = challenge

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, CANVAS_W * dpr, CANVAS_H * dpr)

    // Background
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    const left  = toCanvasX(rangeMin, rangeMin, rangeMax)
    const right = toCanvasX(rangeMax, rangeMin, rangeMax)

    // ── Main line ──────────────────────────────────────────────────────────
    ctx.beginPath()
    ctx.moveTo(left - 12, LINE_Y)
    ctx.lineTo(right + 12, LINE_Y)
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Arrowheads
    ctx.fillStyle = '#334155'
    for (const [x, d] of [[left - 12, -1], [right + 12, 1]] as Array<[number, number]>) {
      ctx.beginPath()
      ctx.moveTo(x + d * 12, LINE_Y)
      ctx.lineTo(x + d * 3, LINE_Y - 6)
      ctx.lineTo(x + d * 3, LINE_Y + 6)
      ctx.closePath()
      ctx.fill()
    }

    // ── Ticks ──────────────────────────────────────────────────────────────
    ctx.font = '14px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    const range = rangeMax - rangeMin
    const step  = range <= 8 ? 0.5 : range <= 12 ? 1 : 2

    for (let v = rangeMin; v <= rangeMax + 0.001; v += step) {
      const isInteger = Math.abs(v - Math.round(v)) < 0.001
      const x = toCanvasX(v, rangeMin, rangeMax)
      const h = isInteger ? TICK_MAJOR : TICK_MINOR

      ctx.beginPath()
      ctx.moveTo(x, LINE_Y - h)
      ctx.lineTo(x, LINE_Y + h)
      ctx.strokeStyle = isInteger ? '#475569' : '#94a3b8'
      ctx.lineWidth   = isInteger ? 1.8 : 1
      ctx.stroke()

      if (isInteger) {
        ctx.fillStyle = '#475569'
        ctx.fillText(String(Math.round(v)), x, LINE_Y + TICK_MAJOR + 5)
      }
    }

    // Origin dot
    const x0 = toCanvasX(0, rangeMin, rangeMax)
    if (x0 >= PAD_X && x0 <= CANVAS_W - PAD_X) {
      ctx.beginPath()
      ctx.arc(x0, LINE_Y, 4.5, 0, Math.PI * 2)
      ctx.fillStyle = '#1e40af'
      ctx.fill()
    }

    // ── Placed value ───────────────────────────────────────────────────────
    if (placedValue !== null) {
      const px = toCanvasX(placedValue, rangeMin, rangeMax)
      const isCorrect = revealAnswer && Math.abs(placedValue - challenge.target) <= challenge.tolerance
      const color = revealAnswer ? (isCorrect ? '#16a34a' : '#dc2626') : '#2563eb'

      ctx.beginPath()
      ctx.setLineDash([5, 3])
      ctx.moveTo(px, LINE_Y - 46)
      ctx.lineTo(px, LINE_Y)
      ctx.strokeStyle = color
      ctx.lineWidth   = 2
      ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath()
      ctx.arc(px, LINE_Y - 46, 13, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth   = 2
      ctx.stroke()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 13px Inter, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.textAlign    = 'center'
      ctx.fillText('?', px, LINE_Y - 46)
    }

    // ── Correct position (revealed) ────────────────────────────────────────
    if (revealAnswer) {
      const cx = toCanvasX(challenge.target, rangeMin, rangeMax)

      ctx.beginPath()
      ctx.setLineDash([6, 3])
      ctx.moveTo(cx, LINE_Y - 76)
      ctx.lineTo(cx, LINE_Y)
      ctx.strokeStyle = '#16a34a'
      ctx.lineWidth   = 2.5
      ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath()
      ctx.arc(cx, LINE_Y - 76, 14, 0, Math.PI * 2)
      ctx.fillStyle = '#16a34a'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth   = 2.5
      ctx.stroke()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.textAlign    = 'center'
      ctx.fillText('✓', cx, LINE_Y - 76)
    }

    // ── Hint text ──────────────────────────────────────────────────────────
    if (placedValue === null && !revealAnswer) {
      ctx.font = '13px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText('Haz clic en la recta para ubicar el número', CANVAS_W / 2, LINE_Y - 55)
    }
  }, [challenge, placedValue, revealAnswer, rangeMin, rangeMax])

  useEffect(() => { draw() }, [draw])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (revealAnswer) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect  = canvas.getBoundingClientRect()
    const scaleX = CANVAS_W / rect.width
    const rawX   = (e.clientX - rect.left) * scaleX
    const value  = toMathVal(rawX, rangeMin, rangeMax)
    onPlace(Math.max(rangeMin, Math.min(rangeMax, value)))
  }

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      onClick={handleClick}
      className="w-full rounded-xl border border-slate-200 cursor-crosshair select-none"
      style={{ maxHeight: 240 }}
    />
  )
}
