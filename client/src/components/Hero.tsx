import AnimatedText from "./AnimatedText";
import { Button } from "./ui/button";
import { ArrowDown, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ThreeBackground from "./ThreeBackground";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Mark as loaded to trigger animations
    setIsLoaded(true);

    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      backgroundColor: "transparent",
      duration: 1.5,
      ease: "power2.inOut"
    });

    gsap.to(".backdrop-blur", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(0, 0, 0, 0.2)"
    });

    // Mouse parallax effect for hero content
    const handleMouseMove = (e: MouseEvent) => {
      const content = containerRef.current?.querySelector('.hero-content');
      if (!content) return;
      
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      gsap.to(content, {
        x: mouseX * 20,
        y: mouseY * 20,
        duration: 1,
        ease: "power2.out"
      });
      
      // Particle movement based on mouse position
      const particles = containerRef.current?.querySelector('.particles-canvas');
      if (particles) {
        gsap.to(particles, {
          x: mouseX * -30,
          y: mouseY * -30,
          duration: 2,
          ease: "power2.out"
        });
      }
    };

    // Animate social links
    if (socialRef.current) {
      const links = socialRef.current.querySelectorAll('.social-link');
      
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
    const decorativeElements = document.querySelectorAll('.hero-decorative-element');
    decorativeElements.forEach((element, index) => {
      gsap.to(element, {
        y: `${Math.sin(index) * 20}px`,
        x: `${Math.cos(index) * 20}px`,
        duration: 3 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
    >
      {/* 3D Particles Background */}
      <div className="particles-canvas">
        <ThreeBackground 
          particleDensity={2000}
          colorScheme="mixed"
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 backdrop-blur bg-gradient-to-b from-transparent to-background/30" />

      {/* Animated gradient orbs - inspired by Sarah Guo Portfolio */}
      <div className="absolute top-1/4 -left-[10vw] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-1/4 -right-[10vw] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-3xl animate-blob"></div>
      
      {/* Decorative elements */}
      <div className="hero-decorative-element absolute top-[15%] left-[10%] w-6 h-6 rounded-full border border-primary/30 opacity-60"></div>
      <div className="hero-decorative-element absolute top-[20%] right-[15%] w-8 h-8 rounded-full border border-purple-500/30 opacity-60"></div>
      <div className="hero-decorative-element absolute bottom-[25%] left-[20%] w-10 h-10 rounded-full border border-blue-500/30 opacity-60"></div>
      <div className="hero-decorative-element absolute bottom-[15%] right-[10%] w-12 h-12 rounded-full border border-primary/30 opacity-60"></div>

      {/* Social media links - inspired by Developer Portfolio Hero */}
      <div 
        ref={socialRef}
        className="fixed left-8 bottom-8 z-50 flex-col gap-6 hidden md:flex"
      >
        <a 
          href="https://github.com/matheusmurbach" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:border-primary hover:text-primary transition-colors duration-300"
        >
          <Github className="w-5 h-5" />
        </a>
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

      <div className="hero-content max-w-5xl mx-auto text-center md:text-left relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-2/3">
          <AnimatedText
            text="Matheus Murbach"
            tag="h1"
            className="text-7xl md:text-[10rem] font-extrabold mb-6 tracking-tight leading-none"
            textStyle="gradient"
            staggerWords={true}
            revealFromDirection="bottom"
            splitOptions={{ types: 'chars, words' }}
            animation={{
              chars: {
                opacity: 0,
                y: 100,
                rotateX: -80,
                stagger: 0.03,
                duration: 1.2,
                ease: "expo.out",
              },
              words: {
                opacity: 0,
                scale: 0.9,
                duration: 1.2,
                stagger: 0.15,
                ease: "expo.out",
              }
            }}
          />

          <AnimatedText
            text="Software Engineer"
            tag="h2"
            className="text-3xl md:text-6xl mb-8 font-light opacity-80 tracking-wide"
            textStyle="outline"
            splitOptions={{ types: 'chars' }}
            staggerWords={true}
            revealFromDirection="right"
            animation={{
              chars: {
                opacity: 0,
                x: 20,
                stagger: 0.02,
                duration: 1,
                ease: "expo.out",
              }
            }}
            delay={0.7}
          />

          <AnimatedText
            text="Full-Stack Developer | Node.js, TypeScript, React, React Native & AI Enthusiast"
            className="text-lg md:text-xl text-muted-foreground mb-16"
            splitOptions={{ types: 'words' }}
            highlightWords={["Node.js", "TypeScript", "React", "AI"]}
            revealFromDirection="bottom"
            animation={{
              words: {
                opacity: 0,
                y: 30,
                stagger: 0.04,
                duration: 0.8,
                ease: "power3.out",
              }
            }}
            delay={1.2}
          />

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <Button
              size="lg"
              className="opacity-0 animate-[fadeIn_0.5s_1.5s_forwards] bg-primary hover:bg-primary/90 
              rounded-full px-8 shadow-[0_0_20px_rgba(249,87,56,0.3)] transition-all duration-500 
              hover:shadow-[0_0_30px_rgba(249,87,56,0.5)] relative overflow-hidden group"
              onClick={() => {
                document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="relative z-10">View My Work</span>
              <ArrowDown className="ml-2 h-4 w-4 relative z-10" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#F95738] via-[#EE964B] to-[#F4D35E] opacity-0 
              group-hover:opacity-100 transition-opacity duration-500"></span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="opacity-0 animate-[fadeIn_0.5s_1.7s_forwards] 
              border-2 border-primary/40 hover:border-primary text-primary hover:text-primary/90
              backdrop-blur-sm rounded-full px-8 transition-all duration-500 relative overflow-hidden group"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="relative z-10">Contact Me</span>
              <ExternalLink className="ml-2 h-4 w-4 relative z-10" />
              <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 
              transition-transform duration-500 origin-left"></span>
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
    'React', 'Node.js', 'TypeScript',
    'Three.js', 'GSAP'
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
            <div className="flex items-center gap-2 text-xs text-primary">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              Passionate about building digital experiences
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 animate-[fadeIn_0.5s_2s_forwards]">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 mb-2 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
        <span className="text-xs text-muted-foreground">Scroll Down</span>
      </div>
    </section>
  );
}