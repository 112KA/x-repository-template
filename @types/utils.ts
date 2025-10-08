/** Alias type for value that can be null */
export type Nullable<T> = T | null

/**
 * 一部のプロパティのみ省略可能にする
 * https://qiita.com/aqua_ix/items/b3a9b920781d833cede8
 */
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** オブジェクトのvalueのユニオン型を取得する型 */
export type ValueOf<T> = T[keyof T]
