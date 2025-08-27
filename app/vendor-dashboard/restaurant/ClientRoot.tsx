"use client";
import { ThemeProvider } from "@/app/super-administrator/ThemeContext";


export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      
        {children}
      
    </ThemeProvider>
  );
}
