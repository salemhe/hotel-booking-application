import { Inter } from "next/font/google";
import { ReservationsProvider } from "../contexts/ReservationContext";

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
      <ReservationsProvider>
        <main className="grow">{children}</main>
      </ReservationsProvider>
    </div>
  );
}
