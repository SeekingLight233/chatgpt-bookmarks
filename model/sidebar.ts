import resso from "resso"

import { baseUrl } from "~config"
import { filterObjBySubStrKey } from "~utils/base"
import {
  distanceFromRight,
  isPartiallyInViewport
} from "~utils/dom"
import { domWithBookmarkidMap } from "~utils/dom/domIdMap"
import storage from "~utils/storage"
import { setShowEditBookmarkModal, showToast } from "./app"
import { type NotionConfig, syncConversation } from "./dataSync"
import $ from "~utils/dom/selector"

const bookmarkKey = "__bookmark__"

export const sideBarStore = resso({
  allBookmarks: [] as Bookmark[],
  curTitle: null,
  curSessionId: "",
  curBookmarkId: null,
  curCreateUnix: new Date().getTime(),

  initBookmarks: () => {
    storage
      .getAll()
      .then((allData) => {
        const bookmarkObj = filterObjBySubStrKey(allData, bookmarkKey)
        const initList = Object.values(bookmarkObj) as Bookmark[]
        initList.sort((a, b) => a.bookmarkId - b.bookmarkId)
        console.log("init bookmark===", initList, allData)
        sideBarStore.allBookmarks = initList
        sideBarStore.curSessionId = getSessionId()
      })
      .catch((err) => {
        console.error("get all err", err)
      })
  },

  onEdit: (bookmark: Bookmark) => {
    sideBarStore.clearCurBookmark()
    const { bookmarkId, sessionId, title, createUnix: createTime } = bookmark
    setShowEditBookmarkModal(true)
    sideBarStore.curBookmarkId = bookmarkId
    sideBarStore.curSessionId = sessionId
    sideBarStore.curTitle = title
    sideBarStore.curCreateUnix = createTime
  },

  onAdd: (bookmark: Bookmark) => {
    // we need insert it to right position
    const { bookmarkId } = bookmark
    const oriList = [...sideBarStore.allBookmarks]

    let index = oriList.findIndex((item) => item.bookmarkId > bookmarkId)
    if (index === -1) {
      // If no bookmarkId is greater, append to the end
      index = oriList.length
    }
    oriList.splice(index, 0, bookmark)

    sideBarStore.allBookmarks = oriList
  },

  onSave: async (bookmark: Bookmark, notionConfig?: NotionConfig) => {
    const { sessionId, bookmarkId, fromNotionBlock } = bookmark
    const oriList = [...sideBarStore.allBookmarks]
    const targetIdx = oriList.findIndex(
      (item) => item.bookmarkId === bookmarkId && item.sessionId === sessionId
    )
    if (targetIdx === -1) {
      sideBarStore.onAdd(bookmark)
    } else {
      oriList[targetIdx] = bookmark
      sideBarStore.allBookmarks = oriList
    }
    const key = bookmarkKey + sessionId + "#" + bookmarkId
    storage.set(key, bookmark).then(() => {
      if (fromNotionBlock == null) showToast("save success")
    })
    setShowEditBookmarkModal(false)

    const shouldSyncData = notionConfig?.pageId != null && targetIdx === -1

    if (shouldSyncData) {
      const { notionApiKey, pageId } = notionConfig
      const syncRes = await syncConversation(bookmark, notionApiKey, pageId)
      if (syncRes.success) {
        showToast("sync success")
      } else {
        showToast("sync fail: " + syncRes.message)
      }
    }
  },

  onDelete: (omitBookmark: Omit<Bookmark, "title">) => {
    const { sessionId, bookmarkId } = omitBookmark
    const oriList = [...sideBarStore.allBookmarks]
    const targetIdx = oriList.findIndex(
      (item) => item.bookmarkId === bookmarkId && item.sessionId === sessionId
    )
    if (targetIdx != -1) {
      oriList.splice(targetIdx, 1)
      sideBarStore.allBookmarks = oriList
    }
    const key = bookmarkKey + sessionId + "#" + bookmarkId
    storage.remove(key).then(() => {
      showToast("delete success")
      console.log("remove success")
    })
  },

  clearCurBookmark: () => {
    sideBarStore.curBookmarkId = null
    sideBarStore.curTitle = null
    sideBarStore.curCreateUnix = new Date().getTime()
  }
})

export interface Bookmark {
  bookmarkId: number
  title: string
  sessionId: string
  createUnix: number,
  fromNotionBlock?: boolean
}

export const findBookmarkByBookmarkId = (
  bookmarkId: number
): Bookmark | undefined => {
  const curSessionId = getSessionId()
  const bookmark = sideBarStore.allBookmarks.find(
    (bookmark) =>
      bookmark.bookmarkId === bookmarkId && curSessionId === bookmark.sessionId
  )
  return bookmark
}

export const setTitle = (newTitle: string) => {
  sideBarStore.curTitle = newTitle
}

export function getActiveId(list: Bookmark[]) {
  return (
    list.find((bookmark) => {
      const conversationDom = domWithBookmarkidMap.getDomById(bookmark.bookmarkId)
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

export function getSiderbarWidth() {
  const firstConversationDom = $.getBottomToolsDoms()?.[0]?.parentElement
  const width = distanceFromRight(firstConversationDom)
  if (width < 280) return 280
  if (width > 350) return 350
  return width
}

export const scrollIntoBookmark = (bookmarkId: number) => {
  setActiveIdOnUrl(bookmarkId)
  const conversationDom = domWithBookmarkidMap.getDomById(bookmarkId)
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

type GroupedBookmarks = { label: string; data: Bookmark[] }[]

export function groupByDate(
  bookmarks: Bookmark[],
  now = new Date()
): GroupedBookmarks {
  const oneDay = 24 * 60 * 60 * 1000 // milliseconds in a day
  const sevenDays = 7 * oneDay
  const thirtyDays = 30 * oneDay

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime()
  const yesterday = today - oneDay
  const previous7Days = today - sevenDays
  const previous30Days = today - thirtyDays

  let grouped: GroupedBookmarks = [
    { label: "Today", data: [] },
    { label: "Yesterday", data: [] },
    { label: "Previous 7 Days", data: [] },
    { label: "Previous 30 Days", data: [] }
  ]

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  for (let bookmark of bookmarks) {
    if (bookmark.createUnix >= today) {
      grouped[0].data.push(bookmark)
    } else if (bookmark.createUnix >= yesterday) {
      grouped[1].data.push(bookmark)
    } else if (bookmark.createUnix >= previous7Days) {
      grouped[2].data.push(bookmark)
    } else if (bookmark.createUnix >= previous30Days) {
      grouped[3].data.push(bookmark)
    } else {
      // Group by month for older bookmarks
      const date = new Date(bookmark.createUnix)
      const yearMonth = `${date.getFullYear()}-${monthNames[date.getMonth()]}` // month is 0-indexed

      let monthGroup = grouped.find((group) => group.label === yearMonth)
      if (!monthGroup) {
        monthGroup = { label: yearMonth, data: [] }
        grouped.push(monthGroup)
      }

      monthGroup.data.push(bookmark)
    }
  }

  return grouped
}

export type ElementWithbookmarkId = Element & { bookmarkId?: number }
export const getbookmarkIdByDom = (dom: ElementWithbookmarkId) => {
  if (dom == null) return -1
  const rootParent = (dom.getRootNode() as ShadowRoot).host
    .parentElement as ElementWithbookmarkId
  return rootParent?.bookmarkId
}

export const getBookmarkLink = (sessionId: string, bookmarkId: number) =>
  `${baseUrl}${sessionId}#${bookmarkId}`

export function importBookmarks(bookmarks: Bookmark[]) {
  try {
    for (const bookmark of bookmarks) {
      sideBarStore.onSave(bookmark)
    }
    return { success: true }
  } catch (error) {
    return { success: false, msg: error }
  }
}