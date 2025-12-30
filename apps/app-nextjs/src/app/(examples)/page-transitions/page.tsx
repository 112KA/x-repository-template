'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export default ({ className }: Props) => {
  return (
    <div className={cn('', className)}>
      <ul className="flex gap-2">
        <li><Button asChild><Link href="./page1/">Page 1</Link></Button></li>
        <li><Button asChild><Link href="./page2/">Page 2</Link></Button></li>
      </ul>
    </div>
  )
}
