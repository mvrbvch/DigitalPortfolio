import { useEffect } from "react";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { initScrollAnimations } from "@/lib/animations";
import { initSmoothScroll } from "@/lib/smoothScroll";

export default function Home() {
  useEffect(() => {
    // Initialize GSAP scroll animations
    initScrollAnimations();
    
    // Initialize smooth scrolling (Lenis)
    initSmoothScroll();
    
    // Add body class for styling
    document.body.classList.add('bg-grid-pattern');
    
    return () => {
      document.body.classList.remove('bg-grid-pattern');
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
