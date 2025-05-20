
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ThreeBackground from "../ThreeBackground";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Mark as loaded to trigger animations
    setIsLoaded(true);

    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      backgroundColor: "transparent",
      duration: 1,
      ease: "power2.inOut",
    });

    gsap.to(".backdrop-blur", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      backdropFilter: "blur(2px)",
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
      ".hero-decorative-element",
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

  return (

        <div className="particles-canvas">
          <ThreeBackground particleDensity={1000} colorScheme="mixed" />
        </div>

  );
}
