import { useMemoizedFn } from "ahooks"
import * as React from "react"
import { useMemo, useState } from "react"

import BookmarkIcon from "~components/Icons/BookmarkIcon"
import CheckIcon from "~components/Icons/CheckIcon"
import CopyIcon from "~components/Icons/CopyIcon"
import DeleteIcon from "~components/Icons/DeleteIcon"
import EditIcon from "~components/Icons/EditIcon"
import type { Bookmark } from "~model/sidebar"
import { createStyles } from "~utils/base"
import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"

import { chatUrl } from "../../config/index"
import AlertIcons from "./DeleteAlert"

interface BookmarkItemProps extends Bookmark {
  onEdit: (bookmark: Bookmark) => void
  onDelete: (omitBookmark: Omit<Bookmark, "title" | "createUnix">) => void
  onClick: (omitBookmark: Omit<Bookmark, "title" | "createUnix">) => void
  active?: boolean
}

const BookmarkItem: React.FC<BookmarkItemProps> = (props) => {
  const {
    onEdit,
    onDelete,
    onClick,
    title,
    sessionId,
    bookmarkId,
    createUnix,
    active = false
  } = props
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [toastMsg, setToastMsg] = useState<string>()

  const backgroundColor = useMemo(() => {
    if (active) return theme.activeColor
    return isHovered ? theme.bookmarkHoverColor : ""
  }, [isHovered, active])

  const handleConfirm = useMemoizedFn(() => {
    onDelete({
      sessionId,
      bookmarkId
    })
    setDeleteAlert(false)
  })

  const handleCancel = useMemoizedFn(() => {
    setDeleteAlert(false)
  })

  const handleClickDelete = useMemoizedFn((e) => {
    e.stopPropagation()
    setDeleteAlert(true)
  })

  const handleClickEdit = useMemoizedFn((e) => {
    e.stopPropagation()
    onEdit({
      sessionId,
      bookmarkId,
      title,
      createUnix
    })
  })

  const showToast = useMemoizedFn((toastMsg: string) => {
    setToastMsg(toastMsg)
    setTimeout(() => {
      setToastMsg(undefined)
    }, 2500)
  })

  const handleClickCopy = useMemoizedFn((e) => {
    e.stopPropagation()
    const copyLink = `${chatUrl}${sessionId}#${bookmarkId}`
    navigator.clipboard
      .writeText(copyLink)
      .then(() => {
        showToast("Copy link success")
        console.log("Copy link success!")
      })
      .catch((e) => {
        console.log(e)
      })
  })

  const renderContent = () => {
    if (toastMsg) {
      return (
        <>
          <CheckIcon style={styles.icon}></CheckIcon>
          <span style={styles.title}>{toastMsg}</span>
        </>
      )
    }

    return (
      <>
        <CopyIcon onClick={handleClickCopy} style={styles.icon}></CopyIcon>
        <span style={styles.title}>{title}</span>
        {deleteAlert ? (
          <AlertIcons
            onConfirm={handleConfirm}
            onCancel={handleCancel}></AlertIcons>
        ) : (
          <>
            <EditIcon
              onClick={handleClickEdit}
              style={styles.rightIcon}></EditIcon>
            <DeleteIcon
              onClick={handleClickDelete}
              style={styles.rightIcon}></DeleteIcon>
          </>
        )}
      </>
    )
  }

  return (
    <div
      onClick={() => {
        onClick({
          sessionId,
          bookmarkId
        })
      }}
      style={{ ...styles.item, backgroundColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {renderContent()}
    </div>
  )
}

export default BookmarkItem

export const styles = createStyles({
  item: {
    width: "90%",
    height: 44,
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 14,
    marginLeft: "5%"
  },
  icon: {
    marginLeft: 10,
    marginRight: 10
  },
  rightIcon: {
    marginLeft: 5,
    marginRight: 5
  },
  title: {
    width: "65%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline-block",
    color: theme.sideBarTextColor
  }
})
