class DomIdMap {
  private domToId: WeakMap<Element, number>
  private idToDom: Map<number, Element>

  constructor() {
    this.domToId = new WeakMap()
    this.idToDom = new Map()
  }

  set(dom: Element, id: number): void {
    this.domToId.set(dom, id)
    this.idToDom.set(id, dom)
  }

  getDomById(id: number): Element | undefined {
    return this.idToDom.get(id)
  }

  getIdByDom(dom: Element): number | undefined {
    return this.domToId.get(dom)
  }
}

export const domIdMap = new DomIdMap()