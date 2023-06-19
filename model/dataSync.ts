import resso from "resso"

import storage from "~utils/storage"

export const settingNotionApiKey = "__setting__notionApiKey"
export const settingNotionPageIds = "__setting__notionPageIds" 

export const dataSyncStore = resso({
  notionApiKey: "",
  notionPageIds: [""] 
})

export const setNotionApiKey = (notionApiKey: string) => {
  dataSyncStore.notionApiKey = notionApiKey
}

export const setNotionPageIds = (notionPageIds: string[]) => { 
  dataSyncStore.notionPageIds = notionPageIds 
}

export const initData = async () => {
  const notionApiKey = (await storage.get(settingNotionApiKey)) as string
  const notionPageIds = (await storage.get(settingNotionPageIds)) ?? [""]

  notionApiKey && setNotionApiKey(notionApiKey)
  notionPageIds && setNotionPageIds(notionPageIds)
}
