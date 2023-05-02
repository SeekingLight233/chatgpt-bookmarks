import resso from 'resso';

export const appStore = resso({
  showEditBookmarkModal: false
});

export function setShowEditBookmarkModal(isShow: boolean) {
  appStore.showEditBookmarkModal = isShow;
}