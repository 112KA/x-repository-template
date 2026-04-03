import { useEffect } from 'react'

export function useViewportHeight() {
  useEffect(() => {
    const setFullHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // 初期実行
    setFullHeight()

    // リサイズ時に再計算
    window.addEventListener('resize', setFullHeight)

    // クリーンアップ（メモリリーク防止）
    return () => window.removeEventListener('resize', setFullHeight)
  }, [])
}
