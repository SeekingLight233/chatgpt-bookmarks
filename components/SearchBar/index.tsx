import * as React from "react"
import { type ChangeEvent, type FC } from "react"

import { createStyles } from "~utils/base"
import theme from "~utils/theme"

interface SearchBarProps {
  onSearch: (value: string) => void
}

const styles = createStyles({
  container: {
    width: "82%",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    color: "#fff",
    marginTop: "10vh",
    backgroundColor: theme.bookmarkHoverColor
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    border: "none",
    color: "#fff",
    backgroundColor: theme.bookmarkHoverColor,
    outline: "none"
  }
})

const SearchIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="white"
    width="18px"
    height="18px">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10 2a8 8 0 016.32 12.906l4.282 4.282-1.414 1.414-4.257-4.257A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z" />
  </svg>
)

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value)
  }

  return (
    <div style={styles.container}>
      <SearchIcon />
      <input
        type="search"
        style={styles.input}
        placeholder="Search..."
        onChange={handleSearch}
      />
    </div>
  )
}

export default SearchBar
