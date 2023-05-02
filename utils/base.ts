import { type CSSProperties } from 'react';

export function createStyles<T extends { [key: string]: CSSProperties }>(styles: T): T {
  return styles;
}

