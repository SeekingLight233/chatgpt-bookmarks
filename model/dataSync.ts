import resso from "resso"

import { sendToBackground } from "@plasmohq/messaging"

import type { SaveConversationBody } from "~background/messages/saveConversation"
import { domIdMap } from "~utils/dom"
import storage from "~utils/storage"

import { type Bookmark, getSessionId } from "./sidebar"

export const settingNotionApiKey = "__setting__notionApiKey"
export const settingNotionPages = "__setting__notionPages"

export interface NotionPage {
  pageId: string
  title: string
  sessionId?: string
}

export interface NotionConfig {
  notionApiKey: string
  pageId: string
}

export const dataSyncStore = resso({
  notionApiKey: "",
  notionPages: [] as NotionPage[]
})

export const initSetting = async () => {
  const notionApiKey = (await storage.get(settingNotionApiKey)) as string
  const notionPages = (await storage.get(settingNotionPages)) ?? []

  notionApiKey && setNotionApiKey(notionApiKey)
  notionPages && setNotionPages(notionPages as NotionPage[])
}

export const setNotionApiKey = (notionApiKey: string) => {
  dataSyncStore.notionApiKey = notionApiKey
}

export const setNotionPages = (
  notionPageIds: NotionPage[],
  persist = false
) => {
  dataSyncStore.notionPages = notionPageIds
  persist && storage.set(settingNotionPages, notionPageIds)
}

export const setNotionPageId = (pageId: string, index: number) => {
  const newNotionPages = [...dataSyncStore.notionPages]
  newNotionPages[index].pageId = pageId
  setNotionPages(newNotionPages)
}

export const setNotionPageTitle = (title: string, index: number) => {
  const newNotionPages = [...dataSyncStore.notionPages]
  newNotionPages[index].title = title
  setNotionPages(newNotionPages)
}

export const setSessionIdByPageId = (pageId: string) => {
  const curSessionId = getSessionId()
  const newNotionPages = [...dataSyncStore.notionPages]
  const index = newNotionPages.findIndex(
    (notionPage) => notionPage.pageId === pageId
  )
  if (index !== -1) {
    newNotionPages[index].sessionId = curSessionId
    setNotionPages(newNotionPages, true)
  }
}

export const getPageIdbySessionId = (sessionId: string) => {
  const notionPages = dataSyncStore.notionPages
  const index = dataSyncStore.notionPages.findIndex(
    (notionPage) => notionPage.sessionId === sessionId
  )
  if (index !== -1) {
    return notionPages[index].pageId
  }
  return null
}

export const addNotionPageId = () => {
  setNotionPages([
    ...dataSyncStore.notionPages,
    { pageId: undefined, title: undefined }
  ])
}

export const removeNotionPageId = (index: number) => {
  setNotionPages(dataSyncStore.notionPages.filter((_, idx) => idx !== index))
}

export async function syncConversation(
  bookmark: Bookmark,
  notionApiKey: string,
  pageId: string
) {
  const conversationDom = domIdMap.getDomById(bookmark.bookmarkId)
  const copyElem: HTMLButtonElement = conversationDom.querySelector(
    "div:nth-of-type(2) > div:first-of-type > button:first-of-type"
  )
  copyElem?.click?.()

  const markdownStr = await navigator.clipboard.readText()

  const resp = await sendToBackground<SaveConversationBody>({
    name: "saveConversation",
    body: {
      bookmark,
      markdownStr,
      notionApiKey,
      pageId
    }
  })

  return resp
}

export async function bingNotionPage(
  pageId: string,
  notionApiKey
): Promise<{ success: boolean; message?: string; title?: string }> {
  const resp = await sendToBackground({
    name: "bingNotionPage",
    body: {
      pageId,
      notionApiKey
    }
  })
  console.log("bingNotionPage resp", resp)

  return resp
}
