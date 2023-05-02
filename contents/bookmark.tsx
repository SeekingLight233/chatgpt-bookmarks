import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import BookmarkIcon from "~components/BookmarkIcon";
import { createStyles } from "~utils/base";
import "./base.css"
import { useState } from "react";
import theme from "~utils/theme";

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {

  const elements = document.querySelectorAll('.flex.justify-between.lg\\:block');

  const nodeList: Element[] = [];

  elements.forEach((element) => {
    const lastBtn = element.querySelector('div:first-child button:last-child');
    lastBtn && nodeList.push(lastBtn);
  })

  return nodeList as unknown as NodeList
}


const Bookmark = () => {
  // hover not working for some reason, just work around it
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return <div
    onClick={() => {
    }}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{ ...styles.container, backgroundColor: isHovered ? theme.iconHoverColor : "#444654" }}>
    <BookmarkIcon color={isHovered ? "#fff" : theme.iconTintColor}></BookmarkIcon>
  </div>
}

const styles = createStyles({
  container: {
    width: 24,
    height: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.375rem",
    cursor: "pointer",
  }
})

export default Bookmark
