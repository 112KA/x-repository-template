import { Vector2 } from './vector2.js'

/**
 * Catmull-Rom スプラインによる 1 次元の 4 点補間。
 *
 * @param t - パラメータ（0 から 1）。0 で p1、1 で p2 の値を返す
 * @param p0 - 接線計算用の前前点
 * @param p1 - 補間開始点
 * @param p2 - 補間終了点
 * @param p3 - 接線計算用の次次点
 * @returns 補間された 1 次元スカラー値
 */
function CatmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const v0 = (p2 - p0) * 0.5
  const v1 = (p3 - p1) * 0.5
  const t2 = t * t
  const t3 = t * t2
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
}

/**
 * 一連の 2D 点列に対して Catmull-Rom スプライン補間を提供するクラス。
 * closed が true の場合は最後の点と最初の点を連結したループとして扱います。
 * @example
 * const points = [new Vector2(0, 0), new Vector2(1, 1), new Vector2(2, 0)]
 * const spline = new Spline(points, false)
 * const curvePoint = spline.getPoint(0.5) // 曲線上の中点を取得
 */
export class Spline {
  /** 計算時に一時的な外挿用として再利用される内部 Vector2 インスタンス */
  private tmp = new Vector2()

  /**
   * Spline インスタンスを生成します。
   * @param points 補間対象となる制御点配列（Vector2）。デフォルト: 空配列
   * @param closed true の場合は閉曲線（ループ）として扱う。デフォルト: true
   */
  constructor(
    public points: Vector2[] = [],
    public closed = true,
  ) {}

  /**
   * パラメータ t (0..1) に対応するスプライン上の点を取得します。
   * 内部で区間インデックスを求め、4 つの隣接点を用いた Catmull-Rom 補間を行います。
   * open スプライン（closed=false）の場合、端点では外挿により擬似制御点を生成します。
   * @param t 区間正規化パラメータ (0..1)
   * @param optionalTarget 結果を書き込む既存インスタンス。デフォルト: 新規生成
   * @returns 曲線上の補間結果（optionalTarget と同じ参照）
   * @example
   * const spline = new Spline([p0, p1, p2, p3], false)
   * const mid = spline.getPoint(0.5) // t=0.5 の位置を取得
   */
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
      this.tmp.set(points[0].x, points[0].y).subtract(points[1]).add(points[0])
      p0 = this.tmp
    }

    const p1 = points[intPoint % l]
    const p2 = points[(intPoint + 1) % l]

    if (this.closed || intPoint + 2 < l) {
      p3 = points[(intPoint + 2) % l]
    }
    else {
      // extrapolate last point
      this.tmp
        .set(points[l - 1].x, points[l - 1].y)
        .subtract(points[l - 2])
        .add(points[l - 1])
      p3 = this.tmp
    }

    // const p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
    // const p1 = points[intPoint];
    // const p2 = points[intPoint > l - 2 ? l - 1 : intPoint + 1];
    // const p3 = points[intPoint > l - 3 ? l - 1 : intPoint + 2];

    point.set(CatmullRom(weight, p0.x, p1.x, p2.x, p3.x), CatmullRom(weight, p0.y, p1.y, p2.y, p3.y))

    return point
  }

  getPoints(divisions: number): Vector2[] {
    const points: Vector2[] = []

    for (let d = 0; d <= divisions; d++) {
      points.push(this.getPoint(d / divisions))
    }

    return points
  }
}
