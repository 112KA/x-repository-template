import { Align } from './types'
import { Vector2 } from './vector2'

export class Rectangle {
  align: Align = Align.TL

  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
  ) {}

  set(x: number, y: number, width: number, height: number): void {
    this.setPosition(x, y)
    this.setSize(width, height)
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  setSize(width: number, height: number): void {
    this.width = width
    this.height = height
  }

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
   * 交差判定
   * @param {*} rect
   */
  intersects(rect: Rectangle): boolean {
    return (
      Math.max(this.left, rect.left) <= Math.min(this.right, rect.right)
      && Math.max(this.top, rect.top) <= Math.min(this.bottom, rect.bottom)
    )
  }

  get left(): number {
    if (this.width >= 0) {
      return this.x
    }
    return this.x + this.width
  }

  get right(): number {
    return this.left + Math.abs(this.width)
  }

  get top(): number {
    if (this.height >= 0) {
      return this.y
    }
    return this.y + this.height
  }

  get bottom(): number {
    return this.top + Math.abs(this.height)
  }

  contains(x: number, y: number): boolean {
    return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom
  }

  containsRect(rect: Rectangle): boolean {
    return this.left <= rect.left && rect.right <= this.right && this.top <= rect.top && rect.bottom <= this.bottom
  }

  toString(): string {
    return `x:${this.x} y:${this.y} width:${this.width} height:${this.height}`
  }
}
