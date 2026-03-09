import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { UniversitiesSection } from "@/components/universities-section";
import { VisionSection } from "@/components/vision-section";
import { NewsSection } from "@/components/news-section";
import { ECampusSection } from "@/components/ecampus-section";
import { EventsSection } from "@/components/events-section";
import { Footer } from "@/components/footer";
export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <UniversitiesSection />
      <VisionSection />
      <NewsSection />
      <ECampusSection />
      <EventsSection />
      <Footer />
    </main>
  );
}
