'use client'

import type { ReactNode } from 'react'
import type { ViewSwitchContextValue, ViewTransitionStrategy } from './types'
import type { PageDefinition } from '@/lib/page-definitions.generated'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { resolveStrategy } from './strategies'

export interface ViewTransitionRouterValue {
  push: (href: string) => Promise<void>
  replace: (href: string) => Promise<void>
}

interface ViewTransitionNavigateOptions {
  replace?: boolean
}

export const ViewTransitionContext = createContext<ViewTransitionRouterValue | null>(null)
export const ViewSwitchContext = createContext<ViewSwitchContextValue | null>(null)

export interface ViewTransitionProviderProps {
  children: ReactNode
  strategy?: ViewTransitionStrategy | string
  pageDefinition?: PageDefinition
}

export function ViewTransitionProvider({ children, strategy, pageDefinition }: ViewTransitionProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  // Strategy解決（文字列 or オブジェクト or undefined）
  const resolvedStrategy = useMemo(() => resolveStrategy(strategy), [strategy])

  const strategyRef = useRef<ViewTransitionStrategy>(resolvedStrategy)
  strategyRef.current = resolvedStrategy

  // ビュー切り替え用状態（pageDefinition存在時のみ）
  const [currentViewId, setCurrentViewId] = useState<string | null>(
    pageDefinition?.defaultView ?? null,
  )

  useEffect(() => {
    return () => {
      resolvedStrategy.cleanup()
    }
  }, [resolvedStrategy])

  const transitionTo = useCallback(
    async (href: string, options?: ViewTransitionNavigateOptions) => {
      if (href === pathname || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        await strategyRef.current?.beforeTransition(
          { element: containerRef.current },
          {
            type: 'navigate',
            href,
            fromPathname: pathname,
            router,
            navigate: () => {
              options?.replace ? router.replace(href) : router.push(href)
            },
          },
        )
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [pathname, router],
  )

  const switchView = useCallback(
    async (toViewId: string) => {
      if (!pageDefinition || toViewId === currentViewId || isAnimatingRef.current)
        return

      isAnimatingRef.current = true

      try {
        await strategyRef.current?.beforeTransition(
          { element: containerRef.current },
          {
            type: 'switch-view',
            fromViewId: currentViewId ?? '',
            toViewId,
          },
        )

        setCurrentViewId(toViewId)
      }
      catch (error) {
        isAnimatingRef.current = false
        throw error
      }
    },
    [currentViewId, pageDefinition],
  )

  // ページ遷移後の処理
  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current?.afterTransition(
          { element: containerRef.current },
          { type: 'navigate', pathname },
        )
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
  }, [pathname])

  // ビュー切り替え後の処理
  useEffect(() => {
    if (!pageDefinition || !currentViewId)
      return

    let isCancelled = false

    const run = async () => {
      try {
        await strategyRef.current?.afterTransition(
          { element: containerRef.current },
          { type: 'switch-view', viewId: currentViewId },
        )
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
  }, [currentViewId, pageDefinition])

  // ページ遷移時にビュー状態をリセット
  useEffect(() => {
    if (pageDefinition) {
      setCurrentViewId(null)
    }
  }, [pathname, pageDefinition])

  const routerValue = useMemo(
    () => ({
      push: (href: string) => transitionTo(href),
      replace: (href: string) => transitionTo(href, { replace: true }),
    }),
    [transitionTo],
  )

  const viewSwitchValue = useMemo(
    () => ({
      switchView,
      currentViewId,
    }),
    [switchView, currentViewId],
  )

  return (
    <ViewTransitionContext.Provider value={routerValue}>
      <ViewSwitchContext.Provider value={viewSwitchValue}>
        {/* h-full: 入れ子にしても破綻しないように縦サイズは親の高さに合わせる */}
        <div ref={containerRef} className="h-full">
          {children}
        </div>
      </ViewSwitchContext.Provider>
    </ViewTransitionContext.Provider>
  )
}
