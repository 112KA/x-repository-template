import type { ViewTransitionStrategy } from './types'

function isViewTransitionSupported(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

/**
 * View Transitions API を使用した遷移戦略を作成します。
 *
 * 注意: このストラテジーが視覚的に機能するには、CSS で以下の定義が必要です:
 * - グローバル CSS: `@view-transition { navigation: auto; }`
 * - または個別要素に `view-transition-name` を指定してカスタムアニメーションを定義
 *
 * CSS 定義がないと、API は正常に実行されますが画面上に変化は見えません。
 * 詳細は README.md を参照してください。
 */
export function createViewTransitionApiStrategy(): ViewTransitionStrategy {
  return {
    beforeTransition: async (_context) => {
      if (!isViewTransitionSupported()) {
        // Strategyはアニメーション処理のみ
        // navigate処理はProvider側で実行
        return
      }

      try {
        const transition = document.startViewTransition?.(() => {
          // ビュー切り替え時はDOM更新がsetStateで行われる
          // ページ遷移時の実際の遷移はProvider側で実行
        })

        if (!transition) {
          return
        }

        await transition.finished
      }
      catch {
        // エラー時もNavigationはProvider側で処理
      }
    },
    afterTransition: async () => {
      // View Transitions API は beforeTransition 内でアニメーション完了を待つため、ここは空
    },
    cleanup: () => {},
  }
}
