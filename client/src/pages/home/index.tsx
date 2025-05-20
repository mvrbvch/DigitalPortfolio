import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ThreeBackground from "@/components/ThreeBackground";
import { initScrollAnimations } from "@/lib/animations";
import { initSmoothScroll } from "@/lib/smoothScroll";
import gsap from "gsap";
import Metamorph3D from "@/components/Metamorph3D";
import LensEffect from "@/components/LensEffect";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const heroDecorativeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Mark as loaded to trigger animations
    setIsLoaded(true);

    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      backgroundColor: "#000000",
      duration: 1.5,
      ease: "power2.inOut",
    });

    gsap.to(".backdrop-blur", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      backdropFilter: "blur(0px)",
    });

    tl.from(containerRef.current, {
      backgroundColor: "#ffffff",
      duration: 1.5,
      ease: "power2.inOut",
    });

    gsap.to(".backdrop-blur", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      backdropFilter: "blur(0px)",
    });

    // Mouse parallax effect for hero content
    const handleMouseMove = (e: MouseEvent) => {
      const content = containerRef.current?.querySelector(".hero-content");
      if (!content) return;

      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      gsap.to(content, {
        x: mouseX * 20,
        y: mouseY * 20,
        duration: 1,
        ease: "power2.out",
      });

      window.addEventListener("mousemove", handleMouseMove);

      // Particle movement based on mouse position
      const particles =
        containerRef.current?.querySelector(".particles-canvas");
      if (particles) {
        gsap.to(particles, {
          x: mouseX * -30,
          y: mouseY * -30,
          duration: 2,
          ease: "power2.out",
        });
      }
    };

    // Animate social links
    if (socialRef.current) {
      const links = socialRef.current.querySelectorAll(".social-link");

      gsap.from(links, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        delay: 1.8,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }

    // Floating animation for decorative elements
    const decorativeElements = document.querySelectorAll(
      ".hero-decorative-element"
    );
    decorativeElements.forEach((element, index) => {
      gsap.to(element, {
        y: `${Math.sin(index) * 20}px`,
        x: `${Math.cos(index) * 20}px`,
        duration: 3 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize GSAP scroll animations
    initScrollAnimations();

    // Initialize smooth scrolling (Lenis)
    initSmoothScroll();

    // Add body class for styling
    gsap.fromTo(
      revealRef.current,
      { opacity: 1, y: 0, backgroundColor: "#000000" },
      {
        opacity: 0,
        y: 0,
        duration: 3,
        pointerEvents: "none",
        ease: "power2.out",
      }
    );
    // GSAP animation for hero-content exit and re-entry
    if (heroContentRef.current) {
      gsap.fromTo(
        heroContentRef.current,
        { opacity: 1, y: 0 },
        {
          scrollTrigger: {
            trigger: heroContentRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          opacity: 0,
          y: -50,
          duration: 1,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        heroContentRef.current,
        { opacity: 0, y: -50 },
        {
          scrollTrigger: {
            trigger: heroContentRef.current,
            start: "bottom top",
            end: "top top",
            scrub: true,
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.in",
        }
      );
    }

    // Fix hero decorative elements
    if (heroDecorativeRef.current) {
      gsap.to(heroDecorativeRef.current, {
        scrollTrigger: {
          trigger: heroDecorativeRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 0, // Keeps the decorative elements fixed
        ease: "none",
      });
    }

    const decorativeElements = document.querySelectorAll(
      ".hero-decorative-element"
    );
    decorativeElements.forEach((element, index) => {
      gsap.to(element, {
        y: `${Math.sin(index) * 20}px`,
        x: `${Math.cos(index) * 20}px`,
        duration: 3 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Animate titles
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div
        className="reveal"
        style={{
          position: "fixed",
          width: "100%",
          height: "100vh",
          background: "#000000",
          zIndex: 1000,
        }}
        ref={revealRef}
      ></div>
      {/* Hero Section */}
      <div ref={heroDecorativeRef} className="fixed inset-0">
        <div className="fixed inset-0 backdrop-blur bg-gradient-to-b from-transparent to-background/20" />

        {/* Animated gradient orbs - inspired by Sarah Guo Portfolio */}
        <div className="fixed top-1/4 -left-[10vw] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/10 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="fixed bottom-1/4 -right-[10vw] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl animate-blob"></div>

        {/* Decorative elements */}
        <div className="hero-decorative-element fixed top-[15%] left-[10%] w-6 h-6 rounded-full border border-primary/30 opacity-60"></div>
        <div className="hero-decorative-element fixed top-[20%] right-[15%] w-8 h-8 rounded-full border border-purple-500/30 opacity-60"></div>
        <div className="hero-decorative-element fixed bottom-[25%] left-[20%] w-10 h-10 rounded-full border border-blue-500/30 opacity-60"></div>
        <div className="hero-decorative-element fixed bottom-[15%] right-[10%] w-12 h-12 rounded-full border border-primary/30 opacity-60"></div>

        {/* Add decorative elements here */}
        <Metamorph3D
          className="fixed top-0 left-0 animate-float z-0"
          variant="sphere"
          color="#3b82f6"
          size={20}
          speed={1.2}
        />
        <Metamorph3D
          className="fixed bottom-0 right-0 animate-float z-0"
          variant="sphere"
          color="#8b5cf6"
          size={1.4}
          speed={2.5}
        />
        <ThreeBackground particleDensity={2000} colorScheme="mixed" />
      </div>

      <Hero />
      {/* Experience Section */}
      <section
        id="experience"
        ref={experienceSectionRef}
        className="min-h-screen w-full flex flex-col justify-center items-center p-4"
      >
        <Experience />
      </section>
      {/* Other Sections */}
      <Skills />
      {/* <Projects /> */}
      <Contact />
    </main>
  );
}
