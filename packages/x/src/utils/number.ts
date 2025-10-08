/**
 * clamp
 * @param {number} v
 * @param {number} min
 * @param {number} max
 * @returns {number} clamped value
 */
export const clamp = (v: number, min: number, max: number): number => Math.max(Math.min(v, max), min)

/**
 * zero padding
 * @param n
 * @param length
 * @returns {string} zero padded string
 */
export const zeroPadding = (n: number, length: number): string => n.toString().padStart(length, '0')

/**
 * lerp
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
