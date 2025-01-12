import BookRoom from "@/components/landing/BookRoom";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import MostPicked from "@/components/landing/MostPicked";
import Places from "@/components/landing/Places";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Header />
      <Hero />
      <BookRoom />
      <MostPicked />
      <Places />
      <section className="py-16 container px-4 md:px-8 mx-auto items-center justify-center w-full flex">
        <Link href="/auth?type=signup" className="font-medium text-white text-xl h-12 px-7 leading-8 bg-[#262627] shadow-[0px_0px_16.1px_-1px_#00000040] mt-3 hover:opacity-95 hover:bg-black transition-all rounded-lg flex items-center justify-center">
          Register Your&apos;s Now
        </Link>
      </section>
    </main>
  );
}
