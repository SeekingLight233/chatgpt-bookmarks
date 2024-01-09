import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"

import BookmarkIcon from "~components/Icons/BookmarkIcon"
import { createStyles } from "~utils/base"

import "./styles/base.css"

import { useMemoizedFn, useMount } from "ahooks"
import { useEffect, useMemo, useRef, useState } from "react"

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
import { domWithBookmarkidMap } from "~utils/dom/domIdMap"
import $ from "~utils/dom/selector"
import { noRecommendedDVallue } from "~config"

const Bookmark = () => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();
  const { curBookmarkIds } = appStore;
  const domRef = useRef<HTMLDivElement>(null)
  const curBookmarkDom = domRef?.current
  const bookmarkId = getbookmarkIdByDom(curBookmarkDom)
  const [show, setShow] = useState(false);



  useEffect(() => {
    if (domRef?.current) {
      const parent = getAncestor((domRef?.current.getRootNode() as ShadowRoot)?.host, 6);
      if (parent) {
        const _handleMouseEnter = () => {
          setShow(true)
        }
        const _handleMouseLeave = () => {
          setShow(false);
        }
        parent.addEventListener("mouseenter", _handleMouseEnter);
        parent.addEventListener('mouseleave', _handleMouseLeave);
        return () => {
          parent.removeEventListener('mouseenter', _handleMouseEnter);
          parent.removeEventListener('mouseleave', _handleMouseLeave);
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

  const isLast = curBookmarkIds[curBookmarkIds.length - 1] === bookmarkId;

  const shouldShow = useMemo(() => {
    if(isLast) return true;
    return show;
  }, [isLast, show])

  return (
    <div
      ref={domRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={styles.container}>
      {shouldShow && <BookmarkIcon
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
  const btmToolsDoms = $.getBottomToolsDoms();

  const nodeList: Element[] = []

  btmToolsDoms.forEach((element, idx) => {
    const anchorNode = $.getSvgByDValue(element, noRecommendedDVallue)?.parentElement?.parentElement;

    const isAnswer = idx % 2 !== 0;
    const elementWithbookmarkId = anchorNode?.parentElement as ElementWithbookmarkId;
    if (anchorNode && isAnswer) {
      elementWithbookmarkId.bookmarkId = idx;

      const parentDom = getAncestor(anchorNode, 6);
      const conversationDom = parentDom.querySelector('div[data-message-author-role="assistant"]');

      // set conversationDom to Id at this time
      conversationDom && domWithBookmarkidMap.set(conversationDom, idx)
      nodeList.push(anchorNode)
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
