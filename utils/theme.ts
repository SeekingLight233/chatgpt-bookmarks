const lightTheme = {
  tintColor: "#ffffff",
  bgColor: "#f0f0f0",
  activeColor: "#dddddd",
  iconTintColor: "rgb(172,172,190)",
  iconHoverColor: "#ECECF1",
  bookmarkHoverColor: "#e0e0e0",
  white: "#202123",
  bookmarkBg: "#F7F7F8",
  bookmarkIconHoverColor: "#40414F",
  groupLabelColor: "rgb(142,142,160)"
}

const darkTheme = {
  tintColor: "#202123",
  bgColor: "#343541",
  activeColor: "#343541",
  iconTintColor: "rgb(172,172,190)",
  iconHoverColor: "#40414F",
  bookmarkHoverColor: "#2A2B32",
  white: "rgb(236,236,241)",
  bookmarkBg: "#444654",
  bookmarkIconHoverColor: "#fff",
  groupLabelColor: "rgb(142,142,160)"
}

const getTheme = () => {
  return isDarkMode() ? darkTheme : lightTheme
}

const theme = getTheme()

export default theme

function isDarkMode() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // 用户偏好是暗夜模式
    return true
  } else {
    // 用户偏好不是暗夜模式
    return false
  }
}
