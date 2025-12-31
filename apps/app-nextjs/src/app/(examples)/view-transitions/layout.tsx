import type { ReactNode } from 'react'
import { ViewTransitionProvider } from '@constraints/view-transitions'

function ViewTransitionsLayout({ children }: { children: ReactNode }) {
  return <ViewTransitionProvider>{children}</ViewTransitionProvider>
}

export default ViewTransitionsLayout
