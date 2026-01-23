'use client'

import { ViewTransitionProvider } from '@constraints/view-transitions'
import { MultiViewPage } from '@/components/multi-view-page'
import { PAGE_DEFINITIONS } from '@/lib/page-definitions.generated'

export default function PageMockupPage() {
  const pageDefinition = PAGE_DEFINITIONS['page-mockup']

  return (
    <ViewTransitionProvider strategy="fade" pageDefinition={pageDefinition}>
      <MultiViewPage pageDefinition={pageDefinition} />
    </ViewTransitionProvider>
  )
}
