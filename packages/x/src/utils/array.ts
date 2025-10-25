/**
 * 配列をフィッシャー–イェーツ法でシャッフルする（非破壊）。
 * @param arr 元配列（変更されない）
 * @returns シャッフル済みの新しい配列
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const target = arr.slice()
  for (let i = target.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[target[i], target[j]] = [target[j], target[i]]
  }
  return target
}
