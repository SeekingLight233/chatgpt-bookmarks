import { useEffect, useState } from "react"

import { createStyles } from "~utils/base"
function IndexPopup() {
  return (
    <div style={styles.container}>
      <span style={styles.text}>Chat-GPT bookmarks is actived!</span>
    </div>
  )
}

const styles = createStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 280,
    height: 20,
    backgroundColor: "#f2f2f2", // 设置背景色
    borderRadius: "5px", // 设置边框圆角
    justifyContent: "center", // 水平居中
    alignItems: "center", // 垂直居中
    boxShadow: "0px 0px 5px rgba(0,0,0,0.2)", // 添加阴影
    padding: "10px" // 添加内边距
  },
  text: {
    fontSize: "14px", // 设置字体大小
    color: "#333", // 设置字体颜色
    fontWeight: "bold" // 设置字体粗细
  }
})

export default IndexPopup
