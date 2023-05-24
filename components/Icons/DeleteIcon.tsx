import { useMemoizedFn } from "ahooks"
import * as React from "react"

import { createStyles } from "~utils/base"
import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"

interface DeleteIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

function DeleteIcon(props: DeleteIconProps) {
  const { color = theme.iconTintColor, ...restProps } = props
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()

  return (
    <div
      style={{
        color: isHovered ? "#fff" : theme.iconTintColor,
        ...styles.container
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth={2}
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <path d="M3 6L5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <path d="M10 11L10 17" />
        <path d="M14 11L14 17" />
      </svg>
    </div>
  )
}

const styles = createStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  }
})

export default DeleteIcon
