'use client'

import { TransitionLink } from '@constraints/view-transitions/transition-link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

function ViewTransitionsIndex({ className }: Props) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          View transitions demo
        </p>
      </div>
      <h1 className="text-3xl font-semibold">Page List</h1>
      <ul className="flex gap-2">
        <li>
          <Button asChild>
            <TransitionLink href="/examples/view-transitions/page1/">Page 1</TransitionLink>
          </Button>
        </li>
        <li>
          <Button asChild>
            <TransitionLink href="/examples/view-transitions/page2/">Page 2</TransitionLink>
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default ViewTransitionsIndex
