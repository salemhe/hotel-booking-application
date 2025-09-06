import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Utility function for conditionally joining classNames
// export function cn(...classes: (string | undefined | null | false)[]): string {
//   return classes.filter(Boolean).join(' ');
// }
