import { Client } from "@notionhq/client"

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

export {}
