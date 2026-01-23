'use client'

import type { ViewTransitionRouterValue } from './provider'
import type { ViewSwitchContextValue } from './types'
import { useContext } from 'react'
import { ViewSwitchContext, ViewTransitionContext } from './provider'

export function useViewTransitionRouter(): ViewTransitionRouterValue {
  const context = useContext(ViewTransitionContext)

  if (!context) {
    throw new Error('useViewTransitionRouter must be used within ViewTransitionProvider')
  }

  return context
}

export function useViewSwitch(): ViewSwitchContextValue {
  const context = useContext(ViewSwitchContext)

  if (!context) {
    throw new Error('useViewSwitch must be used within ViewTransitionProvider')
  }

  return context
}
