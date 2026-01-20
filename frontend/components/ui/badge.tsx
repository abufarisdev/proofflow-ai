import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 shadow-[0_0_10px_rgba(168,85,247,0.15)]',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        verified:
          'border-transparent bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
        pending:
          'border-transparent bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
        failed:
          'border-transparent bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
        suspicious:
          'border-transparent bg-orange-500/15 text-orange-500 hover:bg-orange-500/25 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
        processing:
          'border-transparent bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)] animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
