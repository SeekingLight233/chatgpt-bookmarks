
import resso from 'resso';
import Bookmark from '~contents/bookmark';
import { setShowEditBookmarkModal } from './app';

export interface Bookmark {
  bookmarkId: number,
  title: string,
  sessionLink: string
}

export const bookmarkStore = resso({
  list: [
    {
      bookmarkId: 11,
      sessionLink: "https://chat.openai.com/c/41be8183-ecd0-4b09-9606-9f70c871d918",
      title: "计算书签的大小"
    },
    {
      bookmarkId: 29,
      sessionLink: "https://chat.openai.com/c/41be8183-ecd0-4b09-9606-9f70c871d918",
      title: "关于chrome 存储api的基本使用"
    },
  ] as Bookmark[],
  curTitle: "",
  curSessionLink: "",
  curBookmarkId: null,
  onEdit: (bookmarkId: number) => {
    setShowEditBookmarkModal(true);
    bookmarkStore.curBookmarkId = bookmarkId;
    const sessionLink = getSessionLink();
    bookmarkStore.curSessionLink = sessionLink
  },
  onSave: (bookmark: Bookmark) => {
    console.log("onSave", bookmark)
    bookmarkStore.list.push(bookmark);
  }
});

export const setTitle = (newTitle: string) => {
  bookmarkStore.curTitle = newTitle;
}


function getSessionLink() {
  const url = window.location.href;
  return url
}