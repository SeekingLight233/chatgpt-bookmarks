import resso from "resso"

import { sendToBackground } from "@plasmohq/messaging"

import type { SaveConversationBody } from "~background/messages/saveConversation"
import storage from "~utils/storage"
import { domIdMap } from "~utils/dom/domIdMap"

import { type Bookmark, getSessionId } from "./sidebar"
import type { BlockObjectResponse, ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints"
import { baseUrl } from "~config"

export const settingNotionApiKey = "__setting__notionApiKey"
export const settingNotionPages = "__setting__notionPages"

export interface NotionPage {
  pageId: string
  title: string
  bindedSessionIds: string[]
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
  console.log("setNotionPages===", notionPageIds)

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

export const bindPageIdBySessionId = (pageId: string) => {
  const curSessionId = getSessionId()
  const newNotionPages = [...dataSyncStore.notionPages]
  const bindedPageIdx = newNotionPages.findIndex((notionPage) =>
    notionPage.bindedSessionIds.includes(curSessionId)
  )
  if (bindedPageIdx !== -1) {
    // curSessionId already binded a notion page, we need to unbind it before bind to new page
    const needRemoveSessionIdPage = newNotionPages[bindedPageIdx]
    needRemoveSessionIdPage.bindedSessionIds =
      needRemoveSessionIdPage.bindedSessionIds.filter(
        (sessionId) => sessionId !== curSessionId
      )
  }
  const targetNotionPage = newNotionPages.find(
    (notionPage) => notionPage.pageId === pageId
  )
  targetNotionPage && targetNotionPage.bindedSessionIds.push(curSessionId)
  setNotionPages(newNotionPages, true)
}

export const getPageIdbySessionId = (sessionId: string) => {
  const notionPages = dataSyncStore.notionPages
  const index = dataSyncStore.notionPages.findIndex((notionPage) =>
    notionPage.bindedSessionIds.includes(sessionId)
  )
  if (index !== -1) {
    return notionPages[index].pageId
  }
  return null
}

export const addNotionPageId = () => {
  setNotionPages([
    ...dataSyncStore.notionPages,
    { pageId: undefined, title: undefined, bindedSessionIds: [] }
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
  const copyElem = $.getCopyElem(conversationDom)
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
  notionApiKey: string
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

export async function fetchPageBlocks(pageId: string, notionApiKey: string) {
  const resp = await sendToBackground({
    name: "fetchPageBlocks",
    body: {
      pageId,
      notionApiKey
    }
  })
  console.log("fetchPageBlocks resp", resp)
  return resp
}

export function getBookmarksByBlocks(rowBlocks: ListBlockChildrenResponse["results"]): Bookmark[] {
  const targetBlocks = rowBlocks.filter((b) => {
    const href = b?.paragraph?.rich_text?.[1]?.href as string
    return href?.includes(baseUrl);
  })
  const newBookmarks = targetBlocks.map(block2Bookmark);
  return newBookmarks
}

function block2Bookmark(block: BlockObjectResponse): Bookmark {
  const linkText = block.paragraph?.rich_text?.[1]?.text
  const { content, link } = linkText ?? {};
  const [sessionId, bookmarkId] = link?.url?.replace("https://chat.openai.com/c/", "")?.split("#");
  const createUnix = new Date(block.created_time).getTime();
  return {
    createUnix,
    title: content,
    sessionId,
    bookmarkId: +bookmarkId,
    fromNotionBlock: true
  }
}