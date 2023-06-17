import { Client } from "@notionhq/client"

const notion = new Client({
  auth: "secret_YtazNPeqaupXQ3IaIK7q7X64AFhKLob6X0rehxzn1iq"
})

function init() {
  initListener()
}

init()

function initListener() {
  return chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: "urlChange",
        url: changeInfo.url
      })
    }
  })
}

export async function insertBlocks(children) {
  const blockId = "ef8744993996484d94dc3a33788bdc65"
  const response = await notion.blocks.children.append({
    block_id: blockId,
    children
  })
  console.log(response)
}

export {}
