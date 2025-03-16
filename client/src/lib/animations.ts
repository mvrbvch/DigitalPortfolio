import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
}
