import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      backgroundColor: "transparent",
      duration: 1.5,
      ease: "power2.inOut"
    });

    gsap.to(".backdrop-blur", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    });
  }, []);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 backdrop-blur bg-gradient-to-b from-transparent to-background/30" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <AnimatedText
          text="Matheus Murbach"
          tag="h1"
          className="text-7xl md:text-9xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
          splitOptions={{ types: 'chars, words' }}
          animation={{
            chars: {
              opacity: 0,
              y: 50,
              rotateX: -90,
              stagger: 0.02,
              duration: 1,
              ease: "back.out(1.7)",
            },
            words: {
              opacity: 0,
              x: -50,
              duration: 1,
              stagger: 0.1,
              ease: "power2.out",
            }
          }}
        />

        <AnimatedText
          text="Software Engineer"
          tag="h2"
          className="text-3xl md:text-5xl text-muted-foreground mb-8"
          splitOptions={{ types: 'words' }}
          animation={{
            words: {
              opacity: 0,
              y: 20,
              stagger: 0.1,
              duration: 0.8,
              ease: "power2.out",
            }
          }}
          delay={0.5}
        />

        <AnimatedText
          text="Full-Stack Developer | Node.js, TypeScript, React, React Native & AI Enthusiast"
          className="text-lg md:text-xl text-muted-foreground mb-12"
          splitOptions={{ types: 'words' }}
          animation={{
            words: {
              opacity: 0,
              x: -30,
              stagger: 0.05,
              duration: 0.8,
              ease: "power2.out",
            }
          }}
          delay={1}
        />

        <Button
          size="lg"
          className="opacity-0 animate-[fadeIn_0.5s_1.5s_forwards] bg-primary/80 hover:bg-primary backdrop-blur-sm"
          onClick={() => {
            document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          View My Work
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}