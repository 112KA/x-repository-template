'use client'

import type { PageTransitionRouterValue, ViewTransitionContextValue } from '../providers'
import { useContext } from 'react'
import { PageTransitionContext, ViewTransitionContext } from '../providers'

export function usePageTransitionRouter(): PageTransitionRouterValue {
  const context = useContext(PageTransitionContext)

  if (!context) {
    throw new Error('usePageTransitionRouter must be used within PageTransitionProvider or CombinedTransitionProvider')
  }

  return context
}

export function useViewTransition(): ViewTransitionContextValue {
  const context = useContext(ViewTransitionContext)

  if (!context) {
    throw new Error('useViewTransition must be used within ViewTransitionProvider or CombinedTransitionProvider')
  }

  return context
}
