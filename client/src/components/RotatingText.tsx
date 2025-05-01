import { useEffect, useRef } from "react";
import gsap from "gsap";

interface RotatingTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function RotatingText({
  text,
  className = "",
  speed = 20,
}: RotatingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Create text elements
    const charCount = 50; // Number of characters to create
    const angleStep = (Math.PI * 2) / charCount;

    // Remove any existing children
    while (textRef.current.firstChild) {
      textRef.current.removeChild(textRef.current.firstChild);
    }

    // Create char elements
    for (let i = 0; i < charCount; i++) {
      const charElem = document.createElement("span");
      charElem.classList.add("rotating-text-char");
      charElem.style.position = "absolute";
      charElem.style.transformOrigin = "center";
      charElem.style.width = "20px";
      charElem.style.height = "20px";
      charElem.style.display = "flex";
      charElem.style.justifyContent = "center";
      charElem.style.alignItems = "center";

      // Calculate which character to use from text
      const charIndex = i % text.length;
      charElem.textContent = text[charIndex];

      // Position char in a circle
      const angle = i * angleStep;
      const radius = containerRef.current.clientWidth / 2 - 20; // Adjust for size of chars

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Set position
      charElem.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;

      textRef.current.appendChild(charElem);
    }

    // Animate rotation
    gsap.to(textRef.current, {
      rotation: 360,
      duration: 100 / speed, // Adjust speed
      repeat: -1,
      ease: "none",
    });

    // Handle mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Adjust rotation speed based on mouse position
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = rect.width / 2;
      const speedModifier = 1 + (distance / maxDistance) * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [text, speed]);

  return (
    <div
      ref={containerRef}
      className={`rotating-text-container relative w-48 h-48 ${className}`}
    >
      <div ref={textRef} className="rotating-text-ring absolute inset-0" />
    </div>
  );
}
