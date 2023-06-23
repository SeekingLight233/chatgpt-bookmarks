import { useHover } from "ahooks"
import * as React from "react"
import { useRef } from "react"

function UnBindIcon(props: React.SVGProps<SVGSVGElement>) {
  const ref = useRef(null)
  const isHovered = useHover(ref)
  const color = isHovered ? "#FF5B5A" : "#ffa39e"
  return (
    <svg
      ref={ref}
      className="icon"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      {...props}>
      <path
        d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0zm0 938.667c-234.667 0-426.667-192-426.667-426.667S277.333 85.333 512 85.333s426.667 192 426.667 426.667-192 426.667-426.667 426.667z"
        fill={color}
      />
      <path d="M341.333 469.333h341.334v85.334H341.333z" fill={color} />
    </svg>
  )
}

export default UnBindIcon
