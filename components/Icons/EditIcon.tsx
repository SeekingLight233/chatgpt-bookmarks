import * as React from "react"
import { createStyles } from "~utils/base"
import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"

interface EditIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

function EditIcon(props: EditIconProps) {
  const { color = theme.iconTintColor, ...restProps } = props
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()

  return (
    <div style={{ color: isHovered ? "#fff" : theme.iconTintColor, ...styles.container }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
        {...restProps}
      >
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </div>

  )
}

const styles = createStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor:"pointer"
  }
})

export default EditIcon
