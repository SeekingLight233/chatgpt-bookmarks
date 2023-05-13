
import resso from 'resso';
import Bookmark from '~contents/bookmark';
import { setShowEditBookmarkModal } from './app';
import storage from '~utils/storage';
import { filterKeysByString } from '~utils/base';
import { baseUrl } from '~config';

export interface Bookmark {
  bookmarkId: number,
  title: string,
  sessionId: string
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
  curSessionId: "",
  curBookmarkId: null,

  initList: () => {
    storage.getAll().then((allBookmarkObj) => {
      const sessionId = getSessionId();
      const filteredBookmarkObj = filterKeysByString<Bookmark>(allBookmarkObj, sessionId);
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
    const sessionId = getSessionId();
    bookmarkStore.curSessionId = sessionId
  },
  onSave: (bookmark: Bookmark) => {
    const { sessionId, bookmarkId } = bookmark
    console.log("onSave", bookmark)
    bookmarkStore.list.push(bookmark);
    const key = sessionId + "#" + bookmarkId;
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

function getSessionId() {
  const link = getSessionLink();
  const sessionId = link.replace(baseUrl, "");
  return sessionId
}