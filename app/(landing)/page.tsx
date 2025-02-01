import BookRoom from "@/components/landing/BookRoom";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import MostPicked from "@/components/landing/MostPicked";
import Places from "@/components/landing/Places";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Header />
      <Hero />
      <BookRoom />
      <MostPicked />
      <Places />
    </main>
  );
}
