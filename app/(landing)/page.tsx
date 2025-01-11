import BookRoom from "@/components/landing/BookRoom";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import MostPicked from "@/components/landing/MostPicked";
import Places from "@/components/landing/Places";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Header />
      <Hero />
      <BookRoom />
      <MostPicked />
      <Places />
      <section className="py-16 container px-4 md:px-8 mx-auto items-center justify-center w-full flex">
        <Button className="font-medium text-white text-xl h-12 px-7 leading-8 bg-[#262627] shadow-[0px_0px_16.1px_-1px_#00000040] mt-3 hover:opacity-95 hover:bg-black transition-all">
          Register Your&apos;s Now
        </Button>
      </section>
    </main>
  );
}
