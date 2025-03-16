import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "./ui/card";

gsap.registerPlugin(ScrollTrigger);

interface TimelineProps {
  experiences: {
    date: string;
    title: string;
    company: string;
    description: string;
  }[];
}

export default function Timeline({ experiences }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const cards = timelineRef.current.querySelectorAll(".timeline-card");

    cards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          end: "top center",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  return (
    <div ref={timelineRef} className="relative">
      <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-border" />
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`timeline-card flex ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            } items-center gap-8`}
          >
            <div className="w-1/2">
              <Card className="relative">
                <CardContent className="p-6">
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary
                    ${index % 2 === 0 ? '-right-10' : '-left-10'}"
                  />
                  <time className="text-sm text-muted-foreground">{exp.date}</time>
                  <h3 className="text-xl font-semibold mt-2">{exp.title}</h3>
                  <p className="text-primary font-medium mt-1">{exp.company}</p>
                  <p className="mt-4 text-muted-foreground">{exp.description}</p>
                </CardContent>
              </Card>
            </div>
            <div className="w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
