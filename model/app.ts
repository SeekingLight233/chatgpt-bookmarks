import resso from "resso"

import { domIdMap } from "~utils/dom"

import type { Bookmark } from "./sidebar"

export const appStore = resso({
  showEditBookmarkModal: false,
  curToastMsg: null,
  init: false
})

export function setShowEditBookmarkModal(isShow: boolean) {
  appStore.showEditBookmarkModal = isShow
}

export function showToast(msg: string) {
  appStore.curToastMsg = msg
}

export async function syncConversation(bookmark: Bookmark) {
  const conversationDom = domIdMap.getDomById(bookmark.bookmarkId)
  const copyElem: HTMLButtonElement = conversationDom.querySelector(
    "div:nth-of-type(2) > div:first-of-type > button:first-of-type"
  )
  copyElem?.click?.()

  const clipboardText = await navigator.clipboard.readText()
  return {
    success: true
  }
}
