
import resso from 'resso';
import Bookmark from '~contents/bookmark';
import { setShowEditBookmarkModal } from './app';
import storage from '~utils/storage';
import { filterKeysByString } from '~utils/base';
import { baseUrl } from '~config';
import { getSessionId } from '~contents/sidebar';

export interface Bookmark {
  bookmarkId: number,
  title: string,
  sessionId: string
}

export const bookmarkStore = resso({
  list: [] as Bookmark[],
  curTitle: "",
  curSessionId: "",
  curBookmarkId: null,

  initList: () => {
    storage.getAll().then((allBookmarkObj) => {
      const initList = Object.values(allBookmarkObj)
      initList.sort((a, b) => a.bookmarkId - b.bookmarkId)
      console.log("initList===", initList, allBookmarkObj)
      bookmarkStore.list = initList;
      bookmarkStore.curSessionId = getSessionId();
    }).catch((err) => {
      console.error("get all err", err)
    })
  },

  onEdit: (bookmark: Bookmark) => {
    const { bookmarkId, sessionId, title } = bookmark;
    setShowEditBookmarkModal(true);
    bookmarkStore.curBookmarkId = bookmarkId;
    bookmarkStore.curSessionId = sessionId
    bookmarkStore.curTitle = title;
  },

  onAdd: (bookmark: Bookmark) => {
    // we need insert it to right position
    const { bookmarkId, sessionId, title } = bookmark;
    const oriList = [...bookmarkStore.list];

    let index = oriList.findIndex(item => item.bookmarkId > bookmarkId);
    if (index === -1) { // If no bookmarkId is greater, append to the end
      index = oriList.length;
    }
    oriList.splice(index, 0, bookmark);

    bookmarkStore.list = oriList;
  },

  onSave: (bookmark: Bookmark) => {
    const { sessionId, bookmarkId } = bookmark
    const oriList = [...bookmarkStore.list];
    const targetIdx = oriList.findIndex((item) => item.bookmarkId === bookmarkId);
    if (targetIdx == -1) {
      bookmarkStore.onAdd(bookmark)
    } else {
      oriList[targetIdx] = bookmark;
      bookmarkStore.list = oriList;
    }

    console.log("onSave", bookmark)
    const key = sessionId + "#" + bookmarkId;
    storage.set(key, bookmark).then(() => {
      console.log("save success")
    });
    setShowEditBookmarkModal(false);
  },

  onDelete: (omitBookmark: Omit<Bookmark, "title">) => {
    const { sessionId, bookmarkId } = omitBookmark;
    const oriList = [...bookmarkStore.list];
    const targetIdx = oriList.findIndex((item) => item.bookmarkId === bookmarkId);
    if (targetIdx != -1) {
      oriList.splice(targetIdx, 1);
      bookmarkStore.list = oriList;
    }
    const key = sessionId + "#" + bookmarkId;
    storage.remove(key).then(() => {
      console.log("remove success")
    });
  },

  findBookMarkByBookmarkId: (bookmarkId: number): (Bookmark | undefined) => {
    const bookmark = bookmarkStore.list.find((bookmark) => bookmark.bookmarkId === bookmarkId);
    return bookmark;
  }
});

export const setTitle = (newTitle: string) => {
  bookmarkStore.curTitle = newTitle;
}



