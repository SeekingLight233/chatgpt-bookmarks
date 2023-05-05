
import * as React from 'react';
import { useMemo,useState } from 'react';
import BookmarkIcon from '~components/BookmarkIcon';
import DeleteIcon from '~components/DeleteIcon';
import EditIcon from '~components/EditIcon';
import type { Bookmark } from '~model/bookmark';
import { createStyles } from '~utils/base';
import { domIdMap } from '~utils/dom';
import { useHover } from '~utils/hooks/useHover';
import theme from '~utils/theme';

interface BookmarkItemProps extends Bookmark {
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  onClick: (bookmarkId: number) => void;
  active?: boolean;
}

const BookmarkItem: React.FC<BookmarkItemProps> = (props) => {
  const { onEdit, onDelete, onClick, title, sessionLink, bookmarkId,active = false } = props;
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()

  const backgroundColor = useMemo(() => {
    if (active) return theme.activeColor;
    return isHovered ? theme.bookmarkHoverColor : ""
  }, [isHovered, active])

  return <div onClick={() => onClick(bookmarkId)} style={{ ...styles.item, backgroundColor }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    <BookmarkIcon style={styles.icon} color={"#fff"}></BookmarkIcon>
    <span style={styles.title}>{title}</span>
    <EditIcon style={styles.rightIcon}></EditIcon>
    <DeleteIcon style={styles.rightIcon}></DeleteIcon>
  </div>
}

export default BookmarkItem;

const styles = createStyles({
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
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
  title: {
    width: "65%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow:"hidden",
    display: "inline-block",
  },
})

