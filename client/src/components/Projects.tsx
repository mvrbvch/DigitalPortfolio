import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import SplitType from "split-type";
import ThreeDCube from "./ThreeDCube";

gsap.registerPlugin(ScrollTrigger);

// Project data
const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description:
      "A complete e-commerce solution with product management, shopping cart, and payment processing integration.",
    image:
      "https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
    link: "#",
  },
  {
    id: 2,
    title: "Healthcare Portal",
    description:
      "A patient management system with appointment scheduling, medical records, and telemedicine capabilities.",
    image:
      'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" preserveAspectRatio="none"%3E%3Crect fill="%23a855f7" fill-opacity="0.2" width="600" height="400"/%3E%3Ctext x="300" y="200" style="fill:%23a855f7;font-family:Arial;font-size:24px;font-weight:bold;text-anchor:middle"%3EHealthcare Portal%3C/text%3E%3C/svg%3E',
    technologies: ["React", "Express", "PostgreSQL", "WebRTC"],
    link: "#",
  },
  {
    id: 3,
    title: "AI Content Generator",
    description:
      "An application that uses machine learning to generate content for marketing, blogs, and social media.",
    image:
      'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" preserveAspectRatio="none"%3E%3Crect fill="%2306b6d4" fill-opacity="0.2" width="600" height="400"/%3E%3Ctext x="300" y="200" style="fill:%2306b6d4;font-family:Arial;font-size:24px;font-weight:bold;text-anchor:middle"%3EAI Content Generator%3C/text%3E%3C/svg%3E',
    technologies: ["Python", "TensorFlow", "React", "Flask"],
    link: "#",
  },
  {
    id: 4,
    title: "Property Management System",
    description:
      "A comprehensive solution for managing rental properties, tenants, maintenance, and financial records.",
    image:
      'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" preserveAspectRatio="none"%3E%3Crect fill="%23f43f5e" fill-opacity="0.2" width="600" height="400"/%3E%3Ctext x="300" y="200" style="fill:%23f43f5e;font-family:Arial;font-size:24px;font-weight:bold;text-anchor:middle"%3EProperty Management System%3C/text%3E%3C/svg%3E',
    technologies: ["Vue.js", "Node.js", "MySQL", "Docker"],
    link: "#",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    // Add ID for navigation
    sectionRef.current.id = "projects";

    // Title animation
    const titleSplit = new SplitType(titleRef.current, { types: "chars" });

    gsap.from(titleSplit.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.03,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
    });

    // Ensure carousel items are visible
    const projectItems = carouselRef.current?.querySelectorAll(".project-item");
    if (projectItems) {
      projectItems.forEach((item) => {
        const image = item.querySelector(".project-image");
        if (image) {
          gsap.to(image, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    }

    // Initialize with first project
    goToSlide(0, true);
  }, []);

  // Function to handle slide navigation
  const goToSlide = (index: number, immediate = false) => {
    if (isAnimating && !immediate) return;

    const newIndex = (index + projects.length) % projects.length;
    if (newIndex === activeIndex && !immediate) return;

    setIsAnimating(true);
    setActiveIndex(newIndex);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    if (carouselRef.current) {
      const items = carouselRef.current.querySelectorAll(".project-item");

      items.forEach((item, i) => {
        const isActive = i === newIndex;
        const direction = immediate ? 0 : i < activeIndex ? -1 : 1;

        if (immediate) {
          gsap.set(item, {
            opacity: isActive ? 1 : 0,
            x: 0,
            zIndex: isActive ? 10 : 0,
          });
        } else {
          tl.to(
            item,
            {
              opacity: isActive ? 1 : 0,
              x: isActive ? 0 : `${direction * 50}%`,
              zIndex: isActive ? 10 : 0,
              duration: 0.8,
              ease: "power3.out",
            },
            0
          );
        }
      });
    }
  };

  const nextSlide = () => goToSlide(activeIndex + 1);
  const prevSlide = () => goToSlide(activeIndex - 1);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-32 relative overflow-hidden bg-background/80 w-full"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="absolute  left-20 w-40 h-40 opacity-20 pointer-events-none hidden md:block"></div>

      <div className="container max-w-none mx-auto px-6">
        <div className="lg:w-2/3 flex justify-center items-center mx-auto">
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold z-10 mb-20"
          >
            Featured Projects
          </h2>
        </div>

        {/* Projects carousel - inspired by Funkhaus */}
        <div className="relative mt-0">
          {/* Carousel navigation */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 border-primary/30 hover:border-primary"
                onClick={prevSlide}
                disabled={isAnimating}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 border-primary/30 hover:border-primary"
                onClick={nextSlide}
                disabled={isAnimating}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">
                {activeIndex + 1}
              </span>
              <span> / {projects.length}</span>
            </div>
          </div>

          {/* Carousel container */}
          <div
            ref={carouselRef}
            className="relative h-[500px] md:h-[600px] overflow-hidden"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`project-item absolute inset-0 flex flex-col md:flex-row transition-opacity duration-700 ease-in-out ${
                  index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {/* Project image - left side */}
                <div className="md:w-3/5 h-64 md:h-full relative overflow-hidden rounded-xl">
                  <div
                    className="project-image absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>

                {/* Project details - right side */}
                <div className="md:w-2/5 p-6 md:p-10 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {project.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-sm text-primary font-semibold mb-3">
                      Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="default"
                    className="w-fit bg-primary/80 hover:bg-primary button-3d"
                    asChild
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar - inspired by Funkhaus */}
          <div className="w-full h-[2px] bg-muted mt-10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{
                width: `${((activeIndex + 1) / projects.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
