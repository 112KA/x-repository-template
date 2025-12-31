## view-transitions

Router 遷移時のフェード制御を行う実験的なフィーチャーです。

- `provider.tsx` / `hook.ts`: `ViewTransitionProvider` と `useViewTransitionRouter`を提供します。`index.ts` からまとめて import できます。
- `transition-link.tsx`: クリック時に自動でフェードアウト→ページ遷移→フェードインを実行するリンク。

`apps/app-nextjs/src/app/(examples)/view-transitions` にサンプルページを配置しているので、挙動を確認しながらエフェクトを調整してください。
