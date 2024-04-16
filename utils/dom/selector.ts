import { copyDValue } from "~config";
import { isDevMode } from "~utils/devUtils";

class SelectManager {
  $dataMessage = "div[data-message-author-role]"
  $copyElem = "button"
  constructor() { }

  getBottomToolsDoms = () => {
    const conversationDoms = document.querySelectorAll(this.$dataMessage);
    const nextSiblingDoms = [];

    conversationDoms.forEach(dom => {
      const parentElement = dom.parentElement;
      if (parentElement && parentElement.nextElementSibling) {
        nextSiblingDoms.push(parentElement.nextElementSibling);
      }
    });

    return nextSiblingDoms;
  };

  getCopyElem = (conversationDom: Element) => {
    const pDom = conversationDom.parentElement?.parentElement;
    if (isDevMode) console.log("Pdom======", pDom);
    const copyElem = this.getLastSvgByDValue(pDom, copyDValue);
    if (isDevMode) console.log("copyElem===", copyElem);
    return copyElem
  }

  getScrollDom = () => {
    const scrollDom = document.querySelectorAll(
      'div[class*="react-scroll-to-bottom"]'
    )[1]

    return scrollDom
  }

  getFirstSvgByDValue = (containerElem: Element, d: string): SVGElement | null => {
    const svgs = containerElem.querySelectorAll('svg');

    for (let i = 0; i < svgs.length; i++) {
      const svg = svgs[i];
      const paths = svg.querySelectorAll('path');

      for (let j = 0; j < paths.length; j++) {
        const path = paths[j];

        if (path.getAttribute('d') === d) {
          return path.parentElement as SVGElement
        }
      }
    }

    return null;
  }

  getLastSvgByDValue = (containerElem: Element, d: string): SVGElement | null => {
    const svgs = containerElem.querySelectorAll('svg');
    let lastMatch: SVGElement | null = null; // 用于存储最后一个匹配的SVG元素

    for (let i = 0; i < svgs.length; i++) {
      const svg = svgs[i];
      const paths = svg.querySelectorAll('path');

      for (let j = 0; j < paths.length; j++) {
        const path = paths[j];

        if (path.getAttribute('d') === d) {
          lastMatch = path.parentElement as SVGElement;
        }
      }
    }

    return lastMatch;
  }


}

const $ = new SelectManager()

export default $