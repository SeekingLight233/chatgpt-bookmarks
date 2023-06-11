import resso from "resso"

import { baseUrl } from "~config"
import {
  distanceFromRight,
  domIdMap,
  getBottomToolsDoms,
  isPartiallyInViewport
} from "~utils/dom"
import storage from "~utils/storage"

import { setShowEditBookmarkModal, showToast, syncConversation } from "./app"

export const sideBarStore = resso({
  allBookmarks: [] as Bookmark[],
  curTitle: "",
  curSessionId: "",
  curBookmarkId: null,
  curCreateUnix: new Date().getTime(),

  initList: () => {
    storage
      .getAll()
      .then((allBookmarkObj) => {
        const initList = Object.values(allBookmarkObj)
        initList.sort((a, b) => a.bookmarkId - b.bookmarkId)
        console.log("initList===", initList, allBookmarkObj)
        sideBarStore.allBookmarks = initList
        sideBarStore.curSessionId = getSessionId()
      })
      .catch((err) => {
        console.error("get all err", err)
      })
  },

  onEdit: (bookmark: Bookmark) => {
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

  onSave: (bookmark: Bookmark) => {
    const { sessionId, bookmarkId } = bookmark
    const oriList = [...sideBarStore.allBookmarks]
    const targetIdx = oriList.findIndex(
      (item) => item.bookmarkId === bookmarkId
    )
    if (targetIdx == -1) {
      sideBarStore.onAdd(bookmark)
    } else {
      oriList[targetIdx] = bookmark
      sideBarStore.allBookmarks = oriList
    }

    console.log("onSave", bookmark)
    syncConversation(bookmark)
    const key = sessionId + "#" + bookmarkId
    storage.set(key, bookmark).then(() => {
      showToast("save success")
    })
    setShowEditBookmarkModal(false)
  },

  onDelete: (omitBookmark: Omit<Bookmark, "title">) => {
    const { sessionId, bookmarkId } = omitBookmark
    const oriList = [...sideBarStore.allBookmarks]
    const targetIdx = oriList.findIndex(
      (item) => item.bookmarkId === bookmarkId
    )
    if (targetIdx != -1) {
      oriList.splice(targetIdx, 1)
      sideBarStore.allBookmarks = oriList
    }
    const key = sessionId + "#" + bookmarkId
    storage.remove(key).then(() => {
      showToast("delete success")
      console.log("remove success")
    })
  }
})

export interface Bookmark {
  bookmarkId: number
  title: string
  sessionId: string
  createUnix: number
}

export const findBookMarkByBookmarkId = (
  bookmarkId: number
): Bookmark | undefined => {
  const bookmark = sideBarStore.allBookmarks.find(
    (bookmark) => bookmark.bookmarkId === bookmarkId
  )
  return bookmark
}

export const setTitle = (newTitle: string) => {
  sideBarStore.curTitle = newTitle
}

export function getActiveId(list: Bookmark[]) {
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

export function getSiderbarWidth() {
  const firstConversationDom = getBottomToolsDoms()?.[0]?.parentElement
  const width = distanceFromRight(firstConversationDom)
  if (width < 280) return 280
  if (width > 350) return 350
  return width
}

export const scrollIntoBookmark = (bookmarkId: number) => {
  setActiveIdOnUrl(bookmarkId)
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
  const rootParent = (dom.getRootNode() as ShadowRoot).host
    .parentElement as ElementWithbookmarkId
  return rootParent?.bookmarkId
}
