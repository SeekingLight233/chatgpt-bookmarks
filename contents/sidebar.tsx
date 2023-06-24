import cssText from "data-text:~/contents/styles/sidebar.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import "./styles/base.css"

import { useMemoizedFn, useMount, useThrottleFn } from "ahooks"

import BookmarkItem from "~components/BookmarkItem"
import Empty from "~components/Empty"
import ArrowIcon from "~components/Icons/ArrowIcon"
import SearchBar from "~components/SearchBar"
import TabBar, { type Tab } from "~components/TabBar"
import { baseUrl } from "~config"
import {
  type Bookmark,
  getActiveId,
  getSessionId,
  getSiderbarWidth,
  groupByDate,
  scrollIntoBookmark,
  sideBarStore
} from "~model/sidebar"
import { createStyles } from "~utils/base"
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

  const { allBookmarks, curSessionId, initBookmarks } = sideBarStore

  useMount(() => {
    initBookmarks()
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.message === "urlChange") {
        const curSessionId = getSessionId()
        sideBarStore.curSessionId = curSessionId
      }
    })
  })

  useEffect(() => {
    document.body.classList.toggle("bookmark-sidebar-show", isOpen)
  }, [isOpen])

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
        scrollDom.removeEventListener("scroll", () => {})
      }
    }
  }, [scrollDom])

  const filterByCurSessionId = useMemoizedFn((list: Bookmark[]) => {
    return list.filter((bookmark) => bookmark.sessionId === curSessionId)
  })

  const filterBySearchValue = useMemoizedFn((list: Bookmark[]) => {
    return list.filter((bookmark) => bookmark.title.includes(searchValue))
  })

  const renderAllBookmarks = (list: Bookmark[]) => {
    const groupedBookmarks = groupByDate(list)
    return groupedBookmarks.map(({ label, data }, idx) => {
      if (data.length === 0) return null
      return (
        <div key={idx}>
          <div style={styles.dateLabel}>{label}</div>
          {data.map((bookmark, idx) => (
            <BookmarkItem
              key={idx}
              onClick={handleClickBookmark}
              onEdit={(bookmark) => {
                sideBarStore.onEdit(bookmark)
              }}
              active={activeId === bookmark.bookmarkId}
              onDelete={sideBarStore.onDelete}
              {...bookmark}
            />
          ))}
        </div>
      )
    })
  }

  const handleClickBookmark = useMemoizedFn((bookmark: Bookmark) => {
    const { sessionId, bookmarkId } = bookmark
    const curSessionId = getSessionId()
    if (sessionId === curSessionId) {
      scrollIntoBookmark(bookmarkId)
    } else {
      const newLink = `${baseUrl}${sessionId}#${bookmarkId}`
      window.open(newLink, "_self")
    }
  })

  const renderCurrentBookmarks = (list: Bookmark[]) => {
    const currentBookmark = filterByCurSessionId(list)
    if (currentBookmark.length === 0) return <Empty></Empty>
    return currentBookmark.map((bookmark, idx) => (
      <BookmarkItem
        key={idx}
        onClick={handleClickBookmark}
        onEdit={(bookmark) => {
          sideBarStore.onEdit(bookmark)
        }}
        active={activeId === bookmark.bookmarkId}
        onDelete={sideBarStore.onDelete}
        {...bookmark}
      />
    ))
  }

  const renderBookmarks = () => {
    const filterValuedList = filterBySearchValue(allBookmarks)
    if (filterValuedList.length === 0) return <Empty></Empty>
    return curTab === "current"
      ? renderCurrentBookmarks(filterValuedList)
      : renderAllBookmarks(filterValuedList)
  }

  const siderbarWidth = getSiderbarWidth() - 4

  return (
    <div
      id="sidebar"
      onMouseLeave={() => setIsOpen(false)}
      style={{
        left: isOpen ? -siderbarWidth : 0,
        width: siderbarWidth,
        backgroundColor: theme.tintColor
      }}
      className={isOpen ? "open" : "closed"}>
      {!isOpen && (
        <div
          style={{
            ...styles.toggleBtn,
            backgroundColor: isOpen ? theme.bgColor : theme.tintColor
          }}
          // onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}>
          <ArrowIcon
            direction={isOpen ? "right" : "left"}
            color={isOpen ? theme.tintColor : theme.bgColor}></ArrowIcon>
        </div>
      )}

      <SearchBar onSearch={setSearchValue}></SearchBar>

      <TabBar tabs={tabs} activeId={curTab} onChange={setCurTab}></TabBar>

      <div style={styles.bookmarksArea}>
        <div style={styles.scrollArea}>{renderBookmarks()}</div>
      </div>
    </div>
  )
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
    paddingTop: 10
  },
  scrollArea: {
    height: "90vh",
    width: "100%",
    paddingBottom: "20%",
    overflow: "scroll"
  },
  dateLabel: {
    fontSize: 12,
    color: theme.groupLabelColor,
    height: 30,
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    marginBottom: -4
  }
})

export default Sidebar
