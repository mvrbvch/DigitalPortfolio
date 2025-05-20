import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { ArrowDown, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ThreeBackground from "./ThreeBackground";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Mark as loaded to trigger animations
    setIsLoaded(true);

    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      duration: 1.5,
      ease: "power2.inOut",
    });

    gsap.to(".backdrop-blur", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      backdropFilter: "blur(3px)",
    });

    // Mouse parallax effect for hero content
    const handleMouseMove = (e: MouseEvent) => {
      const content = containerRef.current?.querySelector(".hero-content");
      if (!content) return;

      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      gsap.to(content, {
        x: mouseX * 20,
        y: mouseY * 20,
        duration: 1,
        ease: "power2.out",
      });

      window.addEventListener("mousemove", handleMouseMove);

      // Particle movement based on mouse position
      const particles =
        containerRef.current?.querySelector(".particles-canvas");
      if (particles) {
        gsap.to(particles, {
          x: mouseX * -30,
          y: mouseY * -30,
          duration: 2,
          ease: "power2.out",
        });
      }
    };

    // Animate social links
    if (socialRef.current) {
      const links = socialRef.current.querySelectorAll(".social-link");

      gsap.from(links, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        delay: 1.8,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }

    // Floating animation for decorative elements
    const decorativeElements = document.querySelectorAll(
      ".hero-decorative-element"
    );
    decorativeElements.forEach((element, index) => {
      gsap.to(element, {
        y: `${Math.sin(index) * 20}px`,
        x: `${Math.cos(index) * 20}px`,
        duration: 3 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden "
    >
      <div
        ref={socialRef}
        className="fixed left-8 bottom-8 z-50 flex-col gap-6 hidden md:flex"
      >
        {/* <a
          href="https://github.com/matheusmurbach"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:border-primary hover:text-primary transition-colors duration-300"
        >
          <Github className="w-5 h-5" />
        </a> */}
        <a
          href="https://linkedin.com/in/matheusmurbach"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:border-primary hover:text-primary transition-colors duration-300"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="mailto:matheus@murbach.work"
          className="social-link w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:border-primary hover:text-primary transition-colors duration-300"
        >
          <Mail className="w-5 h-5" />
        </a>
        <div className="w-px h-24 bg-muted/50 mx-auto"></div>
      </div>

      <div className="hero-content  mx-auto text-center md:text-left relative z-10 flex flex-col md:flex-row items-center">
        <div className="w-full">
          <AnimatedText
            text="murbach.work"
            tag="h1"
            className="text-4xl md:text-[5rem] font-extrabold mb-6 "
            textStyle="normal"
            splitOptions={{ types: "chars, words" }}
            // Using the new Codrops effect style
            // The 3D text appear effect with staggered animation from bottom to top
          />

          <div className="mb-8">
            <AnimatedText
              text="Software Engineer"
              tag="h2"
              className="text-2xl md:text-4xl font-light opacity-100 tracking-wide mb-2"
              splitOptions={{ types: "chars" }}
              delay={0.7}
              // Using the outline style with the Codrops effect
            />
            <div className="text-xl md:text-1xl opacity-1 animate-[fadeIn_0.5s_1.5s_forwards]">
              <span className="">Creative Development</span>
            </div>
          </div>

          <AnimatedText
            text="Full-Stack Developer | Node.js, TypeScript, React, React Native & AI Enthusiast"
            className="text-lg md:text-xl mb-16"
            splitOptions={{ types: "words" }}
            highlightWords={["Node.js", "TypeScript", "React", "Native", "AI"]}
            revealFromDirection="bottom"
            textStyle="normal"
            animation={{
              words: {
                opacity: 0,
                y: 30,
                stagger: 0.04,
                duration: 0.8,
                ease: "power3.out",
              },
            }}
            delay={1.2}
          />

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <Button
              size="lg"
              className="opacity-1 animate-[fadeIn_0.5s_1.5s_forwards] bg-gradient-to-r from-[#b300ff] via-[#ed4aff] to-[#9bf1fb] 
              rounded-full px-8 shadow-[0_0_20px_rgba(249,87,56,0.3)] transition-all duration-500 
              hover:shadow-[0_0_30px_rgba(249,87,56,0.5)] relative overflow-hidden group"
              onClick={() => {
                document
                  .getElementById("experience")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="relative z-10">View My Work</span>
              <ArrowDown className="ml-2 h-4 w-4 relative z-10" />
              <span
                className="absolute inset-0 bg-gradient-to-r from-[#9bf1fb] via-[#ed4aff] to-[#b300ff] opacity-0 
              group-hover:opacity-100 transition-opacity duration-500"
              ></span>
            </Button>

            <Button
              size="lg"
              className="opacity-1 animate-[fadeIn_0.5s_1.5s_forwards] bg-gradient-to-r from-[#ed4aff] via-[#b300ff] to-[#9bf1fb] 
              rounded-full px-8 shadow-[0_0_20px_rgba(249,87,56,0.3)] transition-all duration-500 
              hover:shadow-[0_0_30px_rgba(249,87,56,0.5)] relative overflow-hidden group"
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="relative z-10">Open to work</span>
              <ExternalLink className="ml-2 h-4 w-4 relative z-10" />
              <span
                className="absolute inset-0 bg-gradient-to-r from-[#9bf1fb] via-[#ed4aff] to-[#b300ff] opacity-0 
              group-hover:opacity-100 transition-opacity duration-500"
              ></span>
            </Button>
          </div>
        </div>

        {/* Decorative code snippets - inspired by Developer Portfolio design */}
        <div className="md:w-1/3 hidden md:block relative mt-8 md:mt-0">
          <div className="glass p-6 rounded-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <pre className="text-xs text-muted-foreground/80">
              <code>
                {`function Developer() {
  const [skills, setSkills] = useState([
    'React', 'Nest.js', 'React Native', 
    'Node.js', 'Next.js', 'Vue.js', 'TypeScript',
    'Three.js', 'MongoDB', 'MySQL', 'PostgreSQL'
  ]);
  
  return (
    <Portfolio 
      name="Matheus Murbach"
      role="Software Engineer"
      passion="Creating amazing web 
              experiences" 
    />
  );
}`}
              </code>
            </pre>
          </div>

          <div className="glass p-4 rounded-xl absolute -bottom-4 -left-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-2 text-xs text-white">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              Passionate about building digital experiences
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-1 animate-[fadeIn_0.5s_2s_forwards]">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 mb-2 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
        <span className="text-xs text-muted-foreground">Scroll Down</span>
      </div>
    </section>
  );
}
