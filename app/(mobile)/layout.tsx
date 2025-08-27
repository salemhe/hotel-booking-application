import { Metadata } from "next";
import MobileProvider from "../../lib/providers/MobileProvider";

export const metadata: Metadata = {
  title: "Bookie Mobile App",
  description: "Mobile app for restaurant and hotel booking",
  manifest: "/manifest.json",
  themeColor: "#0891b2",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileProvider>
      <div className="mobile-app min-h-screen bg-gray-50">
        {children}
      </div>
    </MobileProvider>
  );
}
