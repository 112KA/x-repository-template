'use client'

import { View, ViewTransitionProvider } from '@constraints/transitions'
import { createFadeStrategy } from '@constraints/transitions/strategies'
import { View1 } from './views/view-1'
import { View2 } from './views/view-2'
import { View3 } from './views/view-3'

export default function PageMockupPage() {
  return (
    <ViewTransitionProvider strategy={createFadeStrategy()} initialViewId="view-1">
      <View id="view-1">
        <View1 />
      </View>

      <View id="view-2">
        <View2 />
      </View>

      <View id="view-3">
        <View3 />
      </View>
    </ViewTransitionProvider>
  )
}
