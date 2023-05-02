import * as React from "react"
import { createStyles } from "~utils/base"


interface ArrowProps {
  color: string,
  direction: "top" | "bottom" | "left" | "right"
  size?: number
}

function ArrowIcon(props: ArrowProps) {

  const { color, direction = "right", size = 128 } = props

  const getDirectionTransform = () => direction === "top" ? "rotate(90deg)" : direction === "bottom" ? "rotate(-90deg)" : direction === "left" ? "rotate(180deg)" : "rotate(0deg)"

  return (
    <svg
      style={{
        transition: "all 0.5s ease",
        transform: getDirectionTransform()
      }}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M728.224 520.228a42.467 42.467 0 01-11.393 20.503L374.907 882.657c-16.663 16.663-43.678 16.663-60.34 0s-16.663-43.677 0-60.34l311.882-311.884L314.615 198.6c-16.663-16.663-16.663-43.678 0-60.34 16.661-16.663 43.676-16.663 60.339 0L716.88 480.183c10.86 10.86 14.642 26.12 11.344 40.044z"
        fill={color}
      />
    </svg>
  )
}

export default ArrowIcon
