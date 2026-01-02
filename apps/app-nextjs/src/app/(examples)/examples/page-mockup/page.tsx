'use client'

import { TransitionLink } from '@constraints/view-transitions/transition-link'
import { Button } from '@/components/ui/button'

function PageMockup() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Page Mockup</h1>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <TransitionLink href="/examples/page-mockup/page1/">Page1</TransitionLink>
        </Button>
        <Button asChild>
          <TransitionLink href="/examples/page-mockup/page2/">Page2</TransitionLink>
        </Button>
      </div>
    </section>
  )
}

export default PageMockup
