
import resso from 'resso';
import Bookmark from '~contents/bookmark';
import { setShowEditBookmarkModal } from './app';
import storage from '~utils/storage';
import { filterKeysByString } from '~utils/base';

export interface Bookmark {
  bookmarkId: number,
  title: string,
  sessionLink: string
}

export const bookmarkStore = resso({
  list: [
    // {
    //   bookmarkId: 11,
    //   sessionLink: "https://chat.openai.com/c/41be8183-ecd0-4b09-9606-9f70c871d918",
    //   title: "计算书签的大小"
    // },
    // {
    //   bookmarkId: 29,
    //   sessionLink: "https://chat.openai.com/c/41be8183-ecd0-4b09-9606-9f70c871d918",
    //   title: "关于chrome 存储api的基本使用"
    // },
  ] as Bookmark[],
  curTitle: "",
  curSessionLink: "",
  curBookmarkId: null,

  initList: () => {
    storage.getAll().then((allBookmarkObj) => {
      const sessionLink = getSessionLink();
      const filteredBookmarkObj = filterKeysByString<Bookmark>(allBookmarkObj, sessionLink);
      const newList = Object.values(filteredBookmarkObj);
      console.log("newList===", newList)
      bookmarkStore.list = newList;
    }).catch((err) => {
      console.error("get all err", err)
    })
  },

  onEdit: (bookmarkId: number) => {
    setShowEditBookmarkModal(true);
    bookmarkStore.curBookmarkId = bookmarkId;
    const sessionLink = getSessionLink();
    bookmarkStore.curSessionLink = sessionLink
  },
  onSave: (bookmark: Bookmark) => {
    const { sessionLink, bookmarkId } = bookmark
    console.log("onSave", bookmark)
    bookmarkStore.list.push(bookmark);
    const key = sessionLink + "#" + bookmarkId;
    storage.set(key, bookmark).then(() => {
      console.log("save success")
    })
  }
});

export const setTitle = (newTitle: string) => {
  bookmarkStore.curTitle = newTitle;
}


function getSessionLink() {
  const url = window.location.href.split("#")[0];
  return url
}