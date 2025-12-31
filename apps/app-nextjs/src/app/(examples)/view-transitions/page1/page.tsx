'use client'

import { TransitionLink } from '@constraints/view-transitions/transition-link'
import { Button } from '@/components/ui/button'

function PageOne() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          View transitions demo
        </p>
        <h1 className="text-3xl font-semibold">Page 1</h1>
        <p className="text-sm text-muted-foreground">
          仮のページです。コンテンツを書き換えて動作を確認してください。
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <TransitionLink href="/view-transitions/page2">Page 2 へ移動</TransitionLink>
        </Button>
        <Button asChild>
          <TransitionLink href="/view-transitions">一覧へ戻る</TransitionLink>
        </Button>
      </div>
    </section>
  )
}

export default PageOne
