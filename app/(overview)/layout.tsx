export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <div className={`flex flex-col min-h-screen bg-[#F9FAFB]`}>
      <div className="grow ">{children}</div>
    </div>
  );
}
