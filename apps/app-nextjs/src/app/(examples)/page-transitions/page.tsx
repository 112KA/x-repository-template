'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export default ({ className }: Props) => {
  return (
    <div className={cn('', className)}>
      <ul className="flex gap-2">
        <li><Button asChild><a href="./page1/">Page 1</a></Button></li>
        <li><Button asChild><a href="./page2/">Page 2</a></Button></li>
      </ul>
    </div>
  )
}
