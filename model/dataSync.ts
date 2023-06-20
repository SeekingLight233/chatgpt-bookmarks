import resso from "resso"

import storage from "~utils/storage"

export const settingNotionApiKey = "__setting__notionApiKey"
export const settingNotionPageIds = "__setting__notionPageIds"

export interface NotionPage {
  id: string,
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

export const initData = async () => {
  const notionApiKey = (await storage.get(settingNotionApiKey)) as string
  const notionPages = (await storage.get(settingNotionPageIds)) ?? [];

  notionApiKey && setNotionApiKey(notionApiKey)
  notionPages && setNotionPages(notionPages as NotionPage[])
}
