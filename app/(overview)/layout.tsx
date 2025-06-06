import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Navigation />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
