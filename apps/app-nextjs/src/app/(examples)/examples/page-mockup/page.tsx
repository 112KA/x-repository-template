'use client'

import { MultiViewPage } from '@/components/multi-view-page'
import { PAGE_DEFINITIONS } from '@/lib/page-definitions.generated'

function PageMockup() {
  const pageDefinition = PAGE_DEFINITIONS['page-mockup']

  if (!pageDefinition) {
    return <div>Page definition not found</div>
  }

  return <MultiViewPage pageDefinition={pageDefinition} />
}

export default PageMockup
