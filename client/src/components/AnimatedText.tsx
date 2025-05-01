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
  textStyle?: "gradient" | "accent" | "outline" | "normal";
  staggerWords?: boolean;
  revealFromDirection?: "bottom" | "left" | "right" | "top" | "none";
}

export default function AnimatedText({
  text,
  className = "",
  tag: Tag = "h1",
  delay = 0,
  splitOptions = { types: "chars" },
  animation,
  highlightWords = [],
  textStyle = "normal",
  staggerWords = false,
  revealFromDirection = "bottom",
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const splitTextRef = useRef<SplitType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Create text style based on the textStyle prop
  const getTextStyles = () => {
    switch (textStyle) {
      case "gradient":
        return {
          backgroundImage:
            "linear-gradient(90deg, #13B0F5 -2.06%, #E70FAA 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "rgba(231, 15, 170, 1)",
        };
      case "accent":
        return {
          color: "#E70FAA",
          textShadow: "0 0 15px rgba(231, 15, 170, 0.4)",
        };
      case "outline":
        return {
          WebkitTextStroke: "1px rgba(19, 176, 245, 0.7)",
          color: "transparent",
          textShadow: "0 0 15px rgba(19, 176, 245, 0.3)",
        };
      default:
        return {};
    }
  };

  // Convert revealFromDirection to animation properties
  const getDirectionalProperties = () => {
    switch (revealFromDirection) {
      case "top":
        return { y: -80, rotationX: 20 };
      case "bottom":
        return { y: 80, rotationX: -20 };
      case "left":
        return { x: -80, rotationY: 20 };
      case "right":
        return { x: 80, rotationY: -20 };
      case "none":
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
      split.words.forEach((word) => {
        const wordText = word.textContent?.trim().toLowerCase();
        if (
          wordText &&
          highlightWords.some((hw) => wordText.includes(hw.toLowerCase()))
        ) {
          gsap.set(word, {
            color: "#13B0F5", // Usando a cor ciano da sua paleta
            fontWeight: "700",
            textShadow: "0 0 10px rgba(19, 176, 245, 0.4)", // Adicionando brilho sutil
          });
        }
      });
    }

    // Get directional properties for animations
    const directionalProps = getDirectionalProperties();

    // Codrops text effect style animation
    if (split.chars && (textStyle === "gradient" || textStyle === "outline")) {
      // Apply 3D perspective
      gsap.set(textRef.current, {
        perspective: 1000,
        transformStyle: "preserve-3d",
      });

      // Set initial state for all characters
      gsap.set(split.chars, {
        opacity: 0,
        y: 100,
        rotationX: -90,
        transformOrigin: "50% 50% -20px",
      });

      // Animate each character with staggered delay
      tl.to(split.chars, {
        duration: 1.2,
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: {
          each: 0.02,
          from: "start",
        },
        ease: "power4.out",
      });

      // Add hover effect to each character
      if (Tag === "h1" || Tag === "h2") {
        split.chars.forEach((char) => {
          char.addEventListener("mouseenter", () => {
            gsap.to(char, {
              y: -10,
              rotationX: 10,
              scale: 1.1,
              color: textStyle === "gradient" ? undefined : "#E70FAA",
              duration: 0.4,
              ease: "back.out(2)",
              overwrite: true,
            });
          });

          char.addEventListener("mouseleave", () => {
            gsap.to(char, {
              y: 0,
              rotationX: 0,
              scale: 1,
              color: textStyle === "gradient" ? undefined : "inherit",
              duration: 0.4,
              ease: "power2.out",
              overwrite: true,
            });
          });
        });
      }
    }
    // Regular animation flows
    else if (
      staggerWords &&
      split.words &&
      splitOptions.types.includes("words")
    ) {
      // Staggered word animation
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
        tl.from(
          split.words,
          {
            opacity: 0,
            ...directionalProps,
            stagger: 0.05,
            duration: 0.8,
            ease: "power3.out",
            ...animation.words,
          },
          "<0.2",
        );
      }

      if (animation?.lines && split.lines) {
        tl.from(
          split.lines,
          {
            opacity: 0,
            ...directionalProps,
            stagger: 0.1,
            duration: 1,
            ease: "power2.out",
            ...animation.lines,
          },
          "<0.2",
        );
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
    if (Tag === "h1" || Tag === "h2" || Tag === "h3") {
      if (textRef.current) {
        textRef.current.addEventListener("mouseenter", () => {
          if (split.chars) {
            gsap.to(split.chars, {
              y: -5,
              stagger: 0.01,
              duration: 0.3,
              ease: "power2.out",
              overwrite: true,
            });
          }
        });

        textRef.current.addEventListener("mouseleave", () => {
          if (split.chars) {
            gsap.to(split.chars, {
              y: 0,
              stagger: 0.01,
              duration: 0.3,
              ease: "power2.out",
              overwrite: true,
            });
          }
        });
      }
    }

    return () => {
      splitTextRef.current?.revert();
      if (textRef.current) {
        textRef.current.removeEventListener("mouseenter", () => {});
        textRef.current.removeEventListener("mouseleave", () => {});
      }
    };
  }, [
    delay,
    animation,
    splitOptions,
    highlightWords,
    staggerWords,
    revealFromDirection,
  ]);

  // Use a more specific approach to handle the rendering with the correct type
  const Component = Tag;

  return (
    <Component
      ref={textRef as any} // Cast to any to avoid TypeScript errors
      className={`${className} animated-text-element`}
      style={{
        visibility: isVisible ? "visible" : "hidden",
        ...getTextStyles(),
      }}
    >
      {text}
    </Component>
  );
}
