/**
 * 値 v を [min, max] に収める。
 * @param v 対象値
 * @param min 下限
 * @param max 上限
 */
export const clamp = (v: number, min: number, max: number): number => Math.max(Math.min(v, max), min)

/**
 * 数値をゼロパディングした文字列へ変換。
 * @param n 数値
 * @param length 桁幅
 */
export const zeroPadding = (n: number, length: number): string => n.toString().padStart(length, '0')

/**
 * 線形補間。
 * @param a 開始値
 * @param b 終了値
 * @param t 補間係数 (0〜1 推奨)
 */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
