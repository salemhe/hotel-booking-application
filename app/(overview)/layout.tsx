import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import UserBottomNav from "@/app/components/layout/UserBottomNav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex flex-col ${inter.className} min-h-screen bg-[#F9FAFB]`}>
      <div className="hidden md:block">
        <Navigation />
      </div>
      <main className="grow pb-16 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <UserBottomNav />
    </div>
  );
}
