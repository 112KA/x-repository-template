'use client'

import type { ViewSwitchContextValue } from './view-switch-context'
import { useContext } from 'react'
import { ViewSwitchContext } from './view-switch-context'

export function useViewSwitch(): ViewSwitchContextValue {
  const context = useContext(ViewSwitchContext)
  if (!context) {
    throw new Error('useViewSwitch must be used within ViewSwitchProvider')
  }
  return context
}
