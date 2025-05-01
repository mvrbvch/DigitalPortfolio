import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RotatingTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function RotatingText({ text, className = '', speed = 20 }: RotatingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Create a copy of the text element to create a continuous flow
    const container = containerRef.current;
    const textContent = text.split('').map(char => 
      `<span class="inline-block transform hover:scale-125 hover:text-primary transition-all duration-200">${char}</span>`
    ).join('');
    
    // Set initial content
    textRef.current.innerHTML = textContent;
    
    // Create animation
    const tl = gsap.timeline({ repeat: -1 });
    
    // Rotate the text
    tl.to(container, {
      rotation: 360, 
      duration: speed, 
      ease: "linear"
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [text, speed]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute rounded-full flex items-center justify-center ${className}`}
    >
      <span 
        ref={textRef} 
        className="text-xs text-muted-foreground tracking-widest uppercase"
      ></span>
    </div>
  );
}