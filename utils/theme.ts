const lightTheme = {
  tintColor: "#171717",
  bgColor: "#343541",
  activeColor: "#343541",
  iconTintColor: "rgb(172,172,190)",
  iconHoverColor: "#40414F",
  bookmarkHoverBgColor: "#ECECF1",
  bookmarkHoverColor: "#2A2B32",
  white: "rgb(236,236,241)",
  bookmarkBg: "#444654",
  bookmarkBgColor: "#F7F7F8",
  bookmarkIconHoverColor: "#000",
  groupLabelColor: "rgb(142,142,160)",
  sideBarTextColor: "#fff"
}

const darkTheme = {
  tintColor: "#171717",
  bgColor: "#343541",
  activeColor: "#343541",
  iconTintColor: "rgb(217,217,227)",
  iconHoverColor: "#40414F",
  bookmarkHoverBgColor: "#40414F",
  bookmarkHoverColor: "#2A2B32",
  white: "rgb(236,236,241)",
  bookmarkBg: "#444654",
  bookmarkBgColor: "#444654",
  bookmarkIconHoverColor: "#fff",
  groupLabelColor: "rgb(142,142,160)",
  sideBarTextColor: "#fff"
}

const getTheme = () => {
  return isDarkMode() ? darkTheme : lightTheme
}

const theme = getTheme()

export default theme

export function isDarkMode() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return true
  } else {
    return false
  }
}
