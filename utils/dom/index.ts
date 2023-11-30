import { domIdMap } from "./domIdMap";

export function isPartiallyInViewport(element: Element | null) {
  if (element === null) return false

  const rect = element?.getBoundingClientRect?.()
  if (rect == null) return false
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



export function distanceFromRight(domElement: Element) {
  if (domElement == null) return 0
  const rect = domElement?.getBoundingClientRect?.()
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth
  const distance = viewportWidth - rect.right
  return distance
}

export function getQuestionTitle(bookmarkId: number) {
  const conversationDom = domIdMap.getDomById(bookmarkId)

  const pDom = getAncestor(conversationDom, 6);
  const preDom = pDom?.previousElementSibling;

  const questionDom = preDom.querySelector('div[data-message-author-role="user"]');

  const innerStr = questionDom.textContent.slice(0, 200)
  return innerStr ?? ""
}

export const getAncestor = (dom, level): Element => {
  let currentElement = dom;
  for (let i = 0; i < level; i++) {
    if (currentElement.parentElement) {
      currentElement = currentElement.parentElement;
    } else {
      return null;
    }
  }
  return currentElement;
};