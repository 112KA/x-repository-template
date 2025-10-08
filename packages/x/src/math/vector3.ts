export class Vector3 {
  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
  ) {}

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  set(x: number, y: number, z: number): Vector3 {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  add(v: Vector3): Vector3 {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }

  subtract(v: Vector3): Vector3 {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }

  scale(s: number): Vector3 {
    this.x *= s
    this.y *= s
    this.z *= s
    return this
  }

  distance(v: Vector3): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    const dz = v.z - this.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  roundZero(): Vector3 {
    this.x = this.x === 0 ? 0 : this.x < -0.01 ? this.x : this.x > 0.01 ? this.x : 0
    this.y = this.y === 0 ? 0 : this.y < -0.01 ? this.y : this.y > 0.01 ? this.y : 0
    this.z = this.z === 0 ? 0 : this.z < -0.01 ? this.z : this.z > 0.01 ? this.z : 0

    return this
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`
  }
}
