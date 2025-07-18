import { Inter } from "next/font/google";
import { ReservationsProvider } from "../contexts/ReservationContext";
import Navigation from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`flex flex-col ${inter.className} min-h-screen bg-[#F9FAFB]`}
    >
      <Navigation />
      <ReservationsProvider>
        <main className="grow pt-20">{children}</main>
      </ReservationsProvider>
    </div>
  );
}
