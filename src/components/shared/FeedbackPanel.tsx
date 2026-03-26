import { cn } from '@/lib/cn'
import type { FeedbackState } from '@/types/module.types'

interface FeedbackPanelProps {
  feedback: FeedbackState
  className?: string
}

const typeClasses: Record<FeedbackState['type'], string> = {
  idle:    'feedback-neutral',
  success: 'feedback-success animate-pop',
  error:   'feedback-error animate-shake',
  info:    'feedback-info',
}

const icons: Record<FeedbackState['type'], string> = {
  idle:    '💡',
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
}

export function FeedbackPanel({ feedback, className }: FeedbackPanelProps) {
  if (feedback.type === 'idle' && !feedback.message) return null

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium',
        typeClasses[feedback.type],
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <span className="text-base leading-snug">{icons[feedback.type]}</span>
      <p className="leading-snug">{feedback.message}</p>
    </div>
  )
}
