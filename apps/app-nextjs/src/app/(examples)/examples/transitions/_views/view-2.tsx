'use client'

import { useViewSwitch } from '@constraints/transitions'
import { Button } from '@/components/ui/button'

export function View2() {
  const viewSwitch = useViewSwitch()

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold">View 2</h2>
      <p>これはビュー2です。</p>
      <div className="flex gap-2">
        <Button onClick={() => viewSwitch.switchView('view-1')} className="w-fit">
          View 1へ戻る
        </Button>
        <Button onClick={() => viewSwitch.switchView('view-3')} className="w-fit" variant="outline">
          View 3へ移動
        </Button>
      </div>
    </div>
  )
}
