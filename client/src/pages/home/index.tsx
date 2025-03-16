import { useEffect } from "react";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { initScrollAnimations } from "@/lib/animations";

export default function Home() {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
