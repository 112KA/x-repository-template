'use client'

import type { LinkProps } from 'next/link'
import type { MouseEvent, ReactNode } from 'react'
import Link from 'next/link'
import { forwardRef, useCallback } from 'react'
import { usePageTransitionRouter } from '../hooks/use-context'

type TransitionLinkProps = Omit<LinkProps, 'href'> & {
  href: string
  children: ReactNode
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, onClick, prefetch = false, ...rest }, ref) => {
    const router = usePageTransitionRouter()

    const handleClick = useCallback(
      (event: MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
          onClick(event)
        }

        if (
          event.defaultPrevented
          || event.metaKey
          || event.ctrlKey
          || event.shiftKey
          || event.altKey
          || event.button !== 0
        ) {
          return
        }

        event.preventDefault()
        router.push(href)
      },
      [href, onClick, router],
    )

    return (
      <Link
        ref={ref}
        href={href}
        prefetch={prefetch}
        {...rest}
        onClick={handleClick}
      />
    )
  },
)

TransitionLink.displayName = 'TransitionLink'
