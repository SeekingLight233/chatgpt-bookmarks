import resso from "resso"

import storage from "~utils/storage"

export const settingNotionApiKey = "__setting__notionApiKey"
export const settingNotionPageId = "__setting__notionPageId"

export const dataSyncStore = resso({
  notionApiKey: "",
  notionPageId: ""
})

export const setNotionApiKey = (notionApiKey: string) => {
  dataSyncStore.notionApiKey = notionApiKey
}

export const setNotionPageId = (notionPageId: string) => {
  dataSyncStore.notionPageId = notionPageId
}

export const initData = async () => {
  const notionApiKey = (await storage.get(settingNotionApiKey)) as string
  const notionPageId = (await storage.get(settingNotionPageId)) as string

  notionApiKey && setNotionApiKey(notionApiKey)
  notionPageId && setNotionPageId(notionPageId)
}
