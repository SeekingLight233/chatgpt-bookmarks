import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"

import BookmarkIcon from "~components/Icons/BookmarkIcon"
import { createStyles } from "~utils/base"

import "./styles/base.css"

import { useMemoizedFn } from "ahooks"
import { useRef, useState } from "react"

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
import { domIdMap, getBottomToolsDoms, getQuestionTitle } from "~utils/dom"
import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"

const Bookmark = () => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()
  const domRef = useRef<HTMLDivElement>(null)

  const handleClick = useMemoizedFn(() => {
    const curBookmarkDom = domRef.current
    const bookmarkId = getbookmarkIdByDom(curBookmarkDom)
    if (bookmarkId == null) return new Error("can not find bookmarkId")
    const targetBookmark = findBookmarkByBookmarkId(bookmarkId)
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
      style={{
        ...styles.container,
        backgroundColor: isHovered ? theme.iconHoverColor : theme.bookmarkBg
      }}>
      <BookmarkIcon
        color={
          isHovered ? theme.bookmarkIconHoverColor : theme.iconTintColor
        }></BookmarkIcon>
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
    cursor: "pointer"
  }
})

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const btmToolsDoms = getBottomToolsDoms()

  const nodeList: Element[] = []

  btmToolsDoms.forEach((element, idx) => {
    const lastBtn = element.querySelector("div:first-child button:last-child")
    const isAnswer = idx % 2 !== 0
    if (lastBtn && isAnswer) {
      ;(lastBtn.parentElement as ElementWithbookmarkId).bookmarkId = idx
      // TODO: find a better way to get conversationDom
      const conversationDom =
        lastBtn?.parentElement?.parentElement?.parentElement?.parentElement
      // set conversationDom to Id at this time
      conversationDom && domIdMap.set(conversationDom, idx)
      nodeList.push(lastBtn)
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
