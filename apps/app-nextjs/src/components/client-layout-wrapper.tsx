'use client'

import { useViewportHeight } from '@/hooks/use-viewport-height'

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  useViewportHeight()
  return <>{children}</>
}
