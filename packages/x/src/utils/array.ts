export function shuffle<T = number>(arr: T[]) {
  const target = arr
  for (let i = target.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [target[i], target[j]] = [target[j], target[i]]
  }
  return target
}
