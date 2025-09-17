"use client";
import { ThemeProvider } from "@/app/super-administrator/ThemeContext";

export default function ThemeClientWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}


