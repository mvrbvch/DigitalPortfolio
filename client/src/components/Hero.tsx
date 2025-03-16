import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center p-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedText
          text="Matheus Murbach"
          tag="h1"
          className="text-6xl md:text-8xl font-bold mb-6"
        />
        <AnimatedText
          text="Software Engineer"
          tag="h2"
          className="text-2xl md:text-4xl text-muted-foreground mb-8"
          delay={0.5}
        />
        <AnimatedText
          text="Full-Stack Developer | Node.js, TypeScript, React, React Native & AI Enthusiast"
          className="text-lg md:text-xl text-muted-foreground mb-12"
          delay={1}
        />
        <Button
          size="lg"
          className="opacity-0 animate-[fadeIn_0.5s_1.5s_forwards]"
          onClick={() => {
            document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          View My Work
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
