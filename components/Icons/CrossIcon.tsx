import * as React from "react"
import { useMemo } from "react"

import { useHover } from "~utils/hooks/useHover"
import theme from "~utils/theme"

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
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
      {...props}>
      <path
        fill={isHovered ? "#fff" : theme.iconTintColor}
        d="M572.341 512l268.491-268.501a42.667 42.667 0 00-59.275-61.376c-.362.341-.704.693-1.056 1.045L512 451.658l-268.49-268.49a42.667 42.667 0 00-60.342 60.33L451.669 512 183.168 780.501a42.667 42.667 0 0059.67 61.003l.671-.672L512 572.342l268.501 268.49c8.331 8.33 19.254 12.501 30.166 12.501s21.845-4.17 30.165-12.501a42.667 42.667 0 000-60.33L572.342 512z"
      />
    </svg>
  )
}

export default CrossIcon
