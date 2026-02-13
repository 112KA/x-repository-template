'use client'

import { useViewTransition } from '@constraints/transitions'
import { Button } from '@/components/ui/button'

export function View1() {
  const viewTransition = useViewTransition()

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold">View 1</h2>
      <p>これはビュー1です。</p>
      <div className="flex gap-2">
        <Button onClick={() => viewTransition.to('view-2')} className="w-fit">
          View 2へ移動
        </Button>
        <Button onClick={() => viewTransition.to('view-3')} className="w-fit" variant="outline">
          View 3へ移動
        </Button>
      </div>
    </div>
  )
}
