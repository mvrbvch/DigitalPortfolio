import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ThreeDCube from "./ThreeDCube";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: "murbach.work/",
    date: "2022 - Present",
    description: "Independent software engineering consultancy providing professional services with focus on efficient results.",
    skills: ["React", "Node.js", "TypeScript", "React Native", "Three.js", "WebGL"]
  },
  {
    title: "GO.K/",
    date: "2020 - 2022",
    description: "Led development of cutting-edge mobile and e-commerce experiences using React, React Native, and Node.js.",
    skills: ["React", "React Native", "Node.js", "AWS", "Firebase", "CI/CD"]
  },
  {
    title: "RD Saúde/",
    date: "2018 - 2020",
    description: "Spearheaded healthcare solutions development using React, React Native, and Node.js.",
    skills: ["React", "React Native", "Node.js", "MongoDB", "GraphQL", "Docker"]
  },
  {
    title: "Napp Solutions/",
    date: "2015 - 2018",
    description: "Led teams working on critical systems like Esphera, serving hundreds of Brazilian shopping malls.",
    skills: ["JavaScript", "PHP", "MySQL", "jQuery", "Frontend Development", "Team Leadership"]
  }
];

export default function Experience() {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;

    // Add ID to the section for navigation
    contentRef.current.id = "experience";

    // Animation for the section title
    const titleEl = contentRef.current.querySelector('.section-title') as HTMLElement;
    if (titleEl) {
      const split = new SplitType(titleEl, { types: 'chars' });
      
      gsap.from(split.chars, {
        opacity: 0,
        y: 100,
        stagger: 0.05,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: titleEl,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });
    }

    // Animations for each experience section
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;
      
      const titleEl = section.querySelector('.title') as HTMLElement;
      const split = new SplitType(titleEl, { types: 'chars' });

      // Reset chars position
      gsap.set(split.chars, {
        opacity: 0.2,
        y: () => gsap.utils.random(-100, 100),
        rotateX: () => gsap.utils.random(-90, 90),
      });

      // Create scroll animation for title
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
      });

      // Animate content elements
      const contentElements = section.querySelectorAll('.animate-content');
      contentElements.forEach((element, i) => {
        gsap.from(element, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }
        });
      });

      // Animate skills tags with stagger
      const skillsElements = section.querySelectorAll('.skill-tag');
      gsap.from(skillsElements, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        }
      });
    });
  }, []);

  return (
    <section className="min-h-screen py-20 relative overflow-hidden" ref={contentRef}>
      {/* Background decoration - vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      
      {/* 3D Cube displayed at the side */}
      <div className="absolute right-10 top-40 w-[300px] h-[300px] hidden lg:block">
        <ThreeDCube className="w-full h-full" />
      </div>

      <div className="max-w-6xl mx-auto px-8">
        <h2 className="section-title text-4xl md:text-5xl font-bold mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Professional Experience
        </h2>
        
        <div className="space-y-32">
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className="section relative"
              ref={el => { if (el) sectionRefs.current[index] = el; }}
            >
              {/* Timeline connector */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary/80 shadow-glow animate-pulse" />
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                  <h2 className="title text-[5rem] md:text-[8rem] font-mono leading-[0.9] tracking-tight">
                    {exp.title}
                  </h2>
                  <p className="animate-content text-xl text-primary/90 font-semibold mt-4">{exp.date}</p>
                </div>
                <div className="lg:w-1/3 self-end space-y-6">
                  <p className="animate-content text-xl text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex} 
                        className="skill-tag px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}