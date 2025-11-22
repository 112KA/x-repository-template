/**
 * 3 次元ベクトルを表すユーティリティクラス。
 */
export class Vector3 {
  /**
   * 新しい Vector3 を生成します。
   *
   * @param x - X 成分（デフォルト 0）
   * @param y - Y 成分（デフォルト 0）
   * @param z - Z 成分（デフォルト 0）
   */
  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
  ) {}

  /**
   * 現在のベクトルのクローンを返す。
   *
   * @returns 新しい Vector3 インスタンス（同じ成分）
   */
  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  /**
   * ベクトルの値を設定する。
   *
   * @param x - X 成分
   * @param y - Y 成分
   * @param z - Z 成分
   * @returns this
   */
  set(x: number, y: number, z: number): Vector3 {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  /**
   * 他ベクトルを加算して自身を更新する。
   *
   * @param v - 加算するベクトル
   * @returns this
   */
  add(v: Vector3): Vector3 {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }

  /**
   * 他ベクトルを減算して自身を更新する。
   *
   * @param v - 減算するベクトル
   * @returns this
   */
  subtract(v: Vector3): Vector3 {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }

  /**
   * スカラーでスケーリングする。
   *
   * @param s - スケール値
   * @returns this
   */
  scale(s: number): Vector3 {
    this.x *= s
    this.y *= s
    this.z *= s
    return this
  }

  /**
   * 指定ベクトルとの距離を返す。
   *
   * @param v - 比較対象のベクトル
   * @returns ユークリッド距離
   */
  distance(v: Vector3): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    const dz = v.z - this.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * 小さい値をゼロに丸める（しきい値: 0.01）。
   *
   * @returns this
   */
  roundZero(): Vector3 {
    this.x = this.x === 0 ? 0 : this.x < -0.01 ? this.x : this.x > 0.01 ? this.x : 0
    this.y = this.y === 0 ? 0 : this.y < -0.01 ? this.y : this.y > 0.01 ? this.y : 0
    this.z = this.z === 0 ? 0 : this.z < -0.01 ? this.z : this.z > 0.01 ? this.z : 0

    return this
  }

  /**
   * デバッグ用の文字列を返す。
   *
   * @returns "x: ..., y: ..., z: ..."
   */
  toString(): string {
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`
  }
}
