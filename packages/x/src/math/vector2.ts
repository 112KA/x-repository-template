export class Vector2 {
  constructor(
    public x = 0,
    public y = 0,
  ) {}

  clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  set(x: number, y: number): Vector2 {
    this.x = x
    this.y = y
    return this
  }

  add(v: Vector2) {
    this.x += v.x
    this.y += v.y
    return this
  }

  subtract(v: Vector2): Vector2 {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  scale(s: number): Vector2 {
    this.x *= s
    this.y *= s
    return this
  }

  distance(v: Vector2): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  roundZero(): Vector2 {
    this.x = this.x === 0 ? 0 : this.x < -0.01 ? this.x : this.x > 0.01 ? this.x : 0
    this.y = this.y === 0 ? 0 : this.y < -0.01 ? this.y : this.y > 0.01 ? this.y : 0

    return this
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}`
  }
}
