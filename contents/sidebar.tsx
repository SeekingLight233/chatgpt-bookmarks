import iconBase64 from "data-base64:~assets/icon.png"
import cssText from "data-text:~/contents/sidebar.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

// Inject to the webpage itself
import "./sidebar-base.css"
import { createStyles } from "~utils/base"
import Arrow from "~components/Arrow"
import theme from "~utils/theme"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "plasmo-sidebar"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    document.body.classList.toggle("plasmo-sidebar-show", isOpen)
  }, [isOpen])

  console.log("theme.tintColor",theme.tintColor);
  
  return (
    <div id="sidebar" className={isOpen ? "open" : "closed"}>
      <div style={{ ...styles.toggleBtn, backgroundColor: isOpen ? theme.bgColor : theme.tintColor }} onClick={() => setIsOpen(!isOpen)}>
        <Arrow
          direction={isOpen ? "right" : "left"}
          color={isOpen ? theme.tintColor : theme.bgColor}
        ></Arrow>
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
  }
})

export default Sidebar
