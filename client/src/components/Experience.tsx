import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ThreeDCube from "./ThreeDCube";
import RotatingText from "./RotatingText";

gsap.registerPlugin(ScrollTrigger);

// Updated with information from your current website
const experiences = [
  {
    title: "murbach.work/",
    date: "2022 - Present",
    description: "Independent software engineering consultancy providing professional services with focus on efficient results. Working with clients across various industries to deliver high-quality web and mobile solutions.",
    skills: ["React", "Node.js", "TypeScript", "React Native", "Three.js", "WebGL"],
    project: {
      name: "Agência Virtual Revamp",
      description: "Complete redesign and development of an agency's virtual platform, improving user experience and adding new features.",
      tech: "React, Next.js, TailwindCSS"
    }
  },
  {
    title: "GO.K/",
    date: "2020 - 2022",
    description: "Led development of cutting-edge mobile and e-commerce experiences for major brands. Designed and implemented scalable architectures for high-traffic e-commerce platforms.",
    skills: ["React", "React Native", "Node.js", "AWS", "Firebase", "CI/CD"],
    project: {
      name: "Multi-vendor Marketplace Platform",
      description: "Built a complete marketplace solution enabling multiple sellers to reach customers through a unified platform.",
      tech: "React Native, Node.js, PostgreSQL"
    }
  },
  {
    title: "RD Saúde/",
    date: "2018 - 2020",
    description: "Spearheaded healthcare solutions development for one of Brazil's leading healthcare providers. Created solutions to improve patient care and streamline medical operations.",
    skills: ["React", "React Native", "Node.js", "MongoDB", "GraphQL", "Docker"],
    project: {
      name: "Telemedicine Platform",
      description: "Developed a complete telemedicine solution allowing patients to consult with doctors remotely.",
      tech: "React, Node.js, WebRTC, Socket.io"
    }
  },
  {
    title: "Napp Solutions/",
    date: "2015 - 2018",
    description: "Led teams working on critical systems like Esphera, serving hundreds of Brazilian shopping malls. Managed development cycles and coordinated with stakeholders to ensure successful delivery.",
    skills: ["JavaScript", "PHP", "MySQL", "jQuery", "Frontend Development", "Team Leadership"],
    project: {
      name: "Esphera Mall Management",
      description: "Shopping mall management platform serving over 200 malls across Brazil, handling operations, tenant management, and financial tracking.",
      tech: "PHP, MySQL, JavaScript, jQuery"
    }
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
      
      // Animate project cards
      const projectCard = section.querySelector('.project-card');
      if (projectCard) {
        gsap.from(projectCard, {
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            toggleActions: "play none none reverse",
          }
        });
      }
    });
    
    // Parallax effect for background elements
    const decorativeElements = document.querySelectorAll('.parallax-element');
    decorativeElements.forEach((element) => {
      gsap.to(element, {
        y: () => Math.random() * 100 - 50,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    });
  }, []);

  return (
    <section className="min-h-screen py-20 relative overflow-hidden" ref={contentRef}>
      {/* Background decoration - inspired by your current site */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      
      {/* Decorative elements */}
      <div className="parallax-element absolute top-20 left-20 w-32 h-32 rounded-full border border-primary/20 opacity-30" />
      <div className="parallax-element absolute bottom-40 right-10 w-40 h-40 rounded-full border border-primary/10 opacity-20" />
      <div className="parallax-element absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-primary/5 blur-xl" />
      
      {/* Rotating text - inspired by Sarah Guo Portfolio */}
      <RotatingText 
        text="EXPERIENCE • PROJECTS • SKILLS • "
        className="w-[300px] h-[300px] top-32 right-10 hidden lg:flex"
        speed={30}
      />
      
      {/* 3D Cube displayed at the side */}
      <div className="absolute right-10 top-[40%] w-[250px] h-[250px] hidden lg:block">
        <ThreeDCube className="w-full h-full" />
      </div>

      <div className="max-w-6xl mx-auto px-8">
        <h2 className="section-title text-4xl md:text-5xl font-bold mb-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#13B0F5] to-[#E70FAA]">
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
                {/* Left side - Title and date */}
                <div className="lg:w-1/2">
                  <h2 className="title text-[5rem] md:text-[7rem] font-mono leading-[0.9] tracking-tight">
                    {exp.title}
                  </h2>
                  <p className="animate-content text-xl text-primary/90 font-semibold mt-4">{exp.date}</p>
                  
                  {/* Project card - inspired by your site */}
                  <div className="project-card glass mt-8 p-6 rounded-xl border border-primary/10 transform hover:scale-105 transition-transform duration-500">
                    <h4 className="text-xl font-semibold mb-2 text-primary/90">
                      Featured Project: {exp.project.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exp.project.description}
                    </p>
                    <div className="text-xs inline-block px-3 py-1 rounded-full bg-muted/50 text-primary/90">
                      {exp.project.tech}
                    </div>
                  </div>
                </div>
                
                {/* Right side - Description and skills */}
                <div className="lg:w-1/2 self-start space-y-6 lg:pl-8 lg:border-l border-muted/20">
                  <p className="animate-content text-xl text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex} 
                        className="skill-tag px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
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