import ErrorBoundary from "@/app/components/Errorboundary";
import "./globals.css";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/app/contexts/AuthContext";

// import { DM_Sans } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Bookie",
    default: "Bookie - Restaurant and Hotel Booking",
  },
  description: "Book your favorite restaurants and hotels with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={` ${inter.className} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}