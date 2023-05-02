import * as React from "react"
import theme from "~utils/theme"

interface BookmarkIconProps {
  color?: string,
}

function BookmarkIcon(props: BookmarkIconProps) {

  const { color = theme.iconTintColor } = props

  return (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width={"1rem"}
      height={"1rem"}
    >
      <path fill={color} d="M804.571 146.286H219.43V855.99L512 575.415l50.834 48.567L804.571 855.99V146.286zm6.876-73.143q13.166 0 25.161 5.12 18.87 7.46 29.989 23.406t11.117 35.4v736.55q0 19.455-11.117 35.4t-29.989 23.406q-10.825 4.535-25.161 4.535-27.429 0-47.397-18.286L512.073 676.352 260.096 918.674q-20.553 18.871-47.397 18.871-13.165 0-25.16-5.12-18.872-7.46-29.99-23.406t-11.117-35.4v-736.55q0-19.455 11.118-35.4t29.988-23.406q11.996-5.12 25.161-5.12H811.52z" />
    </svg>
  )
}

export default BookmarkIcon
