import * as React from "react"

import { createStyles } from "~utils/base"
import theme from "~utils/theme"

export interface Tab {
  id: string
  title: string
}

interface TabBarProps {
  tabs: Tab[]
  activeId: string
  onChange: (tab: string) => void
}

const TabBar: React.FC<TabBarProps> = (props) => {
  const { tabs, activeId, onChange } = props

  return (
    <div style={styles.container}>
      {tabs.map(({ id, title }) => {
        const isActive = activeId === id
        return (
          <div
            onClick={() => onChange(id)}
            key={id}
            style={{
              ...styles.tab,
              backgroundColor: isActive ? theme.bookmarkHoverColor : ""
            }}>
            {title}
          </div>
        )
      })}
    </div>
  )
}

const styles = createStyles({
  container: {
    width: "90%",
    height: 44,
    border: `1px solid #343542`,
    marginTop: 26,
    display: "flex",
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center"
  },
  tab: {
    width: "100%",
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    color: theme.sideBarTextColor
  }
})

export default TabBar
