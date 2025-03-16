import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

interface AnimationOptions {
  chars?: gsap.TweenVars;
  words?: gsap.TweenVars;
  lines?: gsap.TweenVars;
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  delay?: number;
  splitOptions?: {
    types: string;
  };
  animation?: AnimationOptions;
}

export default function AnimatedText({ 
  text, 
  className = "", 
  tag: Tag = "h1",
  delay = 0,
  splitOptions = { types: 'chars' },
  animation
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const splitTextRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    splitTextRef.current = new SplitType(textRef.current, splitOptions);
    const split = splitTextRef.current;

    const tl = gsap.timeline({ delay });

    if (animation?.chars && split.chars) {
      tl.from(split.chars, {
        ...animation.chars,
      });
    }

    if (animation?.words && split.words) {
      tl.from(split.words, {
        ...animation.words,
      }, "<0.2");
    }

    if (animation?.lines && split.lines) {
      tl.from(split.lines, {
        ...animation.lines,
      }, "<0.2");
    }

    // If no custom animation is provided, use default
    if (!animation) {
      tl.from(split.chars || split.words || [], {
        opacity: 0,
        y: 50,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    }

    return () => {
      splitTextRef.current?.revert();
    };
  }, [delay, animation, splitOptions]);

  return (
    <Tag ref={textRef} className={className}>
      {text}
    </Tag>
  );
}