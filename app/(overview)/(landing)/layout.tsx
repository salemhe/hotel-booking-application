import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <div>
      <Navigation />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
