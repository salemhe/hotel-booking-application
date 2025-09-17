import Image from "next/image";

export default function DashboardLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 animate-pulse">
          loading
          <Image
            src="/vercel.svg"
            alt="Thelo Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
