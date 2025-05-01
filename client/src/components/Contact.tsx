import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Mail, Phone, Globe, Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ContactGlobe from "./ContactGlobe";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !cardRef.current) return;
    
    // Add ID for navigation
    sectionRef.current.id = "contact";
    
    // Create title animation
    const titleSplit = new SplitType(titleRef.current, { types: 'chars' });
    
    gsap.from(titleSplit.chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.03,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    
    // Create card animation
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    
    // Create links animation
    const links = sectionRef.current.querySelectorAll('.contact-link');
    
    gsap.from(links, {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });
    
    // Create social links animation
    const socialLinks = sectionRef.current.querySelectorAll('.social-link');
    
    gsap.from(socialLinks, {
      opacity: 0,
      scale: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });
    
    // Add hover effect to button
    const button = sectionRef.current.querySelector('.contact-button');
    if (button) {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }
  }, []);
  
  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95 z-0" />
      
      {/* Animated blurry blobs in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] transform translate-x-1/2 -translate-y-1/2 opacity-30">
          <div className="w-full h-full bg-primary/20 rounded-full animate-blob filter blur-3xl" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] transform -translate-x-1/2 translate-y-1/2 opacity-20">
          <div className="w-full h-full bg-purple-500/20 rounded-full animate-blob animation-delay-4000 filter blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
        >
          Get in Touch
        </h2>
        
        <div className="max-w-6xl mx-auto">
          <div
            ref={cardRef} 
            className="glass rounded-xl shadow-xl overflow-hidden perspective transform-gpu"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Contact Info Side */}
              <div className="p-8 md:p-12 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-6 text-primary/90">Contact Information</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="contact-link flex items-center gap-3 hover:translate-x-1 transition-transform">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:matheus@murbach.work" className="hover:text-primary transition-colors">
                      matheus@murbach.work
                    </a>
                  </div>
                  <div className="contact-link flex items-center gap-3 hover:translate-x-1 transition-transform">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:+5535984073125" className="hover:text-primary transition-colors">
                      +55 35 984073125
                    </a>
                  </div>
                  <div className="contact-link flex items-center gap-3 hover:translate-x-1 transition-transform">
                    <Globe className="h-5 w-5 text-primary" />
                    <a href="https://murbach.work" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      murbach.work
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-4">Find me on</h4>
                  <div className="flex gap-4">
                    <a 
                      href="https://github.com/matheusmurbach" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://linkedin.com/in/matheusmurbach" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://twitter.com/matheusmurbach" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* 3D Globe Side */}
              <div className="relative bg-gradient-to-br from-primary/5 to-background">
                <div className="absolute inset-0">
                  <ContactGlobe />
                </div>
                
                <div className="relative p-8 md:p-12 h-full flex flex-col justify-between z-10">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Let's Connect</h3>
                    <p className="text-muted-foreground mb-6">
                      I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                    </p>
                  </div>
                  
                  <Button 
                    asChild 
                    size="lg"
                    className="contact-button button-3d w-full md:w-auto bg-primary/80 hover:bg-primary backdrop-blur-sm"
                  >
                    <a href="mailto:matheus@murbach.work">
                      Send Message
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
