import { type CSSProperties } from "react"

export function createStyles<T extends { [key: string]: CSSProperties }>(
  styles: T
): T {
  return styles
}

export function filterObjBySubStrKey<Value = any>(
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

type Func<T = any, R = T> = (arg: T) => R

export function pipe<T = any, R = T>(...functions: Func<T, R>[]): Func<T, R> {
  return function (initialValue: T): R {
    // @ts-ignore
    return functions.reduce((accumulator: T, func: Func<T, R>) => {
      return func(accumulator)
    }, initialValue)
  }
}

// return YYYY-MM-DD HH:mm
export function getFmtTime(createUnix: number): string {
  const date = new Date(createUnix)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = ("0" + date.getHours()).slice(-2)
  const minute = ("0" + date.getMinutes()).slice(-2)
  return `${year}-${month}-${day} ${hour}:${minute}`
}
