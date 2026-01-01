'use client'

import type { ReactNode } from 'react'
import { createFadeStrategy, ViewTransitionProvider } from '@constraints/view-transitions'

function ViewTransitionsLayout({ children }: { children: ReactNode }) {
  return <ViewTransitionProvider strategy={createFadeStrategy()}>{children}</ViewTransitionProvider>
}

export default ViewTransitionsLayout
