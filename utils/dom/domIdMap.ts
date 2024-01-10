import { appStore } from "~model/app"

class DomWithBookmarkidMap {
  private domTobookmarkId: WeakMap<Element, number>
  private bookmarkiIdToDom: Map<number, Element>

  constructor() {
    this.domTobookmarkId = new WeakMap()
    this.bookmarkiIdToDom = new Map()
  }

  set(dom: Element, id: number): void {
    this.domTobookmarkId.set(dom, id)
    this.bookmarkiIdToDom.set(id, dom);
    appStore.curBookmarkIds = this.getAllIds()
  }

  getDomById(id: number): Element | undefined {
    return this.bookmarkiIdToDom.get(id)
  }

  getIdByDom(dom: Element): number | undefined {
    return this.domTobookmarkId.get(dom)
  }

  getIsLastBookmark(id: number) {
    const seqs = Array.from(this.bookmarkiIdToDom.keys());
    const lastId = seqs[seqs.length - 1];
    return id === lastId
  };

  getAllIds() {
    return Array.from(this.bookmarkiIdToDom.keys())
  }

  clear() {
    console.log("clear map!");
    this.domTobookmarkId = new WeakMap()
    this.bookmarkiIdToDom = new Map()
    appStore.curBookmarkIds = [];
  }
}

export const domWithBookmarkidMap = new DomWithBookmarkidMap()