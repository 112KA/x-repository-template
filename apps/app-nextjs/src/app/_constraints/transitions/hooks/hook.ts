'use client'

import type { PageTransitionRouterValue, ViewTransitionContextValue } from '../providers/shared'
import { useContext } from 'react'
import { PageTransitionContext, ViewTransitionContext } from '../providers/shared'

export function useViewTransitionRouter(): PageTransitionRouterValue {
  const context = useContext(PageTransitionContext)

  if (!context) {
    throw new Error('useViewTransitionRouter must be used within PageTransitionProvider or CombinedTransitionProvider')
  }

  return context
}

export function useViewSwitch(): ViewTransitionContextValue {
  const context = useContext(ViewTransitionContext)

  if (!context) {
    throw new Error('useViewSwitch must be used within ViewTransitionProvider or CombinedTransitionProvider')
  }

  return context
}
