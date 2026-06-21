import { ArrowUpRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '../../lib/utils'

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export function ButtonColorful({
  className,
  label = 'Get Started',
  ...props
}: ButtonColorfulProps) {
  return (
    <Button
      className={cn('relative h-11 overflow-hidden px-6', 'group', className)}
      {...props}
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-amber-500/30',
          'opacity-60 blur-sm transition-opacity duration-500 group-hover:opacity-90'
        )}
      />
      <div className="relative flex items-center justify-center gap-2">
        <span className="font-medium text-neutral-900">{label}</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-800" />
      </div>
    </Button>
  )
}
