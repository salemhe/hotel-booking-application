import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
// import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <body className={`${poppins.variable} antialiased`}>
          {/* <AuthProvider> */}
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow bg-gray-50">{children}</main>
            </div>
            <Toaster />
          {/* </AuthProvider> */}
      </body>
    </html>
  );
}
