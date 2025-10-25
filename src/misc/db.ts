/** IndexedDB の ObjectStore 設定 */
export interface Store {
  /** ストア名 */
  name: string
  /** createObjectStore 用パラメータ */
  options: IDBObjectStoreParameters
}

/**
 * IndexedDB の簡易ラッパー。バージョンは固定(1)。
 * 現状 onupgradeneeded で 'images' ストアのみ生成 (将来拡張余地あり)。
 */
export class DB {
  protected _storeMap = new Map<string, Store>()

  constructor(protected _dbName: string) {}

  /** ストア情報を登録 (接続前に呼び出す) */
  public addStore(store: Store) {
    this._storeMap.set(store.name, store)
  }

  /**
   * DB へ接続し IDBDatabase を取得
   * @returns IDBDatabase
   */
  protected _connect(): Promise<IDBDatabase> {
    const request = indexedDB.open(this._dbName, 1)
    return new Promise((resolve, reject) => {
      request.onerror = reject
      request.onsuccess = (e: Event) => {
        // console.log("_connect", "onsuccess", request.result);
        resolve((e.target as IDBRequest<IDBDatabase>).result)
      }
      request.onupgradeneeded = (e) => {
        // console.log('_connect', 'onupgradeneeded', e, this._storeMap.get('images'))
        const db = (e.target as IDBRequest<IDBDatabase>).result
        const store = this._storeMap.get('images')
        if (store !== undefined) {
          // console.log("_connect", "onupgradeneeded", db);
          db.createObjectStore(store.name, store.options)
        }
        // this._storeMap.forEach((store, key) => {
        //   console.log("_connect", "createObjectStore", key, store);
        //   db.createObjectStore(store.name, store.options);
        // });
      }
    })
  }

  /**
   * ObjectStore へ新規追加
   * @param storeName ストア名
   * @param object 保存対象
   * @returns request 成功イベント
   */
  public async add(storeName: string, object: unknown): Promise<Event> {
    const db = await this._connect()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.add(object)

    return new Promise((resolve, reject) => {
      request.onerror = reject
      request.onsuccess = resolve
    })
  }

  /**
   * 指定 ID のオブジェクト取得
   * @param storeName ストア名
   * @param id キー
   * @returns 取得結果
   */
  public async get(storeName: string, id: string): Promise<IDBDatabase> {
    const db = await this._connect()
    const transaction = db
      .transaction([storeName], 'readonly')
      .objectStore(storeName)
      .get(id) as IDBRequest<IDBDatabase>

    return new Promise((resolve, reject) => {
      transaction.onerror = reject
      transaction.onsuccess = () => resolve(transaction.result)
    })
  }

  /**
   * 指定 ID のオブジェクト削除
   * @param storeName ストア名
   * @param id キー
   */
  public async delete(storeName: string, id: string) {
    const db = await this._connect()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(id)

    return new Promise((resolve, reject) => {
      request.onerror = reject
      request.onsuccess = resolve
    })
  }
}
