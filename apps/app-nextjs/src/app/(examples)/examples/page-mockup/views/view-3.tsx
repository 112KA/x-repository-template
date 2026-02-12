'use client'

import { useViewSwitch } from '@constraints/transitions'
import { Button } from '@/components/ui/button'

export function View3() {
  const viewSwitch = useViewSwitch()

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold">View 3</h2>
      <p>これはビュー3です。</p>
      <div className="flex gap-2">
        <Button onClick={() => viewSwitch.switchView('view-1')} className="w-fit">
          View 1へ戻る
        </Button>
        <Button onClick={() => viewSwitch.switchView('view-2')} className="w-fit" variant="outline">
          View 2へ移動
        </Button>
      </div>
    </div>
  )
}
