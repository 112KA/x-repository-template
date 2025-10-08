export class Node<T> {
  uuid = window.crypto.randomUUID()
  parent?: Node<T>
  children: Node<T>[] = []

  constructor(public data: T | null = null) {
    this.uuid = crypto.randomUUID()
  }

  addChild(child: Node<T>) {
    this.children.push(child)
    child.parent = this
  }

  removeChild(child: Node<T>) {
    const index = this.children.indexOf(child)
    if (index !== -1) {
      this.children.splice(index, 1)
      child.parent = undefined
    }
  }

  traverse(callback: (node: Node<T>) => void) {
    callback(this)
    for (const child of this.children) {
      child.traverse(callback)
    }
  }
}
