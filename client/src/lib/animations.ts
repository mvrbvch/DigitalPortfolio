import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Fade in sections on scroll
  gsap.utils.toArray<HTMLElement>("section").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: "top bottom-=100",
        end: "top center",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Initialize text reveal animations for headings
  gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((text) => {
    const split = new SplitType(text, {
      types: "chars",
      absolute: false,
    });

    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: text,
        start: "top bottom",
        end: "top center",
        scrub: 1,
      },
      opacity: 0.1,
      scale: 0,
      y: gsap.utils.random(-100, 100),
      rotationX: gsap.utils.random(-90, 90),
      transformOrigin: "50% 50% -50",
      stagger: {
        amount: 0.5,
        from: "random"
      },
      ease: "power4.out",
    });
  });
}