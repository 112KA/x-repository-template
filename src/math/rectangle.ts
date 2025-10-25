import { Align } from './types'
import { Vector2 } from './vector2'

/**
 * 2D 矩形を表現するクラス。
 * position (x,y) とサイズ (width,height) を保持し、左右上下の計算や交差・包含判定を提供します。
 */
export class Rectangle {
  align: Align = Align.TL

  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
  ) {}

  /**
   * 矩形の位置とサイズをまとめて設定する。
   */
  set(x: number, y: number, width: number, height: number): void {
    this.setPosition(x, y)
    this.setSize(width, height)
  }

  /**
   * 矩形の位置を設定する。
   */
  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  /**
   * 矩形のサイズを設定する。
   */
  setSize(width: number, height: number): void {
    this.width = width
    this.height = height
  }

  /**
   * 指定した Vector2 または Rectangle をこの矩形内に収めるように位置を制約する。
   */
  constraint(target: Vector2 | Rectangle): void {
    if (target instanceof Vector2) {
      target.x = target.x < this.left ? this.left : this.right < target.x ? this.right : target.x
      target.y = target.y < this.top ? this.top : this.bottom < target.y ? this.bottom : target.y
    }
    else if (target instanceof Rectangle) {
      target.x = target.x < this.left ? this.left : this.right < target.right ? this.right - target.width : target.x
      target.y = target.y < this.top ? this.top : this.bottom < target.bottom ? this.bottom - target.height : target.y
    }
  }

  /**
   * 2つの矩形が交差しているかどうかを返す。
   */
  intersects(rect: Rectangle): boolean {
    return (
      Math.max(this.left, rect.left) <= Math.min(this.right, rect.right)
      && Math.max(this.top, rect.top) <= Math.min(this.bottom, rect.bottom)
    )
  }

  /**
   * 左端の X 座標を返す（幅が負の場合も考慮）。
   */
  get left(): number {
    if (this.width >= 0) {
      return this.x
    }
    return this.x + this.width
  }

  /**
   * 右端の X 座標を返す。
   */
  get right(): number {
    return this.left + Math.abs(this.width)
  }

  /**
   * 上端の Y 座標を返す（高さが負の場合も考慮）。
   */
  get top(): number {
    if (this.height >= 0) {
      return this.y
    }
    return this.y + this.height
  }

  /**
   * 下端の Y 座標を返す。
   */
  get bottom(): number {
    return this.top + Math.abs(this.height)
  }

  /**
   * 指定座標がこの矩形内に含まれるかを判定する。
   */
  contains(x: number, y: number): boolean {
    return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom
  }

  /**
   * 指定矩形が完全にこの矩形内に含まれるかを判定する。
   */
  containsRect(rect: Rectangle): boolean {
    return this.left <= rect.left && rect.right <= this.right && this.top <= rect.top && rect.bottom <= this.bottom
  }

  /**
   * デバッグ用の文字列表現を返す。
   */
  toString(): string {
    return `x:${this.x} y:${this.y} width:${this.width} height:${this.height}`
  }
}
