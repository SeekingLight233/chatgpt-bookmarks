import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"

import BookmarkIcon from "~components/Icons/BookmarkIcon"
import { createStyles } from "~utils/base"

import "./styles/base.css"

import { useMemoizedFn, useMount } from "ahooks"
import { useEffect, useRef, useState } from "react"

import { appStore } from "~model/app"
import {
  type ElementWithbookmarkId,
  findBookmarkByBookmarkId,
  getBookmarkFromLink,
  getSessionId,
  getbookmarkIdByDom,
  scrollIntoBookmark,
  sideBarStore
} from "~model/sidebar"
import { getAncestor, getQuestionTitle } from "~utils/dom"
import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"
import { domIdMap } from "~utils/dom/domIdMap"
import $ from "~utils/dom/selector"

const Bookmark = () => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()
  const domRef = useRef<HTMLDivElement>(null)
  const curBookmarkDom = domRef?.current
  const bookmarkId = getbookmarkIdByDom(curBookmarkDom)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (domRef?.current) {

      const parent = getAncestor((domRef?.current.getRootNode() as ShadowRoot)?.host, 6);
      if (parent) {
        const btnsDom = parent.querySelector("div.flex.gap-1");
        const isLast = btnsDom.childNodes.length === 3;
        if (isLast) setShow(true)

        const handleMouseEnter = () => setShow(true);
        const handleMouseLeave = () => {
          setShow(isLast ? true : false);
        }

        parent.addEventListener("mouseenter", handleMouseEnter);
        parent.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          parent.removeEventListener('mouseenter', handleMouseEnter);
          parent.removeEventListener('mouseleave', handleMouseLeave);
        };

      }

    }
  }, [domRef?.current])

  const handleClick = useMemoizedFn(() => {
    if (bookmarkId == null) return new Error("can not find bookmarkId")
    const targetBookmark = findBookmarkByBookmarkId(bookmarkId)
    console.log("targetBookmark===", targetBookmark)
    if (targetBookmark == null) {
      const questionTitle = getQuestionTitle(bookmarkId)

      sideBarStore.onEdit({
        bookmarkId,
        title: questionTitle,
        sessionId: getSessionId(),
        createUnix: new Date().getTime()
      })
    } else {
      sideBarStore.onEdit(targetBookmark)
    }
  })

  return (
    <div
      ref={domRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={styles.container}>
      {show && <BookmarkIcon
        color={
          isHovered ? theme.bookmarkIconHoverColor : theme.iconTintColor
        }></BookmarkIcon>}
    </div>
  )
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
    marginTop: 1
  }
})

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const btmToolsDoms = $.getBottomToolsDoms()

  const nodeList: Element[] = []

  btmToolsDoms.forEach((element, idx) => {
    const lastBtn = element.querySelector("div:first-child button:last-child")
    const isAnswer = idx % 2 !== 0;
    const elementWithbookmarkId = lastBtn?.parentElement as ElementWithbookmarkId;
    if (lastBtn && isAnswer) {
      elementWithbookmarkId.bookmarkId = idx;
      const parentDom = lastBtn?.parentElement?.parentElement?.parentElement?.parentElement;
      const conversationDom = parentDom.querySelector('div[data-message-author-role="assistant"]');

      // set conversationDom to Id at this time
      const targetId = domIdMap.getIdByDom(conversationDom);
      if (targetId == null && conversationDom) {
        conversationDom && domIdMap.set(conversationDom, idx)
        nodeList.push(lastBtn)
      }
    }

    if (idx > 0 && idx === btmToolsDoms.length - 1) {
      const linkBookmark = getBookmarkFromLink()
      if (appStore.init === false && linkBookmark) {
        setTimeout(() => {
          scrollIntoBookmark(+linkBookmark)
        }, 1)
        appStore.init = true
      }
    }
  })

  return nodeList as unknown as NodeList
}

export default Bookmark
