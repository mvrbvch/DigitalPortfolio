import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "./ui/card";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "JavaScript", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "Python", category: "Languages" },
  { name: "Ruby", category: "Languages" },
  { name: "PHP", category: "Languages" },
  { name: "React", category: "Frontend" },
  { name: "React Native", category: "Mobile" },
  { name: "Node.js", category: "Backend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Three.js", category: "Graphics" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "GCP", category: "Cloud" }
];

export default function Skills() {
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!skillsRef.current) return;

    const cards = skillsRef.current.querySelectorAll(".skill-card");

    gsap.from(cards, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: skillsRef.current,
        start: "top center+=100",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">Skills</h2>
        <div
          ref={skillsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {skills.map((skill, index) => (
            <Card
              key={index}
              className="skill-card hover:scale-105 transition-transform duration-200"
            >
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{skill.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
