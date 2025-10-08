import { Vector2 } from './vector2.js'

function CatmullRom(t: number, p0: number, p1: number, p2: number, p3: number) {
  const v0 = (p2 - p0) * 0.5
  const v1 = (p3 - p1) * 0.5
  const t2 = t * t
  const t3 = t * t2
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
}

const tmp = new Vector2()

export class Spline {
  constructor(
    public points: Vector2[] = [],
    public closed = true,
  ) {}

  getPoint(t: number, optionalTarget = new Vector2()): Vector2 {
    const point = optionalTarget

    const { points } = this
    const l = points.length
    const p = (l - (this.closed ? 0 : 1)) * t

    let intPoint = Math.floor(p)
    let weight = p - intPoint

    if (this.closed) {
      intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / l) + 1) * l
    }
    else if (weight === 0 && intPoint === l - 1) {
      intPoint = l - 2
      weight = 1
    }

    let p0: Vector2
    let p3: Vector2 // 4 points (p1 & p2 defined below)

    if (this.closed || intPoint > 0) {
      p0 = points[(intPoint - 1) % l]
    }
    else {
      // extrapolate first point
      tmp.set(points[0].x, points[0].y).subtract(points[1]).add(points[0])
      p0 = tmp
    }

    const p1 = points[intPoint % l]
    const p2 = points[(intPoint + 1) % l]

    if (this.closed || intPoint + 2 < l) {
      p3 = points[(intPoint + 2) % l]
    }
    else {
      // extrapolate last point
      tmp
        .set(points[l - 1].x, points[l - 1].y)
        .subtract(points[l - 2])
        .add(points[l - 1])
      p3 = tmp
    }

    // const p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
    // const p1 = points[intPoint];
    // const p2 = points[intPoint > l - 2 ? l - 1 : intPoint + 1];
    // const p3 = points[intPoint > l - 3 ? l - 1 : intPoint + 2];

    point.set(CatmullRom(weight, p0.x, p1.x, p2.x, p3.x), CatmullRom(weight, p0.y, p1.y, p2.y, p3.y))

    return point
  }

  getPoints(divisions: number) {
    const points: Vector2[] = []

    for (let d = 0; d <= divisions; d++) {
      points.push(this.getPoint(d / divisions))
    }

    return points
  }
}
