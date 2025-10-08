export function deepmerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const destination = {}
  Object.assign(destination, target)

  const merge = (a: Record<string, unknown>, b: Record<string, unknown>) => {
    const tmpRecord = a
    const entries = Object.entries(b)

    for (const [key, value] of entries) {
      if (typeof value !== 'object' || typeof tmpRecord[key] !== 'object') {
        tmpRecord[key] = value
      }
      else {
        merge(tmpRecord[key] as Record<string, unknown>, value as Record<string, unknown>)
      }
    }
  }

  merge(destination, source)

  return destination
}
