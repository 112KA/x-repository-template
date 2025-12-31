'use client'

import type { ViewTransitionRouterValue } from './provider'
import { useContext } from 'react'
import { ViewTransitionContext } from './provider'

export function useViewTransitionRouter(): ViewTransitionRouterValue {
  const context = useContext(ViewTransitionContext)

  if (!context) {
    throw new Error('useViewTransitionRouter must be used within ViewTransitionProvider')
  }

  return context
}
