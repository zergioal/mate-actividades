import { cn } from '@/lib/cn'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  displayValue?: string   // override the displayed value (e.g., formatted with π)
  onChange: (value: number) => void
  className?: string
  accentColor?: string    // Tailwind text color class, e.g. "text-brand-700"
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.1,
  unit = '',
  displayValue,
  onChange,
  className,
  accentColor = 'text-brand-700',
}: SliderProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className={cn('font-mono font-semibold tabular-nums', accentColor)}>
          {displayValue ?? value}{unit}
        </span>
      </div>
      <input
        type="range"
        className="range-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="flex justify-between text-xs text-slate-400 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
