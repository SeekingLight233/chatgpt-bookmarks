
const lightTheme = {
  tintColor: "#ffffff", // 白色主题背景
  bgColor: "#f0f0f0", // 一种很浅的灰色作为背景色
  activeColor: "#dddddd", // 较深的灰色表示活动状态
  iconTintColor: "rgb(172,172,190)", // 使用深色以在明亮背景上保持可见性
  iconHoverColor: "#ECECF1", // 深色用于鼠标悬停状态
  bookmarkHoverColor: "#e0e0e0", // 一种较深的灰色表示书签悬停
  white: "#202123", // 在明亮主题中，"white"实际上可以代表一种深色
  bookmarkBg: "#F7F7F8",
  bookmarkIconHoverColor:"#40414F"
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
  bookmarkIconHoverColor: "#fff"
}

const getTheme = () => {
  return isDarkMode() ? darkTheme : lightTheme
}

const theme = getTheme()

export default theme

function isDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // 用户偏好是暗夜模式
    return true;
  } else {
    // 用户偏好不是暗夜模式
    return false;
  }
}
