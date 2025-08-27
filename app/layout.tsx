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
  manifest: "/manifest.json",
  themeColor: "#0891b2",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bookie",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Bookie",
    title: "Bookie - Restaurant and Hotel Booking",
    description: "Book your favorite restaurants and hotels with ease",
  },
  twitter: {
    card: "summary",
    title: "Bookie - Restaurant and Hotel Booking",
    description: "Book your favorite restaurants and hotels with ease",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-96x96.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bookie" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0891b2" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
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
