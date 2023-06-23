import resso from "resso"

import { sendToBackground } from "@plasmohq/messaging"

import { domIdMap } from "~utils/dom"
import storage from "~utils/storage"

import type { Bookmark } from "./sidebar"

export const settingNotionApiKey = "__setting__notionApiKey"
export const settingNotionPages = "__setting__notionPages"

export interface NotionPage {
  pageId: string
  title: string
}

export const dataSyncStore = resso({
  notionApiKey: "",
  notionPages: [] as NotionPage[]
})

export const setNotionApiKey = (notionApiKey: string) => {
  dataSyncStore.notionApiKey = notionApiKey
}

export const setNotionPages = (notionPageIds: NotionPage[]) => {
  dataSyncStore.notionPages = notionPageIds
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

export const addNotionPageId = () => {
  setNotionPages([
    ...dataSyncStore.notionPages,
    { pageId: undefined, title: undefined }
  ])
}

export const removeNotionPageId = (index: number) => {
  setNotionPages(dataSyncStore.notionPages.filter((_, idx) => idx !== index))
}

export const initData = async () => {
  const notionApiKey = (await storage.get(settingNotionApiKey)) as string
  const notionPages = (await storage.get(settingNotionPages)) ?? []

  notionApiKey && setNotionApiKey(notionApiKey)
  notionPages && setNotionPages(notionPages as NotionPage[])
}

export async function syncConversation(bookmark: Bookmark) {
  const conversationDom = domIdMap.getDomById(bookmark.bookmarkId)
  const copyElem: HTMLButtonElement = conversationDom.querySelector(
    "div:nth-of-type(2) > div:first-of-type > button:first-of-type"
  )
  copyElem?.click?.()

  const markdownStr = await navigator.clipboard.readText()

  console.log("markdownStr====", markdownStr)

  const resp = await sendToBackground({
    name: "saveConversation",
    body: markdownStr
  })

  console.log("resp")

  return {
    success: true
  }
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
