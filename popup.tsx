import { useEffect, useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  useEffect(() => {
    console.log("popup")
  })

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>chatgpt bookmarks is actived!111</h2>
    </div>
  )
}

export default IndexPopup
