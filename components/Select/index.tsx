import * as React from "react"

import { createStyles } from "~utils/base"
import theme from "~utils/theme"

interface Option {
  value: string
  label: string
}

interface SelectProps {
  options: Option[]
  placeholder?: string
  onChange?: (value: string) => void
  defaultValue?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  onChange,
  defaultValue = ""
}) => {
  const [selectedOption, setSelectedOption] = React.useState(defaultValue)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value)
    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <select
      value={selectedOption}
      onChange={handleChange}
      style={styles.select}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select

const styles = createStyles({
  select: {
    width: "100%",
    height: 30,
    marginBottom: 20,
    backgroundColor: theme.bgColor,
    color: theme.sideBarTextColor,
    borderRadius: 4
  }
})
