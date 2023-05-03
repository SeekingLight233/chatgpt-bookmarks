import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import BookmarkIcon from "~components/BookmarkIcon";
import { createStyles } from "~utils/base";
import "./base.css"
import { useRef, useState } from "react";
import theme from "~utils/theme";
import { setShowEditBookmarkModal } from "~model/app";
import { bookmarkStore } from "~model/bookmark";
import { useHover } from "~utils/hooks/useHover";
import { getBottomToolsDoms } from "~utils/dom";



const Bookmark = () => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()
  const domRef = useRef<HTMLDivElement>(null)

  return <div
    ref={domRef}
    onClick={() => {
      const curBookmarkDom = domRef.current;
      const bookmarkId = getbookmarkIdByDom(curBookmarkDom);
      if (bookmarkId == null) return new Error("can not find bookmarkId");
      bookmarkStore.onEdit(bookmarkId)
    }}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{ ...styles.container, backgroundColor: isHovered ? theme.iconHoverColor : "#444654" }}>
    <BookmarkIcon color={isHovered ? "#fff" : theme.iconTintColor}></BookmarkIcon>
  </div>
}

const styles = createStyles({
  container: {
    width: 24,
    height: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.375rem",
    cursor: "pointer",
  }
})


export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

type ElementWithbookmarkId = Element & { bookmarkId?: number }

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {

  const btmToolsDoms = getBottomToolsDoms()

  const nodeList: Element[] = [];

  btmToolsDoms.forEach((element, idx) => {
    const lastBtn = element.querySelector('div:first-child button:last-child');
    const isAnswer = idx % 2 !== 0;
    if (lastBtn && isAnswer) {
      // we need this id for locating every conversation
      (lastBtn.parentElement as ElementWithbookmarkId).bookmarkId = idx;
      nodeList.push(lastBtn);
    }
  })

  return nodeList as unknown as NodeList
}



const getbookmarkIdByDom = (dom: ElementWithbookmarkId) => {
  const rootParent = (dom.getRootNode() as ShadowRoot).host.parentElement as ElementWithbookmarkId
  return rootParent?.bookmarkId
}



export default Bookmark
