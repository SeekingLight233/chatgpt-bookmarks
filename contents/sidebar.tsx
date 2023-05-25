import cssText from "data-text:~/contents/styles/sidebar.css"
import type { PlasmoCSConfig } from "plasmo"
import { useCallback, useEffect, useState } from "react"

import "./styles/base.css"

import { useMount, useThrottleFn } from "ahooks"

import BookmarkItem from "~components/BookmarkItem"
import Empty from "~components/Empty"
import ArrowIcon from "~components/Icons/ArrowIcon"
import TabBar, { type Tab } from "~components/TabBar"
import { baseUrl } from "~config"
import { type Bookmark, bookmarkStore } from "~model/bookmark"
import { createStyles } from "~utils/base"
import {
  distanceFromRight,
  domIdMap,
  getBottomToolsDoms,
  isPartiallyInViewport
} from "~utils/dom"
import storage from "~utils/storage"
import theme from "~utils/theme"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "bookmark-sidebar"

const tabs: Tab[] = [
  { id: "current", title: "Current" },
  { id: "all", title: "All" }
]

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState(-1)
  const [curTab, setCurTab] = useState(tabs[0].id)

  const { list, curSessionId, initList } = bookmarkStore

  useMount(() => {
    initList()

    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.message === "urlChange") {
        const curSessionId = getSessionId()
        bookmarkStore.curSessionId = curSessionId
      }
    })

    // bookmarkStore.initList()
  })

  useEffect(() => {
    document.body.classList.toggle("bookmark-sidebar-show", isOpen)
  }, [isOpen])

  const { run: runSetActiveId } = useThrottleFn(
    () => {
      const newActiveId = getActiveId(list)
      setActiveId(newActiveId)
    },
    { wait: 200 }
  )

  const scrollDom = document.querySelectorAll(
    'div[class*="react-scroll-to-bottom"]'
  )[1]

  useEffect(() => {
    if (scrollDom) {
      scrollDom.addEventListener("scroll", () => {
        runSetActiveId()
      })
    }

    return () => {
      if (scrollDom) {
        scrollDom.removeEventListener("scroll", () => {})
      }
    }
  }, [scrollDom])

  const siderbarWidth = getSiderbarWidth() - 4

  const renderBookmarks = () => {
    const renderList =
      curTab === "all"
        ? list
        : list.filter((bookmark) => bookmark.sessionId === curSessionId)
    if (renderList.length === 0) return <Empty></Empty>
    return renderList.map((bookmark, idx) => (
      <BookmarkItem
        key={idx}
        onClick={scrollIntoBookmark}
        onEdit={(bookmark) => {
          bookmarkStore.onEdit(bookmark)
        }}
        active={activeId === bookmark.bookmarkId}
        onDelete={bookmarkStore.onDelete}
        {...bookmark}
      />
    ))
  }

  return (
    <div
      id="sidebar"
      style={{
        left: isOpen ? -siderbarWidth : 0,
        width: siderbarWidth,
        backgroundColor: theme.tintColor
      }}
      className={isOpen ? "open" : "closed"}>
      <div
        style={{
          ...styles.toggleBtn,
          backgroundColor: isOpen ? theme.bgColor : theme.tintColor
        }}
        onClick={() => setIsOpen(!isOpen)}>
        <ArrowIcon
          direction={isOpen ? "right" : "left"}
          color={isOpen ? theme.tintColor : theme.bgColor}></ArrowIcon>
      </div>

      <TabBar tabs={tabs} activeId={curTab} onChange={setCurTab}></TabBar>

      <div style={styles.bookmarksArea}>
        <div style={styles.scrollArea}>{renderBookmarks()}</div>
      </div>
    </div>
  )
}

function getActiveId(list: Bookmark[]) {
  return (
    list.find((bookmark) => {
      const conversationDom = domIdMap.getDomById(bookmark.bookmarkId)
      return isPartiallyInViewport(conversationDom)
    })?.bookmarkId ?? -1
  )
}

function getSessionLink() {
  const url = window.location.href.split("#")?.[0]
  return url
}

export function getBookmarkFromLink() {
  const url = window.location.href.split("#")?.[1]
  return url
}

export function getSessionId() {
  const link = getSessionLink()
  const sessionId = link.replace(baseUrl, "")
  return sessionId
}

function getSiderbarWidth() {
  const firstConversationDom = getBottomToolsDoms()?.[0]?.parentElement
  const width = distanceFromRight(firstConversationDom)
  if (width < 280) return 280
  return width
}

export const scrollIntoBookmark = (bookmarkId: number) => {
  const conversationDom = domIdMap.getDomById(bookmarkId)
  if (conversationDom) {
    console.log("targetdom", conversationDom)
    conversationDom.scrollIntoView({ behavior: "smooth", block: "start" })
  } else {
    console.error(`Element with id ${bookmarkId} not found.`)
  }
}

const styles = createStyles({
  toggleBtn: {
    position: "fixed",
    right: 0,
    top: "calc(50vw - var(50px))",
    width: 20,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  bookmarksArea: {
    width: "100%",
    // height: 600,
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingTop: 40
  },
  scrollArea: {
    height: "90vh",
    width: "100%",
    paddingBottom: "20%",
    overflow: "scroll"
  }
})

export default Sidebar
