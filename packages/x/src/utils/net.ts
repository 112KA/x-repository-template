export function loadImage(img: HTMLImageElement, src = ''): Promise<Event> {
  const target = img
  return new Promise((resolve) => {
    target.onload = resolve
    if (src !== '') {
      target.src = src
    }
  })
}

export function getQuery(key = '') {
  const searchParams = new URLSearchParams(window.location.search)
  if (key) {
    return searchParams.get(key)
  }

  return searchParams
}
