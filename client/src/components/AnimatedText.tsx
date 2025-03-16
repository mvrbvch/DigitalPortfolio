import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

interface AnimatedTextProps {
  text: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  delay?: number;
}

export default function AnimatedText({ 
  text, 
  className = "", 
  tag: Tag = "h1",
  delay = 0 
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const splitText = new SplitType(textRef.current, { types: 'chars' });

    gsap.from(splitText.chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.02,
      delay,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    return () => {
      splitText.revert();
    };
  }, [delay]);

  return (
    <Tag ref={textRef} className={className}>
      {text}
    </Tag>
  );
}