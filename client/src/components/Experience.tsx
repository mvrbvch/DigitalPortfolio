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
    date: "2013 - Present",
    description:
      "Independent software engineering consultancy delivering high-performance web and mobile solutions tailored to client needs.",
    skills: ["React", "Node.js", "TypeScript", "React Native", "UX", "DevOps"],
    project: {
      name: "Nós Juntos - Smart Couple App",
      link: "https://nosjuntos.online",
      description:
        "Smart mobile app for couples, combining a shared calendar, task management, AI-generated insights, and emotional connection tools to enhance daily communication and relationship harmony.",
      tech: "React Native, Node.js, Generative AI, LLM, TypeScript",
    },
  },
  {
    title: "GO.K - One Step Ahead",
    date: "2023 - 2024",
    description:
      "External consultant at RD Saúde, delivering e-commerce and mobile experiences using React and Node.js.",
    skills: ["React", "React Native", "Node.js", "TypeScript"],
    project: {
      name: "Healthcare E-commerce System",
      description:
        "Developed scalable mobile and web solutions for healthcare product sales and services.",
      tech: "React, React Native, Node.js",
    },
  },
  {
    title: "RD Saúde",
    date: "2023 - 2024",
    description:
      "Delivered robust healthcare-focused solutions as a senior external developer for mobile and web.",
    skills: ["React", "React Native", "Node.js", "TypeScript"],
    project: {
      name: "Mobile Patient Portal",
      description:
        "Built a patient-focused portal with e-commerce features for health products.",
      tech: "React Native, Node.js",
    },
  },
  {
    title: "Loja do Mecânico",
    date: "2022",
    description:
      "Improved e-commerce platform performance and usability through frontend enhancements.",
    skills: ["React", "Next.js", "UX"],
    project: {
      name: "Performance Optimization",
      description: "Enhanced UI and load times on e-commerce storefront.",
      tech: "React, Next.js",
    },
  },
  {
    title: "Eyemobile Technologies",
    date: "2022",
    description:
      "Contributed to mobile application development with a focus on performance and scalability.",
    skills: ["React Native", "Flutter"],
    project: {
      name: "Mobile App Suite",
      description:
        "Built cross-platform apps targeting Latin American markets.",
      tech: "Flutter, React Native",
    },
  },
  {
    title: "Mobly",
    date: "2021 - 2022",
    description:
      "Developed frontend features and improved UI for major furniture e-commerce platform.",
    skills: ["React", "Vue", "UX"],
    project: {
      name: "Furniture Shop UI",
      description:
        "Led frontend improvements with emphasis on responsive design.",
      tech: "Vue.js, React",
    },
  },
  {
    title: "Napp Solutions",
    date: "2018 - 2021",
    description:
      "Led frontend team, implemented Design System, and optimized UX in enterprise systems.",
    skills: ["React", "TypeScript", "Figma", "UX"],
    project: {
      name: "O2O Platform",
      description:
        "Integrated retail inventories with Google services and social media.",
      tech: "React, Node.js, TypeScript",
    },
  },

  {
    title: "Fillet",
    date: "2014 - 2016",
    description:
      "Built interactive interfaces and apps for high-profile brands using React and GSAP.",
    skills: ["React", "GSAP", "UX", "Ruby on Rails"],
    project: {
      name: "Brand Campaign Interfaces",
      description:
        "Developed frontends for campaigns for brands like Itaú and Jack Daniel’s.",
      tech: "React, GSAP, PHP",
    },
  },
  {
    title: "Kenoby (now Gupy)",
    date: "2015",
    description:
      "Helped develop ATS platform; improved UX and branding, contributing to its market success.",
    skills: ["JavaScript", "UX", "React", "Design System"],
    project: {
      name: "Kenoby by Havik",
      description:
        "Created intuitive recruiting platform, later acquired by Gupy.",
      tech: "React, Node.js",
    },
  },
  {
    title: "Jurema",
    date: "2013 - 2014",
    description:
      "Worked on pioneering platforms like Arco (Instagram shopping) and Rico (investments).",
    skills: ["JavaScript", "UX", "Ruby", "PHP"],
    project: {
      name: "Arco / Rico / Arkpad",
      description:
        "Built early social commerce and finance tools with high usability focus.",
      tech: "AngularJS, Ruby, PHP, JavaScript",
    },
  },
];

export default function Experience() {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;

    // Add ID to the section for navigation
    contentRef.current.id = "experience";

    // Animation for the section title
    const titleEl = contentRef.current.querySelector(
      ".section-title"
    ) as HTMLElement;
    if (titleEl) {
      const split = new SplitType(titleEl, { types: "chars" });

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

      const titleEl = section.querySelector(".title") as HTMLElement;
      const split = new SplitType(titleEl, { types: "chars" });

      // Reset chars position
      gsap.set(split.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
      });

      // Create scroll animation for title
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        })
        .to(split.chars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: {
            amount: 0.3,
            from: "random",
          },
          ease: "power4.out",
        });

      // Animate content elements
      const contentElements = section.querySelectorAll(".animate-content");
      contentElements.forEach((element, i) => {
        gsap.from(element, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Animate skills tags with stagger
      const skillsElements = section.querySelectorAll(".skill-tag");
      gsap.from(skillsElements, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate project cards
      const projectCard = section.querySelector(".project-card");
      if (projectCard) {
        gsap.from(projectCard, {
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });

    // Parallax effect for background elements
    const decorativeElements = document.querySelectorAll(".parallax-element");
    decorativeElements.forEach((element) => {
      gsap.to(element, {
        y: () => Math.random() * 100 - 50,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
  }, []);

  return (
    <section
      className="min-h-screen py-20 relative overflow-hidden"
      ref={contentRef}
    >
      {/* Background decoration - inspired by your current site */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      {/* Decorative elements */}
      <div className="parallax-element absolute top-20 left-20 w-32 h-32 rounded-full border border-primary/20 opacity-30" />
      <div className="parallax-element absolute bottom-40 right-10 w-40 h-40 rounded-full border border-primary/10 opacity-20" />
      <div className="parallax-element absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-primary/5 blur-xl" />

      {/* Rotating text - inspired by Sarah Guo Portfolio */}

      {/* 3D Cube displayed at the side */}

      <div className="max-w-6xl mx-auto px-8">
        <h2 className="section-title text-4xl md:text-5xl font-bold mb-20 text-center">
          Professional Experience
        </h2>

        <div className="space-y-32">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="section relative"
              ref={(el) => {
                if (el) sectionRefs.current[index] = el;
              }}
            >
              {/* Timeline connector */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary/80 shadow-glow animate-pulse" />

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side - Title and date */}
                <div className="lg:w-1/2">
                  <h2 className="title text-[1rem] md:text-[3rem] font-mono leading-[0.9] tracking-tight text-foreground opacity-100">
                    {exp.title}
                  </h2>
                  <p className="animate-content text-xl text-white/90 font-semibold mt-4">
                    {exp.date}
                  </p>

                  {/* Project card - inspired by your site */}
                  <div className="project-card glass mt-8 p-6 rounded-xl border border-primary/10 transform hover:scale-105 transition-transform duration-500">
                    <h4 className="text-xl font-semibold mb-2 text-white/90">
                      Featured Project: {exp.project.name}{" "}
                      {exp.project.link ? (
                        <a
                          href={exp.project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs hover:underline"
                        >
                          View Project
                        </a>
                      ) : null}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exp.project.description}
                    </p>
                    <div className="text-xs inline-block px-3 py-1 rounded-full bg-muted/50 text-white/90">
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
                        className="skill-tag px-3 py-1 rounded-full bg-primary/10 text-white text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
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
