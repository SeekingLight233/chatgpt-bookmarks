import cssText from "data-text:~/contents/sidebar.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import "./base.css"
import { createStyles } from "~utils/base"
import ArrowIcon from "~components/ArrowIcon"
import theme from "~utils/theme"
import { bookmarkStore } from "~model/bookmark"
import BookmarkItem from "~components/BookmarkItem"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "bookmark-sidebar"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { list } = bookmarkStore

  useEffect(() => {
    document.body.classList.toggle("bookmark-sidebar-show", isOpen)
  }, [isOpen])

  console.log("theme.tintColor", theme.tintColor);

  return (
    <div id="sidebar" className={isOpen ? "open" : "closed"}>
      <div style={{ ...styles.toggleBtn, backgroundColor: isOpen ? theme.bgColor : theme.tintColor }} onClick={() => setIsOpen(!isOpen)}>
        <ArrowIcon
          direction={isOpen ? "right" : "left"}
          color={isOpen ? theme.tintColor : theme.bgColor}
        ></ArrowIcon>

      </div>
      <div style={styles.bookmarksArea}>
        <div style={styles.scrollArea}>
          {
            list.map((bookmark,idx) =>
              <BookmarkItem
                key={idx}
                onEdit={() => { }}
                onDelete={() => { }}
                {...bookmark}
              />)
          }
        </div>

      </div>
    </div>
  )
}

const styles = createStyles({
  toggleBtn: {
    position: "fixed",
    right: 0,
    top: "calc(50vw - var(50px))",
    width: 20,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  bookmarksArea: {
    width: "100%",
    // height: 600,
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingTop: 40,
  },
  scrollArea: {
    height: "90vh",
    paddingBottom: "20%",
    overflow: "scroll"
  }
})

export default Sidebar
