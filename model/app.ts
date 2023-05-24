import resso from "resso"

export const appStore = resso({
  showEditBookmarkModal: false,
  curToastMsg: null,
  init: false
})

export function setShowEditBookmarkModal(isShow: boolean) {
  appStore.showEditBookmarkModal = isShow
}

export function showToast(msg: string) {
  appStore.curToastMsg = msg
}
