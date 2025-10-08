export interface Store {
  name: string
  options: IDBObjectStoreParameters
}

export class DB {
  protected _storeMap = new Map<string, Store>()

  constructor(protected _dbName: string) {}

  public addStore(store: Store) {
    this._storeMap.set(store.name, store)
  }

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
