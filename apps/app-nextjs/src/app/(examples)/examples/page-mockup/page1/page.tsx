'use client'

import { TransitionLink } from '@constraints/view-transitions/transition-link'
import { Button } from '@/components/ui/button'

function PageOne() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Page 1</h1>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <TransitionLink href="/examples/page-mockup/">Back</TransitionLink>
        </Button>
      </div>
    </section>
  )
}

export default PageOne
