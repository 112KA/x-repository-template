/**
 * 2 次元ベクトルを表すユーティリティクラス。
 */
export class Vector2 {
  /**
   * 新しい Vector2 を生成します。
   *
   * @param x - X 成分（デフォルト 0）
   * @param y - Y 成分（デフォルト 0）
   */
  constructor(
    public x = 0,
    public y = 0,
  ) {}

  /**
   * 現在のベクトルのクローンを返す。
   *
   * @returns 新しい Vector2 インスタンス
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  /**
   * ベクトルの値を設定する。
   *
   * @param x - X 成分
   * @param y - Y 成分
   * @returns this
   */
  set(x: number, y: number): Vector2 {
    this.x = x
    this.y = y
    return this
  }

  /**
   * 他ベクトルを加算して自身を更新する。
   *
   * @param v - 加算するベクトル
   * @returns this
   */
  add(v: Vector2) {
    this.x += v.x
    this.y += v.y
    return this
  }

  /**
   * 他ベクトルを減算して自身を更新する。
   *
   * @param v - 減算するベクトル
   * @returns this
   */
  subtract(v: Vector2): Vector2 {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  /**
   * スカラーでスケーリングする。
   *
   * @param s - スケール値
   * @returns this
   */
  scale(s: number): Vector2 {
    this.x *= s
    this.y *= s
    return this
  }

  /**
   * 指定ベクトルとの距離を返す。
   *
   * @param v - 比較対象のベクトル
   * @returns ユークリッド距離
   */
  distance(v: Vector2): number {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * 小さい値をゼロに丸める（しきい値: 0.01）。
   *
   * @returns this
   */
  roundZero(): Vector2 {
    this.x = this.x === 0 ? 0 : this.x < -0.01 ? this.x : this.x > 0.01 ? this.x : 0
    this.y = this.y === 0 ? 0 : this.y < -0.01 ? this.y : this.y > 0.01 ? this.y : 0

    return this
  }

  /**
   * デバッグ用の文字列を返す。
   *
   * @returns "x: ..., y: ..."
   */
  toString(): string {
    return `x: ${this.x}, y: ${this.y}`
  }
}
