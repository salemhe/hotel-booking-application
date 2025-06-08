import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <div className={`flex flex-col ${inter.className} min-h-screen bg-[#F9FAFB]`}>
      <main className="grow">{children}</main>
    </div>
  );
}
