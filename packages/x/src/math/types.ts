/**
 * 2 次元サイズ
 */
export interface Size2 {
  /** 幅（ピクセルなど） */
  width: number
  /** 高さ（ピクセルなど） */
  height: number
}

/**
 * 3 次元サイズ
 */
export interface Size3 {
  /** 幅 */
  width: number
  /** 高さ */
  height: number
  /** 奥行き */
  depth: number
}

/**
 * アライン（基準点）を表す列挙。
 */
export enum Align {
  /** 左上 */
  TL = 'top_left',
  /** 右上 */
  TR = 'top_right',
  /** 左下 */
  BL = 'bottom_left',
  /** 右下 */
  BR = 'bottom_right',
}
