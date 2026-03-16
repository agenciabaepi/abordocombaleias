import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroMarquee from "@/components/HeroMarquee";
import Experience from "@/components/Experience";
import Diferenciais from "@/components/Diferenciais";
import Season from "@/components/Season";
import CTA from "@/components/CTA";
import ScrollFramesSection from "@/components/ScrollFramesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HeroMarquee />
        <Experience />
        <Diferenciais />
        <Season />
        <CTA />
        <ScrollFramesSection />
      </main>
      <Footer />
    </>
  );
}
