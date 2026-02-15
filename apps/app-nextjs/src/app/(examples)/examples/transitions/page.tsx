'use client'

import { TransitionLink } from '@constraints/transitions/components/transition-link'
import { createFadeStrategy, View, ViewTransitionProvider } from '@/app/_constraints/transitions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { View1 } from './_views/view-1'
import { View2 } from './_views/view-2'
import { View3 } from './_views/view-3'

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

      <ViewTransitionProvider
        strategy={createFadeStrategy()}
        initialViewId="view-1"
      >
        <View id="view-1">
          <View1 />
        </View>
        <View id="view-2">
          <View2 />
        </View>
        <View id="view-3">
          <View3 />
        </View>
      </ViewTransitionProvider>

      <ul className="flex gap-2">
        <li>
          <Button asChild>
            <TransitionLink href="/examples/transitions/page1/">Page 1</TransitionLink>
          </Button>
        </li>
        <li>
          <Button asChild>
            <TransitionLink href="/examples/transitions/page2/">Page 2</TransitionLink>
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default ViewTransitionsIndex
