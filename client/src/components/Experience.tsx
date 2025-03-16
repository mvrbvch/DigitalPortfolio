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
    company: "GO.K - One Step Ahead",
    description: "Led development of cutting-edge mobile and e-commerce experiences using React, React Native, and Node.js. Implemented innovative solutions to enhance user engagement and drive business growth through collaborative development and strategic planning.",
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
    description: "Led teams working on critical systems like Esphera, serving hundreds of Brazilian shopping malls. Implemented TypeScript, Figma workflows, and custom Design Systems. Managed large-scale applications with React, Vue, and Node.js.",
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
        types: 'chars',
        absolute: false
      });

      // Create timeline for each section
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center+=100",
          end: "bottom center",
          scrub: 1,
        }
      })
      .fromTo(companyText.chars, 
        {
          opacity: 0.1,
          scale: 0,
          y: gsap.utils.random(-100, 100),
          rotationX: gsap.utils.random(-90, 90),
          transformOrigin: "50% 50% -50",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationX: 0,
          stagger: {
            amount: 0.5,
            from: "random"
          },
          ease: "power4.out",
        }
      );

      // Fade in description with slight delay
      gsap.from(section.querySelector('.description'), {
        scrollTrigger: {
          trigger: section,
          start: "top center+=100",
          end: "bottom center",
          scrub: 1,
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    });
  }, []);

  return (
    <div className="py-32 bg-background" ref={contentRef}>
      <div className="content max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-32 text-center">Experience</h2>

        {experiences.map((exp, index) => (
          <div
            key={index}
            ref={el => sectionsRef.current[index] = el}
            className="content__section mb-64 last:mb-0 grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
          >
            <div className="content__left">
              <h3 className="company text-6xl md:text-8xl font-bold mb-4 leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                {exp.company}
              </h3>
              <div className="mt-4 text-muted-foreground">
                <p className="text-xl font-medium">{exp.title}</p>
                <p className="text-sm">{exp.date}</p>
              </div>
            </div>
            <div className="content__right">
              <p className="description text-xl leading-relaxed text-muted-foreground">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}