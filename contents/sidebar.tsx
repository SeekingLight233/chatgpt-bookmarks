import cssText from "data-text:~/contents/styles/sidebar.css"
import type { PlasmoCSConfig } from "plasmo"
import { useCallback, useEffect, useState } from "react"
import "./styles/base.css"
import { createStyles } from "~utils/base"
import ArrowIcon from "~components/Icons/ArrowIcon"
import theme from "~utils/theme"
import { bookmarkStore, type Bookmark } from "~model/bookmark"
import BookmarkItem from "~components/BookmarkItem"
import { distanceFromRight, domIdMap, getBottomToolsDoms, isPartiallyInViewport } from "~utils/dom"
import { useMount, useThrottleFn } from "ahooks"
import storage from "~utils/storage"
import { baseUrl } from "~config"



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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState(-1)
  const { list, curSessionId, initList } = bookmarkStore;
  const curSessionlist = list.filter(bookmark => bookmark.sessionId === curSessionId)

  useMount(() => {
    initList();

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.message === 'urlChange') {
        const curSessionId = getSessionId();
        bookmarkStore.curSessionId = curSessionId;
      }
    });

    // bookmarkStore.initList()
  })

  useEffect(() => {
    document.body.classList.toggle("bookmark-sidebar-show", isOpen)
  }, [isOpen])


  const handleClickBookmark = (bookmarkId) => {
    const conversationDom = domIdMap.getDomById(bookmarkId)
    if (conversationDom) {
      conversationDom.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error(`Element with id ${bookmarkId} not found.`);
    }
  }

  const { run: runSetActiveId } = useThrottleFn(
    () => {
      const newActiveId = getActiveId(list);
      setActiveId(newActiveId)
    },
    { wait: 200 },
  );

  const scrollDom = document.querySelectorAll('div[class*="react-scroll-to-bottom"]')[1];


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

  const siderbarWidth = getSiderbarWidth() - 4

  return (
    <div id="sidebar" style={{
      left: isOpen ? -siderbarWidth : 0,
      width: siderbarWidth
    }} className={isOpen ? "open" : "closed"}>
      <div style={{ ...styles.toggleBtn, backgroundColor: isOpen ? theme.bgColor : theme.tintColor }} onClick={() => setIsOpen(!isOpen)}>
        <ArrowIcon
          direction={isOpen ? "right" : "left"}
          color={isOpen ? theme.tintColor : theme.bgColor}
        ></ArrowIcon>

      </div>
      <div style={styles.bookmarksArea}>
        <div style={styles.scrollArea}>
          {
            curSessionlist.map((bookmark, idx) =>
              <BookmarkItem
                key={idx}
                onClick={handleClickBookmark}
                onEdit={(bookmark) => {
                  bookmarkStore.onEdit(bookmark)
                }}
                active={activeId === bookmark.bookmarkId}
                onDelete={bookmarkStore.onDelete}
                {...bookmark}
              />)
          }
        </div>

      </div>
    </div>
  )
}

function getActiveId(list: Bookmark[]) {
  return list.find((bookmark) => {
    const conversationDom = domIdMap.getDomById(bookmark.bookmarkId);
    return isPartiallyInViewport(conversationDom)
  })?.bookmarkId ?? -1
}

function getSessionLink() {
  const url = window.location.href.split("#")[0];
  return url
}

export function getSessionId() {
  const link = getSessionLink();
  const sessionId = link.replace(baseUrl, "");
  return sessionId
}

function getSiderbarWidth() {
  const firstConversationDom = getBottomToolsDoms()?.[0]?.parentElement;
  const width = distanceFromRight(firstConversationDom);
  if (width < 200) return 200
  return width;
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
    paddingTop: 40,
  },
  scrollArea: {
    height: "90vh",
    width: "100%",
    paddingBottom: "20%",
    overflow: "scroll"
  }
})

export default Sidebar

