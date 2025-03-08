import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
// import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Brand - Restaurant and Hotel Booking",
  description: "Book your favorite restaurants and hotels with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} antialiased`}>
          {/* <AuthProvider> */}
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="grow bg-gray-50">{children}</main>
              <Footer />
            </div>
            <Toaster />
          {/* </AuthProvider> */}
      </body>
    </html>
  );
}
