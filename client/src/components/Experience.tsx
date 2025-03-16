import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: "murbach.work/",
    description: "Independent software engineering consultancy providing professional services with focus on efficient results.",
  },
  {
    title: "GO.K/",
    description: "Led development of cutting-edge mobile and e-commerce experiences using React, React Native, and Node.js.",
  },
  {
    title: "RD Saúde/",
    description: "Spearheaded healthcare solutions development using React, React Native, and Node.js.",
  },
  {
    title: "Napp Solutions/",
    description: "Led teams working on critical systems like Esphera, serving hundreds of Brazilian shopping malls.",
  }
];

export default function Experience() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const sections = contentRef.current.querySelectorAll('.section');

    sections.forEach((section) => {
      const titleEl = section.querySelector('.title') as HTMLElement;
      const split = new SplitType(titleEl, { types: 'chars' });

      // Reset chars position
      gsap.set(split.chars, {
        opacity: 0.2,
        y: () => gsap.utils.random(-100, 100),
        rotateX: () => gsap.utils.random(-90, 90),
      });

      // Create scroll animation
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      })
      .to(split.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: {
          amount: 0.3,
          from: "random"
        },
        ease: "power4.out",
      })
      .from(section.querySelector('.description'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
      }, "<");
    });
  }, []);

  return (
    <div className="min-h-screen py-40" ref={contentRef}>
      <div className="max-w-[90rem] mx-auto px-8">
        {experiences.map((exp, index) => (
          <div key={index} className="section mb-40 last:mb-0">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h2 className="title text-[8rem] md:text-[12rem] font-mono leading-[0.9] tracking-tight">
                  {exp.title}
                </h2>
              </div>
              <div className="md:w-1/3 self-end">
                <p className="description text-xl text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}