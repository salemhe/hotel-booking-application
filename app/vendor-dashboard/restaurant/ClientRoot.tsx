"use client";
import { ThemeProvider } from "@/app/super-administrator/ThemeContext";
import { BranchProvider } from "./branches/BranchContext";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BranchProvider>
        {children}
      </BranchProvider>
    </ThemeProvider>
  );
}
