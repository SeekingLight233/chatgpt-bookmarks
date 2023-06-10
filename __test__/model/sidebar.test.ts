import { appStore } from "~model/app"
import { type Bookmark, groupByDate, sideBarStore } from "~model/sidebar"

import { mockBookmarks, mockCurSessionId } from "./mockData"

describe("bookmark model functions tests", () => {
  beforeEach(() => {
    sideBarStore.allBookmarks = mockBookmarks
    sideBarStore.curSessionId = mockCurSessionId
  })
  afterEach(() => {
    sideBarStore.allBookmarks = []
  })

  it("should init correctly", () => {
    expect(sideBarStore.allBookmarks.length).toBe(10)
    expect(sideBarStore.curSessionId).toBe(mockCurSessionId)
  })

  it("should edit a bookmark and open modal", () => {
    const bookmark = sideBarStore.allBookmarks[0]
    sideBarStore.onEdit(bookmark)
    expect(appStore.showEditBookmarkModal).toBeTruthy()
    expect(sideBarStore.curBookmarkId).toBe(bookmark.bookmarkId)
    expect(sideBarStore.curSessionId).toBe(bookmark.sessionId)
    expect(sideBarStore.curTitle).toBe(bookmark.title)
    expect(sideBarStore.curCreateUnix).toBe(bookmark.createUnix)
  })

  it("should add a new bookmark into right position", () => {
    const newBookmark: Bookmark = {
      bookmarkId: 20,
      title: "Bookmark 1",
      sessionId: "3338f60f-622c-4dee-8585-fb39035237e4",
      createUnix: 1688851200000
    }
    sideBarStore.onSave(newBookmark)
    expect(sideBarStore.allBookmarks.length).toBe(11)
    const newTargetIdx = sideBarStore.allBookmarks.findIndex(
      (bookmarks) => bookmarks.bookmarkId === newBookmark.bookmarkId
    )
    expect(sideBarStore.allBookmarks[newTargetIdx - 1].bookmarkId).toBeLessThan(
      newBookmark.bookmarkId
    )
    expect(
      sideBarStore.allBookmarks[newTargetIdx + 1].bookmarkId
    ).toBeGreaterThan(newBookmark.bookmarkId)
  })

  it("should edit a bookmark and save it", () => {
    const bookmark = sideBarStore.allBookmarks[0]
    const newTitle = "new title"
    bookmark.title = newTitle
    sideBarStore.onSave(bookmark)
    expect(sideBarStore.allBookmarks[0].title).toBe(newTitle)
  })

  it("should delete a bookmark", () => {
    const target = sideBarStore.allBookmarks[3]
    sideBarStore.onDelete(target)
    expect(sideBarStore.allBookmarks.length).toBe(9)
    const targetIdx = sideBarStore.allBookmarks.findIndex(
      (bookmark) => bookmark.bookmarkId === target.bookmarkId
    )
    expect(targetIdx).toBe(-1)
  })
})

describe("other pure functions tests", () => {
  it("should group bookmarks by date", () => {
    const date = new Date("2023/06/09 23:59:59")
    const result = groupByDate(mockBookmarks, date)
    expect(result[0].label).toBe("Today")
    expect(result[0].data).toEqual([
      mockBookmarks[0],
      mockBookmarks[1],
      mockBookmarks[2],
      mockBookmarks[3]
    ])

    expect(result[1].label).toBe("Yesterday")
    expect(result[1].data).toEqual([mockBookmarks[4]])

    expect(result[2].label).toBe("Previous 7 Days")
    expect(result[2].data).toEqual([])

    expect(result[3].label).toBe("Previous 30 Days")
    expect(result[3].data).toEqual([mockBookmarks[5]])

    expect(result[4].label).toBe("2023-May")
    expect(result[4].data).toEqual([mockBookmarks[6]])

    expect(result[5].label).toBe("2023-February")
    expect(result[5].data).toEqual([mockBookmarks[7], mockBookmarks[8]])

    expect(result[6].label).toBe("2023-January")
    expect(result[6].data).toEqual([mockBookmarks[9]])
  })
})
