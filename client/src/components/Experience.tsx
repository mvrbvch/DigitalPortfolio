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

    const sections = contentRef.current.querySelectorAll('.content__section');

    sections.forEach((section) => {
      const titleEl = section.querySelector('.content__title') as HTMLElement;
      const title = new SplitType(titleEl, { types: 'chars' });

      // Reset chars position
      gsap.set(title.chars, {
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
      .to(title.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: {
          amount: 0.3,
          from: "random"
        },
        ease: "power4.out",
      })
      .from(section.querySelector('.content__text'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
      }, "<");
    });
  }, []);

  return (
    <div className="content py-40" ref={contentRef}>
      <div className="max-w-[90rem] mx-auto px-8">
        {experiences.map((exp, index) => (
          <div key={index} className="content__section mb-40 last:mb-0">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8">
                <h2 className="content__title text-[12rem] font-mono leading-none tracking-tight">
                  {exp.title}
                </h2>
              </div>
              <div className="col-span-4 self-center">
                <div className="content__text text-xl leading-relaxed text-muted-foreground">
                  {exp.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}