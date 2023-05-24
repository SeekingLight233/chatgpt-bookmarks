import { type CSSProperties } from "react"

export function createStyles<T extends { [key: string]: CSSProperties }>(
  styles: T
): T {
  return styles
}

export function filterKeysByString<Value = any>(
  obj: Record<string, Value>,
  searchString: string
): Record<string, Value> {
  const result: Record<string, any> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key.includes(searchString)) {
        result[key] = obj[key]
      }
    }
  }

  return result
}
