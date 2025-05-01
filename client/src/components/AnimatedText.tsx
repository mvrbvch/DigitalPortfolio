import { useEffect, useRef, useState } from "react";
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
  splitOptions?: any; // Using any temporarily to fix type issues
  animation?: AnimationOptions;
  highlightWords?: string[];
  textStyle?: 'gradient' | 'accent' | 'outline' | 'normal';
  staggerWords?: boolean;
  revealFromDirection?: 'bottom' | 'left' | 'right' | 'top' | 'none';
}

export default function AnimatedText({ 
  text, 
  className = "", 
  tag: Tag = "h1",
  delay = 0,
  splitOptions = { types: 'chars' },
  animation,
  highlightWords = [],
  textStyle = 'normal',
  staggerWords = false,
  revealFromDirection = 'bottom'
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const splitTextRef = useRef<SplitType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Create text style based on the textStyle prop
  const getTextStyles = () => {
    switch(textStyle) {
      case 'gradient':
        return {
          backgroundImage: 'linear-gradient(to right, #3b82f6, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        };
      case 'accent':
        return {
          color: '#3b82f6'
        };
      case 'outline':
        return {
          WebkitTextStroke: '1px rgba(59, 130, 246, 0.5)',
          color: 'transparent'
        };
      default:
        return {};
    }
  };
  
  // Convert revealFromDirection to animation properties
  const getDirectionalProperties = () => {
    switch(revealFromDirection) {
      case 'top':
        return { y: -80, rotationX: 20 };
      case 'bottom':
        return { y: 80, rotationX: -20 };
      case 'left':
        return { x: -80, rotationY: 20 };
      case 'right':
        return { x: 80, rotationY: -20 };
      case 'none':
        return { scale: 0.9, opacity: 0 };
      default:
        return { y: 50, rotationX: -90 };
    }
  };

  useEffect(() => {
    if (!textRef.current) return;
    
    // Make text visible for animation
    setIsVisible(true);

    splitTextRef.current = new SplitType(textRef.current, splitOptions);
    const split = splitTextRef.current;
    
    // Build timeline with Federico Pian style animations
    const tl = gsap.timeline({ delay });
    
    // Add perspective to parent for 3D animations
    gsap.set(textRef.current, { perspective: 1000 });
    
    // Highlight specific words if needed
    if (highlightWords.length > 0 && split.words) {
      split.words.forEach(word => {
        const wordText = word.textContent?.trim().toLowerCase();
        if (wordText && highlightWords.some(hw => wordText.includes(hw.toLowerCase()))) {
          gsap.set(word, {
            color: '#3b82f6',
            fontWeight: '700'
          });
        }
      });
    }
    
    // Get directional properties for animations
    const directionalProps = getDirectionalProperties();
    
    if (staggerWords && split.words && splitOptions.types.includes('words')) {
      // Staggered word animation (Federico Pian style)
      tl.from(split.words, {
        opacity: 0,
        ...directionalProps,
        duration: 1.2,
        stagger: 0.08,
        ease: "expo.out",
      });
    } else {
      // Standard animation flow
      if (animation?.chars && split.chars) {
        tl.from(split.chars, {
          opacity: 0,
          ...directionalProps,
          stagger: 0.02,
          duration: 0.8,
          ease: "back.out(1.7)",
          ...animation.chars,
        });
      }

      if (animation?.words && split.words) {
        tl.from(split.words, {
          opacity: 0,
          ...directionalProps,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          ...animation.words,
        }, "<0.2");
      }

      if (animation?.lines && split.lines) {
        tl.from(split.lines, {
          opacity: 0,
          ...directionalProps,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          ...animation.lines,
        }, "<0.2");
      }

      // If no custom animation is provided, use default
      if (!animation) {
        tl.from(split.chars || split.words || [], {
          opacity: 0,
          ...directionalProps,
          stagger: 0.02,
          duration: 0.8,
          ease: "back.out(1.7)",
        });
      }
    }
    
    // Add a subtle hover effect if it's a heading
    if (Tag === 'h1' || Tag === 'h2' || Tag === 'h3') {
      if (textRef.current) {
        textRef.current.addEventListener('mouseenter', () => {
          if (split.chars) {
            gsap.to(split.chars, {
              y: -5,
              stagger: 0.01,
              duration: 0.3,
              ease: "power2.out",
              overwrite: true
            });
          }
        });
        
        textRef.current.addEventListener('mouseleave', () => {
          if (split.chars) {
            gsap.to(split.chars, {
              y: 0,
              stagger: 0.01,
              duration: 0.3,
              ease: "power2.out",
              overwrite: true
            });
          }
        });
      }
    }

    return () => {
      splitTextRef.current?.revert();
      if (textRef.current) {
        textRef.current.removeEventListener('mouseenter', () => {});
        textRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, [delay, animation, splitOptions, highlightWords, staggerWords, revealFromDirection]);

  return (
    <Tag 
      ref={textRef} 
      className={`${className} animated-text-element`}
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        ...getTextStyles()
      }}
    >
      {text}
    </Tag>
  );
}