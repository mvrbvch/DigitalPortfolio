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
    description: "Spearheaded healthcare solutions development using React, React Native, and Node.js. Implemented best practices in software development, ensuring high-quality deliverables and optimal performance. Led cross-functional teams to create innovative healthcare technology solutions.",
  },
  {
    date: "Jan 2018 — Aug 2021",
    title: "Lead Frontend Engineer",
    company: "Napp Solutions",
    description: "Led teams working on critical systems like Esphera, serving hundreds of Brazilian shopping malls. Implemented TypeScript, Figma workflows, and custom Design Systems. Managed large-scale applications with React, Vue, and Node.js, improving development efficiency and product quality.",
  }
];

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const experiencesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    experiencesRef.current.forEach((expRef, index) => {
      if (!expRef) return;

      const title = new SplitType(expRef.querySelector('.company')!, {
        types: 'chars',
        absolute: false
      });

      const description = new SplitType(expRef.querySelector('.description')!, {
        types: 'words',
        absolute: false
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: expRef,
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
        }
      });

      // Animate company name chars
      tl.fromTo(title.chars, 
        {
          opacity: 0.2,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: {
            amount: 0.2,
            from: "start"
          }
        }
      );

      // Animate description words
      tl.fromTo(description.words,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: {
            amount: 0.3,
            from: "start"
          }
        },
        "<0.1"
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">Experience</h2>
        <div className="space-y-32">
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={el => experiencesRef.current[index] = el}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="order-2 md:order-1">
                <p className="description text-lg text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
              <div className="order-1 md:order-2 text-right">
                <h3 className="company text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                  {exp.company}
                </h3>
                <p className="text-xl text-muted-foreground mb-2">{exp.title}</p>
                <p className="text-sm text-muted-foreground">{exp.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}