import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface ViewTransitionNavigateParams {
  element: HTMLDivElement | null
  href: string
  fromPathname: string
  router: AppRouterInstance
  navigate: () => void
}

export interface ViewTransitionAfterEnterParams {
  element: HTMLDivElement | null
  pathname: string
}

export interface ViewTransitionStrategy {
  beforeNavigate: (params: ViewTransitionNavigateParams) => Promise<void>
  afterEnter: (params: ViewTransitionAfterEnterParams) => Promise<void>
  cleanup: () => void
}
