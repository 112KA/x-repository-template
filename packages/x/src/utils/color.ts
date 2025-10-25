/**
 * RGB を 0xRRGGBB 数値へ変換。
 * @param r 0-255
 * @param g 0-255
 * @param b 0-255
 */
export function rgb2hex(r: number, g: number, b: number) {
  return (r << 16) | (g << 8) | b
}

/**
 * 0xRRGGBB 数値を [r,g,b] へ。
 * @param hex 24bitカラー
 */
export function hex2rgb(hex: number) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]
}

/**
 * RGBA 配列 (length = width*height*4) を YUV420 (I420) フォーマットへ変換。
 * @param rgba RGBA 1ピクセル4要素並び
 * @param width 幅
 * @param height 高さ
 * @returns YUV420 (Y 平面 + U 平面 + V 平面) の Uint8Array
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
 * RGB を HSV へ変換。
 * @param r0 R (数値) もしくは hex 文字列 (#ff0000 など)
 * @param g0 G
 * @param b0 B
 * @returns {h,s,v} h:0-360 s:0-1 v:0-1
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
 * HSV を RGB/HEX へ変換。
 * @param h0 Hue 0-360
 * @param s0 Saturation 0-1
 * @param v0 Value 0-1
 * @returns hex/rgb/r/g/b
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
