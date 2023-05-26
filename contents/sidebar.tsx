import cssText from "data-text:~/contents/styles/sidebar.css"
import type { PlasmoCSConfig } from "plasmo"
import { useCallback, useEffect, useState } from "react"

import "./styles/base.css"

import { useMemoizedFn, useMount, useThrottleFn } from "ahooks"

import BookmarkItem from "~components/BookmarkItem"
import Empty from "~components/Empty"
import ArrowIcon from "~components/Icons/ArrowIcon"
import SearchBar from "~components/SearchBar"
import TabBar, { type Tab } from "~components/TabBar"
import { baseUrl } from "~config"
import { type Bookmark, bookmarkStore } from "~model/bookmark"
import { createStyles, pipe } from "~utils/base"
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
  const [searchValue, setSearchValue] = useState("")

  const { allBookmarks, curSessionId, initList } = bookmarkStore

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

  useEffect(() => {
    setActiveIdOnUrl(activeId)
  }, [activeId])

  const { run: runSetActiveId } = useThrottleFn(
    () => {
      const newActiveId = getActiveId(allBookmarks)
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
        scrollDom.removeEventListener("scroll", () => { })
      }
    }
  }, [scrollDom])

  const filterByCurSessionId = useMemoizedFn((list: Bookmark[]) => {
    return list.filter((bookmark) => bookmark.sessionId === curSessionId)
  })

  const filterBySearchValue = useMemoizedFn((list: Bookmark[]) => {
    return list.filter((bookmark) => bookmark.title.includes(searchValue))
  })

  const renderBookmarks = () => {
    const list =
      curTab === "all" ? allBookmarks : filterByCurSessionId(allBookmarks)
    const filteredList = filterBySearchValue(list)

    if (filteredList.length === 0) return <Empty></Empty>
    return filteredList.map((bookmark, idx) => (
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

  const siderbarWidth = getSiderbarWidth() - 4

  return (
    <div
      id="sidebar"
      // onMouseLeave={() => setIsOpen(false)}
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
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}>
        <ArrowIcon
          direction={isOpen ? "right" : "left"}
          color={isOpen ? theme.tintColor : theme.bgColor}></ArrowIcon>
      </div>

      <SearchBar onSearch={setSearchValue}></SearchBar>

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
  if (width > 350) return 350
  return width
}

export const scrollIntoBookmark = (bookmarkId: number) => {
  const conversationDom = domIdMap.getDomById(bookmarkId)
  if (conversationDom) {
    conversationDom.scrollIntoView({ behavior: "smooth", block: "start" })
  } else {
    console.error(`Element with id ${bookmarkId} not found.`)
  }
}

function setActiveIdOnUrl(activeId: number) {
  const url = window.location.href.split("#")
  url[1] = activeId === -1 ? "" : activeId.toString()
  history.replaceState(null, null, url.join("#"))
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
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingTop: 26
  },
  scrollArea: {
    height: "90vh",
    width: "100%",
    paddingBottom: "20%",
    overflow: "scroll"
  }
})

export default Sidebar
