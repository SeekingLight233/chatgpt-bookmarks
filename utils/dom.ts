
export const getBottomToolsDoms = () => document.querySelectorAll('.flex.justify-between.lg\\:block');

class DomIdMap {
  private domToId: WeakMap<Element, number>;
  private idToDom: Map<number, Element>;

  constructor() {
    this.domToId = new WeakMap();
    this.idToDom = new Map();
  }

  set(dom: Element, id: number): void {
    this.domToId.set(dom, id);
    this.idToDom.set(id, dom);
  }

  getDomById(id: number): Element | undefined {
    return this.idToDom.get(id);
  }

  getIdByDom(dom: Element): number | undefined {
    return this.domToId.get(dom);
  }
}

export const domIdMap = new DomIdMap()


export function isPartiallyInViewport(element:Element|null ) {
  if(element === null) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top < windowHeight &&
    rect.left < windowWidth &&
    rect.bottom > 0 &&
    rect.right > 0
  );
}