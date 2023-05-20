import * as React from "react"
import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {

  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()
  return (
    <svg
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="icon"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width={"1rem"}
      height={"1rem"}
      {...props}
    >
      <path
        d="M327.46 896L0 563.98l60.96-61.81 266.5 270.2L963.04 128l60.96 61.81z"
        fill={isHovered ? "#fff" : theme.iconTintColor}
      />
    </svg>
  )
}

export default CheckIcon
