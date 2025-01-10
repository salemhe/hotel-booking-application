import BookRoom from "@/components/landing/BookRoom";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Header />
      <Hero />
      <BookRoom />
    </main>
  );
}
