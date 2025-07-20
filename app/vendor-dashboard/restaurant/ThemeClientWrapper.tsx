"use client";
import { ThemeProvider } from "@/app/super-admin/ThemeContext";

export default function ThemeClientWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
