"use client"

import type { ReactNode } from "react"

export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="animate-in fade-in-0 duration-300">{children}</div>
}
