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

  // Initialize text reveal animations
  const textElements = gsap.utils.toArray<HTMLElement>(".reveal-text");
  textElements.forEach((text) => {
    const split = new SplitType(text, {
      types: "chars,words",
      absolute: false,
    });

    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: text,
        start: "top bottom-=100",
        end: "top center",
        scrub: 0.5,
      },
      opacity: 0.2,
      stagger: 0.05,
      ease: "power2.out",
    });
  });
}