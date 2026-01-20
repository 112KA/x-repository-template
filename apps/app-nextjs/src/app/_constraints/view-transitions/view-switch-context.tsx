'use client'

import type { ReactNode } from 'react'
import type { ViewTransitionStrategy } from './types'
import { createContext, useCallback, useEffect, useMemo, useRef } from 'react'

export interface ViewSwitchContextValue {
  switchView: (viewId: string) => Promise<void>
}

export const ViewSwitchContext = createContext<ViewSwitchContextValue | null>(null)

export interface ViewSwitchProviderProps {
  children: ReactNode
  strategy?: ViewTransitionStrategy
  currentViewId: string
  onViewChange: (viewId: string) => void
}

export function ViewSwitchProvider({
  children,
  strategy,
  currentViewId,
  onViewChange,
}: ViewSwitchProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const strategyRef = useRef(strategy)
  strategyRef.current = strategy

  useEffect(() => {
    return () => {
      strategyRef.current?.cleanup?.()
    }
  }, [strategy])

  const switchView = useCallback(
    async (toViewId: string) => {
      if (toViewId === currentViewId || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        await strategyRef.current?.beforeSwitchView?.({
          container: containerRef.current,
          fromViewId: currentViewId,
          toViewId,
        })

        onViewChange(toViewId)
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [currentViewId, onViewChange],
  )

  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current?.afterSwitchView?.({
          container: containerRef.current,
          viewId: currentViewId,
        })
      }
      finally {
        if (!isCancelled) {
          isAnimatingRef.current = false
        }
      }
    }

    run()

    return () => {
      isCancelled = true
    }
  }, [currentViewId])

  const value = useMemo(
    () => ({
      switchView,
    }),
    [switchView],
  )

  return (
    <ViewSwitchContext.Provider value={value}>
      <div ref={containerRef}>{children}</div>
    </ViewSwitchContext.Provider>
  )
}
