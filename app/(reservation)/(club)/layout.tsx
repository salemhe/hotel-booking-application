import { ReservationsProvider } from "@/contexts/club/ReservationContext";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`flex flex-col min-h-screen bg-[#F9FAFB]`}
    >
      <ReservationsProvider>
        <main className="grow">{children}</main>
      </ReservationsProvider>
    </div>
  );
}
