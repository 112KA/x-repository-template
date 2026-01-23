'use client'

import type { PageDefinition } from '@/lib/page-definitions.generated'
import { useViewSwitch } from '@constraints/view-transitions'
import { useMemo } from 'react'
import { Button } from './ui/button'

export interface MultiViewPageProps {
  pageDefinition: PageDefinition
}

/**
 * マルチビューページコンポーネント
 * PageDefinitionに基づいて複数のビューを切り替え表示します
 */
export function MultiViewPage({ pageDefinition }: MultiViewPageProps) {
  const { switchView, currentViewId } = useViewSwitch()

  // 現在のビューID（null の場合はdefaultViewを使用）
  const effectiveViewId = currentViewId ?? pageDefinition.defaultView

  // 現在表示するビュー
  const currentView = useMemo(() => {
    return pageDefinition.views?.find(v => v.id === effectiveViewId)
  }, [pageDefinition.views, effectiveViewId])

  const handleButtonClick = async (action?: string, href?: string) => {
    if (action?.startsWith('switchView:')) {
      const viewId = action.replace('switchView:', '')
      await switchView(viewId)
    }
    else if (href) {
      // 外部リンクの場合は通常のナビゲーション（ViewTransitionProviderが処理）
      window.location.href = href
    }
  }

  if (!currentView) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          View not found:
          {effectiveViewId}
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        {currentView.title && (
          <h1 className="text-3xl font-semibold">{currentView.title}</h1>
        )}
        {currentView.name && currentView.name !== currentView.title && (
          <p className="text-sm text-muted-foreground">{currentView.name}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {currentView.buttons.map((button, index) => (
          <Button
            key={index}
            onClick={() => handleButtonClick(button.action, button.href)}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
