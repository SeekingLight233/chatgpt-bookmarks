class SelectManager {
  $dataMessage = "div[data-message-author-role]"
  $copyElem = "div:nth-of-type(2) > div:first-of-type > button:first-of-type"
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
    const copyElem: HTMLButtonElement = conversationDom.parentElement?.parentElement.querySelector(
      this.$copyElem
    )
    return copyElem
  }

  getScrollDom = () => {
    const scrollDom = document.querySelectorAll(
      'div[class*="react-scroll-to-bottom"]'
    )[1]

    return scrollDom
  }

  getSvgByDValue = (element: Element, d: string): SVGElement | null => {
    const svgs = element.querySelectorAll('svg');

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


}

const $ = new SelectManager()

export default $