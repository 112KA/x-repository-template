'use client'

import { TransitionLink } from '@constraints/transitions/components/transition-link'
import { Button } from '@/components/ui/button'

function Page2() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          View transitions demo
        </p>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Page 2</h1>
        <p className="text-sm text-muted-foreground">
          こちらも仮コンテンツです。遷移アニメーションを自由に試してみてください。
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <TransitionLink href="/examples/view-transitions/page1/">Page 1 へ移動</TransitionLink>
        </Button>
        <Button asChild>
          <TransitionLink href="/examples/view-transitions/">一覧へ戻る</TransitionLink>
        </Button>
      </div>
    </section>
  )
}

export default Page2
