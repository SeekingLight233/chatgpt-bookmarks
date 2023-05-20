import * as React from "react"
import { useMemo } from "react";
import { useHover } from "~utils/hooks/useHover";
import theme from "~utils/theme";

function CheckIcon(props) {

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
      <path fill={isHovered ? "#fff" : theme.iconTintColor} d="M20 6L9 17 4 12" />
    </svg>
  )
}

export default CheckIcon
