/**
 * Converts RGB color values to a hexadecimal number.
 *
 * @param r - The red component of the color (0-255).
 * @param g - The green component of the color (0-255).
 * @param b - The blue component of the color (0-255).
 * @returns The hexadecimal representation of the RGB color.
 */
export function rgb2hex(r: number, g: number, b: number) {
  return (r << 16) | (g << 8) | b
}

/**
 * Converts a hexadecimal color value to an RGB array.
 *
 * @param hex - The hexadecimal color value.
 * @returns An array containing the RGB values [red, green, blue].
 */
export function hex2rgb(hex: number) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]
}

/**
 * rgba2yuv420
 * @param {number[]} rgba
 * @param {number} width
 * @param {number} height
 * @returns {Uint8Array} 変換後のbuffer
 * @ref https://en.wikipedia.org/wiki/File:Yuv420.svg
 */
export function rgba2yuv420(rgba: number[], width: number, height: number) {
  const buffer = new Uint8Array((width * height * 3) / 2)
  let r: number
  let g: number
  let b: number
  let i = 0
  let upos = width * height
  let vpos = upos + upos / 4
  for (let line = 0; line < height; line++) {
    if (line % 2 === 0) {
      for (let x = 0; x < width; x += 2) {
        r = rgba[4 * i]
        g = rgba[4 * i + 1]
        b = rgba[4 * i + 2]

        buffer[i++] = ((66 * r + 129 * g + 25 * b) >> 8) + 16

        buffer[upos++] = ((-38 * r + -74 * g + 112 * b) >> 8) + 128
        buffer[vpos++] = ((112 * r + -94 * g + -18 * b) >> 8) + 128

        r = rgba[4 * i]
        g = rgba[4 * i + 1]
        b = rgba[4 * i + 2]
        buffer[i++] = ((66 * r + 129 * g + 25 * b) >> 8) + 16
      }
    }
    else {
      for (let x = 0; x < width; x += 1) {
        r = rgba[4 * i]
        g = rgba[4 * i + 1]
        b = rgba[4 * i + 2]
        buffer[i++] = ((66 * r + 129 * g + 25 * b) >> 8) + 16
      }
    }
  }

  return buffer
}

/**
 * Converts RGB color values to HSV color values.
 *
 * @param r0 - The red color value (0-255) or a hex color string.
 * @param g0 - The green color value (0-255).
 * @param b0 - The blue color value (0-255).
 * @returns {{h: number, s: number, v: number}} An object containing the HSV color values:
 *  - `h`: Hue (0-360)
 *  - `s`: Saturation (0-1)
 *  - `v`: Value (0-1)
 *
 * @example
 * ```typescript
 * const hsv = rgb2hsv(255, 0, 0); // { h: 0, s: 1, v: 1 }
 * const hsvFromHex = rgb2hsv('#ff0000'); // { h: 0, s: 1, v: 1 }
 * ```
 *
 * @see https://qiita.com/akebi_mh/items/3377666c26071a4284ee
 */
export function rgb2hsv(r0: number, g0 = 0, b0 = 0): { h: number, s: number, v: number } {
  // 引数処理
  let tmp = [r0, g0, b0]
  if (r0 !== void 0 && g0 === void 0) {
    const cc = Number.parseInt(
      r0
        .toString()
        .replace(/[^\da-f]/gi, '')
        .replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3'),
      16,
    )
    tmp = [(cc >> 16) & 0xFF, (cc >> 8) & 0xFF, cc & 0xFF]
  }
  else {
    for (const i in tmp) tmp[i] = Math.max(0, Math.min(255, Math.floor(tmp[i])))
  }
  const [r, g, b] = tmp

  // RGB to HSV 変換
  const v = Math.max(r, g, b)
  const d = v - Math.min(r, g, b)
  const s = v ? d / v : 0
  const a = [r, g, b, r, g]
  const i = a.indexOf(v)
  const h = s ? (((a[i + 1] - a[i + 2]) / d + i * 2 + 6) % 6) * 60 : 0

  // 戻り値
  return { h, s, v: v / 255 }
}

/**
 * Converts HSV (Hue, Saturation, Value) color values to RGB (Red, Green, Blue) color values.
 *
 * @param h - The hue of the color, a number between 0 and 360.
 * @param s - The saturation of the color, a number between 0 and 1.
 * @param v - The value (brightness) of the color, a number between 0 and 1.
 * @returns An object containing the following properties:
 * - `hex`: The hexadecimal string representation of the RGB color.
 * - `rgb`: An array containing the RGB values as numbers.
 * - `r`: The red component of the RGB color.
 * - `g`: The green component of the RGB color.
 * - `b`: The blue component of the RGB color.
 *
 * @see https://qiita.com/akebi_mh/items/3377666c26071a4284ee
 */
export function hsv2rgb(
  h0: number,
  s0: number,
  v0: number,
): { hex: string, rgb: number[], r: number, g: number, b: number } {
  // 引数処理
  const h = ((h0 < 0 ? (h0 % 360) + 360 : h0) % 360) / 60
  const s = s0 < 0 ? 0 : s0 > 1 ? 1 : s0
  const v = v0 < 0 ? 0 : v0 > 1 ? 1 : v0

  // HSV to RGB 変換
  const c = [5, 3, 1].map(n =>
    Math.round((v - Math.max(0, Math.min(1, 2 - Math.abs(2 - ((h + n) % 6)))) * s * v) * 255),
  )

  // 戻り値
  return {
    hex: `#${((c[0] << 16) | (c[1] << 8) | c[2]).toString(16).padStart(6, '0')}`,
    rgb: c,
    r: c[0],
    g: c[1],
    b: c[2],
  }
}
