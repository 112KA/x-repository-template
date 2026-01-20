'use client'

import type { PageDefinition } from '@/lib/page-definitions.generated'
import { createFadeStrategy, ViewSwitchProvider } from '@constraints/view-transitions'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MultiViewPageProps {
  pageDefinition: PageDefinition
}

export function MultiViewPage({ pageDefinition }: MultiViewPageProps) {
  if (!pageDefinition.isMultiView || !pageDefinition.views) {
    throw new Error('Invalid page configuration: page is not a multi-view page')
  }

  const defaultView = pageDefinition.defaultView || pageDefinition.views[0]?.id || ''
  const [currentViewId, setCurrentViewId] = useState(defaultView)
  const strategy = createFadeStrategy()

  // 現在のビューを取得
  const currentView = pageDefinition.views.find(v => v.id === currentViewId)

  return (
    <ViewSwitchProvider
      strategy={strategy}
      currentViewId={currentViewId}
      onViewChange={setCurrentViewId}
    >
      <section className="space-y-6">
        {currentView?.title && (
          <h1 className="text-3xl font-semibold">
            {currentView.title}
          </h1>
        )}

        {currentView?.buttons && currentView.buttons.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {currentView.buttons.map(button => (
              <Button
                key={button.label}
                onClick={() => {
                  if (button.action?.startsWith('switchView:')) {
                    const viewId = button.action.replace('switchView:', '')
                    setCurrentViewId(viewId)
                  }
                  else if (button.href) {
                    window.location.href = button.href
                  }
                }}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </section>
    </ViewSwitchProvider>
  )
}
