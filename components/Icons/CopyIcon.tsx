import { useMemoizedFn } from "ahooks"
import * as React from "react"
import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  const { onClick, color, ...restProps } = props

  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()

  const handleClick = useMemoizedFn((e) => {
    e.stopPropagation()
    onClick(e)
  })


  return (
    <svg
      {...restProps}
      stroke="currentColor"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      fill="none"
      strokeWidth={2}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      color={isHovered ? "#fff" : theme.iconTintColor}
    >
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x={8} y={2} width={8} height={4} rx={1} ry={1} />
    </svg>
  )
}

export default CopyIcon
