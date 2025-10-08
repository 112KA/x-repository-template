/**
 * キーを復号化したMap
 *
 * // 使用例
 * // 型を定義してインスタンスを作成
 * const userItems = new CompositeKeyMap<string, number, { name: string }>();
 *
 * userItems.set('userA', 101, { name: 'product A' });
 * userItems.set('userA', 102, { name: 'product B' });
 *
 * // for...of ループ
 * for (const [[userId, itemId], item] of userItems) {
 *   console.log(`User ID: ${userId}, Item ID: ${itemId}, Name: ${item.name}`);
 * }
 * // 出力:
 * // User ID: userA, Item ID: 101, Name: product A
 * // User ID: userA, Item ID: 102, Name: product B
 *
 * // .keys() イテレータ
 * for (const [userId, itemId] of userItems.keys()) {
 *   console.log(`Key pair: (${userId}, ${itemId})`);
 * }
 * // 出力:
 * // Key pair: (userA, 101)
 * // Key pair: (userA, 102)
 */
export class CompositeKeyMap<K1, K2, V> {
  private map = new Map<string, V>()

  // キーを文字列に変換するプライベートメソッド
  private _createKey(key1: K1, key2: K2): string {
    // JSON.stringify() を使って、どのような型のキーでも安全な文字列に変換します
    return `${JSON.stringify(key1)}|${JSON.stringify(key2)}`
  }

  public set(key1: K1, key2: K2, value: V): this {
    const compositeKey = this._createKey(key1, key2)
    this.map.set(compositeKey, value)
    return this
  }

  public get(key1: K1, key2: K2): V | undefined {
    const compositeKey = this._createKey(key1, key2)
    return this.map.get(compositeKey)
  }

  public has(key1: K1, key2: K2): boolean {
    const compositeKey = this._createKey(key1, key2)
    return this.map.has(compositeKey)
  }

  public delete(key1: K1, key2: K2): boolean {
    const compositeKey = this._createKey(key1, key2)
    return this.map.delete(compositeKey)
  }

  public get size(): number {
    return this.map.size
  }

  public clear(): void {
    this.map.clear()
  }

  /**
   * マップのすべての値をイテレータで返します。
   */
  public* values(): IterableIterator<V> {
    yield* this.map.values()
  }

  /**
   * マップのすべてのキーのペアをイテレータで返します。
   * 注意: _createKeyの逆変換が必要です。ここでは簡易的に行います。
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
   * マップのすべてのキーと値のペアをイテレータで返します。
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
   * `for...of`ループのデフォルトイテレータ。`entries()`と同じです。
   */
  public [Symbol.iterator](): IterableIterator<[[K1, K2], V]> {
    return this.entries()
  }
}
