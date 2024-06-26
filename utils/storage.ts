import type { NotionPage } from "~model/dataSync"
import type { Bookmark } from "~model/sidebar"
import { isDevMode } from "./devUtils"

type StorageValue = Bookmark | NotionPage[] | string
class Storage {
  private storage: chrome.storage.StorageArea

  constructor() {
    this.storage = isDevMode ? chrome.storage.local : chrome.storage.sync
  }

  get(key: string): Promise<StorageValue> {
    return new Promise((resolve, reject) => {
      this.storage.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result[key])
        }
      })
    })
  }

  getAll(): Promise<Record<string, StorageValue>> {
    return new Promise((resolve, reject) => {
      this.storage.get(null, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result)
        }
      })
    })
  }

  set(key: string, value: StorageValue): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }

  remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }

  clear(): Promise<void> {
    console.log("clear all data!")

    return new Promise((resolve, reject) => {
      this.storage.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }
}

const storage = new Storage()
export default storage
