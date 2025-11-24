/**
 * CompositeKeyMap<K1, K2, V>
 *
 * 2つのキー (K1, K2) を組み合わせて単一の Map として扱うユーティリティクラス。
 *
 * @template K1 第1キーの型
 * @template K2 第2キーの型
 * @template V 値の型
 *
 * @remarks
 * - 内部では各キーを JSON.stringify で直列化し、区切り文字 '|' で連結した文字列を Map のキーとして使用します。
 * - JSON に直列化できない値（関数、循環参照など）は正しく扱えません。キーの順序依存や表現の差異に注意してください。
 */
export class CompositeKeyMap<K1, K2, V> {
  private map = new Map<string, V>()

  /**
   * 複合キーを内部格納用の文字列に変換します。
   *
   * @param key1 - 第1キー
   * @param key2 - 第2キー
   * @returns 直列化された複合キー文字列
   * @remarks JSON.stringify を用いるため、直列化可能であることが前提です。
   */
  private _createKey(key1: K1, key2: K2): string {
    // JSON.stringify() を使って、どのような型のキーでも安全な文字列に変換します
    return `${JSON.stringify(key1)}|${JSON.stringify(key2)}`
  }

  /**
   * 指定した複合キーに値を設定します。
   *
   * @param key1 - 第1キー
   * @param key2 - 第2キー
   * @param value - 設定する値
   * @returns このインスタンス（メソッドチェーン用）
   */
  public set(key1: K1, key2: K2, value: V): this {
    const compositeKey = this._createKey(key1, key2)
    this.map.set(compositeKey, value)
    return this
  }

  /**
   * 指定した複合キーに対応する値を返します。
   *
   * @param key1 - 第1キー
   * @param key2 - 第2キー
   * @returns 対応する値。存在しない場合は undefined を返します。
   */
  public get(key1: K1, key2: K2): V | undefined {
    const compositeKey = this._createKey(key1, key2)
    return this.map.get(compositeKey)
  }

  /**
   * 指定した複合キーが存在するかを返します。
   *
   * @param key1 - 第1キー
   * @param key2 - 第2キー
   * @returns 存在する場合は true、それ以外は false
   */
  public has(key1: K1, key2: K2): boolean {
    const compositeKey = this._createKey(key1, key2)
    return this.map.has(compositeKey)
  }

  /**
   * 指定した複合キーのエントリを削除します。
   *
   * @param key1 - 第1キー
   * @param key2 - 第2キー
   * @returns 削除に成功した場合は true
   */
  public delete(key1: K1, key2: K2): boolean {
    const compositeKey = this._createKey(key1, key2)
    return this.map.delete(compositeKey)
  }

  /**
   * マップ内のエントリ数を返します（読み取り専用）。
   *
   * @returns 現在のエントリ数
   */
  public get size(): number {
    return this.map.size
  }

  /**
   * 全てのエントリを削除します。
   *
   * @remarks 内部の Map をクリアします。
   */
  public clear(): void {
    this.map.clear()
  }

  /**
   * マップのすべての値を返すイテレータ。
   *
   * @returns 値のイテレータ
   */
  public* values(): IterableIterator<V> {
    yield* this.map.values()
  }

  /**
   * マップのすべてのキーのペアを返すイテレータ。
   *
   * @returns [K1, K2] のイテレータ
   * @remarks 内部の複合キー文字列を split / JSON.parse で復元します。
   */
  public* keys(): IterableIterator<[K1, K2]> {
    for (const compositeKey of this.map.keys()) {
      // JSON.parse() を使ってキーを元に戻す
      const [key1Str, key2Str] = compositeKey.split('|')
      const key1 = JSON.parse(key1Str)
      const key2 = JSON.parse(key2Str)
      yield [key1, key2] as [K1, K2]
    }
  }

  /**
   * マップのすべてのキーと値のペアを返すイテレータ。
   *
   * @returns [[K1, K2], V] のイテレータ
   */
  public* entries(): IterableIterator<[[K1, K2], V]> {
    for (const [compositeKey, value] of this.map.entries()) {
      const [key1Str, key2Str] = compositeKey.split('|')
      const key1 = JSON.parse(key1Str)
      const key2 = JSON.parse(key2Str)
      yield [[key1, key2] as [K1, K2], value]
    }
  }

  /**
   * デフォルトの反復処理は entries() と同じです。
   *
   * @returns [[K1, K2], V] のイテレータ
   */
  public [Symbol.iterator](): IterableIterator<[[K1, K2], V]> {
    return this.entries()
  }
}
