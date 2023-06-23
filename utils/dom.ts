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

export function isPartiallyInViewport(element: Element | null) {
  if (element === null) return false

  const rect = element.getBoundingClientRect()
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.top < windowHeight &&
    rect.left < windowWidth &&
    rect.bottom > 0 &&
    rect.right > 0
  )
}

export const getBottomToolsDoms = () =>
  document.querySelectorAll(".flex.justify-between.lg\\:block")

export function distanceFromRight(domElement: Element) {
  if (domElement == null) return 0
  const rect = domElement.getBoundingClientRect()
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth
  const distance = viewportWidth - rect.right
  return distance
}

export function getQuestionTitle(bookmarkId: number) {
  const conversationDom = domIdMap.getDomById(bookmarkId)
  const pDom = conversationDom.parentElement?.parentElement
  const preDom = pDom?.previousElementSibling
  const innerStr =
    preDom?.firstElementChild?.children?.[1]?.firstChild.textContent.slice(
      0,
      200
    )
  return innerStr ?? ""
}
