'use client'

import type { ReactNode } from 'react'
import { createFadeStrategy, PageTransitionProvider } from '@constraints/transitions'

function ViewTransitionsLayout({ children }: { children: ReactNode }) {
  return <PageTransitionProvider strategy={createFadeStrategy()}>{children}</PageTransitionProvider>
}

export default ViewTransitionsLayout
