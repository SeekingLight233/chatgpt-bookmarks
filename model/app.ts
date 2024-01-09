import resso from "resso"
import { isDarkMode } from "~utils/theme"

export const appStore = resso({
  showEditBookmarkModal: false,
  curToastMsg: null,
  init: false,
  curBookmarkIds: [],
})

export function setShowEditBookmarkModal(isShow: boolean) {
  appStore.showEditBookmarkModal = isShow
}

export function showToast(msg: string) {
  appStore.curToastMsg = msg
}
