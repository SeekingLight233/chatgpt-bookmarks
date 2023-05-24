import * as React from "react"

import EmptyIcon from "~components/Icons/EmptyIcon"
import { createStyles } from "~utils/base"
import theme from "~utils/theme"

const Empty: React.FC = () => {
  return (
    <div style={styles.container}>
      <EmptyIcon size={96} color={theme.bookmarkBg}></EmptyIcon>
      <span style={styles.desc}>No Bookmarks!</span>
    </div>
  )
}

export default Empty

const styles = createStyles({
  container: {
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  desc: {
    color: theme.bookmarkBg,
    marginTop: 10
  }
})
