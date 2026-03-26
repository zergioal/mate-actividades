import { useEffect, useRef } from 'react'
import katex from 'katex'
import { cn } from '@/lib/cn'

interface MathExpressionProps {
  /** LaTeX formula string */
  formula: string
  /** Render in display (block) mode */
  displayMode?: boolean
  className?: string
}

/**
 * Renders a LaTeX formula using KaTeX.
 * Falls back to the raw formula string if KaTeX is unavailable.
 */
export function MathExpression({ formula, displayMode = false, className }: MathExpressionProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(formula, ref.current, {
        throwOnError: false,
        displayMode,
        output: 'html',
      })
    } catch {
      if (ref.current) ref.current.textContent = formula
    }
  }, [formula, displayMode])

  return <span ref={ref} className={cn('katex-wrapper', className)} />
}
