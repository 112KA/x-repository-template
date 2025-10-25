/**
 * 汎用的なツリー構造のノードを表すクラス
 *
 * @template T ノードが保持するデータの型
 *
 * 概要:
 * - 各ノードは一意の UUID を持ち、親子関係を保持できます。
 * - 深さ優先での巡回など、ツリー操作の基本メソッドを提供します。
 *
 * 例:
 * ```ts
 * const root = new Node<string>('root')
 * const child = new Node('child')
 * root.addChild(child)
 * root.traverse(n => console.log(n.data))
 * ```
 */
export class Node<T> {
  /**
   * ノード固有の一意識別子（UUID）
   *
   * Web Crypto API の randomUUID を利用して生成されます。サーバサイドや一部環境では crypto が利用できない場合があります。
   */
  uuid = window.crypto.randomUUID()

  /**
   * 親ノード（存在しない場合は undefined）
   *
   * このプロパティはノードがツリーに追加されたときに自動的に設定され、削除時に undefined に戻されます。
   */
  parent?: Node<T>

  /**
   * 子ノードの配列
   *
   * children の順序は追加順を保持します。
   */
  children: Node<T>[] = []

  /**
   * 新しいノードを生成します。
   *
   * @param data ノードが保持する任意のデータ。指定しない場合は null。
   *
   * 副作用:
   * - コンストラクタ内で UUID を再生成します（環境により crypto が必要）。
   */
  constructor(public data: T | null = null) {
    this.uuid = crypto.randomUUID()
  }

  /**
   * 指定したノードを子ノードとして追加します。
   *
   * @param child 追加する子ノード
   *
   * 振る舞い:
   * - child を children に push し、child.parent をこのノードに設定します。
   */
  addChild(child: Node<T>) {
    this.children.push(child)
    child.parent = this
  }

  /**
   * 指定した子ノードを削除します（見つからなければ何もしません）。
   *
   * @param child 削除する子ノード
   *
   * 挙動:
   * - children 配列から該当ノードを削除し、child.parent を undefined に戻します。
   */
  removeChild(child: Node<T>) {
    const index = this.children.indexOf(child)
    if (index !== -1) {
      this.children.splice(index, 1)
      child.parent = undefined
    }
  }

  /**
   * ツリーを再帰的に巡回してコールバックを実行します（深さ優先）。
   *
   * @param callback 各ノードで呼び出される関数
   *
   * 注意:
   * - コールバック内で children を変更すると挙動が変わる可能性があります。
   */
  traverse(callback: (node: Node<T>) => void) {
    callback(this)
    for (const child of this.children) {
      child.traverse(callback)
    }
  }
}
