import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    date: "Jan 2013 — Present",
    title: "Senior Software Engineer | Founder",
    company: "murbach.work",
    description: "Independent software engineering consultancy providing professional services with focus on efficient results. Leading development of innovative solutions and delivering high-quality software products that drive business growth.",
  },
  {
    date: "Nov 2023 — Oct 2024",
    title: "Senior Software Engineer",
    company: "GO.K",
    description: "Led development of cutting-edge mobile and e-commerce experiences using React, React Native, and Node.js. Implemented innovative solutions to enhance user engagement and drive business growth.",
  },
  {
    date: "Nov 2023 — Oct 2024",
    title: "Senior Software Engineer",
    company: "RD Saúde",
    description: "Spearheaded healthcare solutions development using React, React Native, and Node.js. Implemented best practices in software development, ensuring high-quality deliverables and optimal performance.",
  },
  {
    date: "Jan 2018 — Aug 2021",
    title: "Lead Frontend Engineer",
    company: "Napp Solutions",
    description: "Led teams working on critical systems like Esphera, serving hundreds of Brazilian shopping malls. Implemented TypeScript, Figma workflows, and custom Design Systems.",
  }
];

export default function Experience() {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      // Split company name into characters
      const companyText = new SplitType(section.querySelector('.company')!, {
        types: 'chars'
      });

      // Initial state for characters
      gsap.set(companyText.chars, {
        opacity: 0.1,
        y: () => gsap.utils.random(-100, 100),
        rotateX: () => gsap.utils.random(-90, 90),
        transformOrigin: "50% 50% -50"
      });

      // Create timeline for each section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse",
          markers: false
        }
      });

      // Animate company name chars
      tl.to(companyText.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: "power4.out",
        stagger: {
          amount: 0.3,
          from: "random"
        }
      });

      // Fade in description
      tl.from(section.querySelector('.meta-info'), {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.5");

      tl.from(section.querySelector('.description'), {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");
    });
  }, []);

  return (
    <section className="min-h-screen py-32 bg-background overflow-hidden" ref={contentRef}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-32 text-center">Experience</h2>

        <div className="space-y-40">
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={el => sectionsRef.current[index] = el}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
            >
              <div>
                <h3 className="company text-7xl md:text-[8rem] font-bold leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                  {exp.company}
                </h3>
                <div className="meta-info mt-6 text-muted-foreground">
                  <p className="text-xl font-medium">{exp.title}</p>
                  <p className="text-sm mt-1">{exp.date}</p>
                </div>
              </div>
              <div className="self-center">
                <p className="description text-xl leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}