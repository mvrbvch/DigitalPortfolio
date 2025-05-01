import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "./ui/card";
import SplitType from "split-type";
import * as THREE from "three";
import Metamorph3D from "./Metamorph3D";
import RotatingText from "./RotatingText";
import AnimatedText from "./AnimatedText";

gsap.registerPlugin(ScrollTrigger);

// Organized skills by category for better visual presentation
const skillsByCategory = {
  "Languages": [
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Python", level: 80 },
    { name: "Ruby", level: 75 },
    { name: "PHP", level: 85 }
  ],
  "Frontend": [
    { name: "React", level: 95 },
    { name: "Vue.js", level: 85 },
    { name: "HTML/CSS", level: 90 },
    { name: "Tailwind", level: 90 },
    { name: "Material UI", level: 85 }
  ],
  "Mobile": [
    { name: "React Native", level: 90 },
    { name: "Expo", level: 85 },
    { name: "Android", level: 70 },
    { name: "iOS", level: 70 }
  ],
  "Backend": [
    { name: "Node.js", level: 95 },
    { name: "Express", level: 90 },
    { name: "MongoDB", level: 85 },
    { name: "PostgreSQL", level: 80 },
    { name: "GraphQL", level: 75 }
  ],
  "Graphics": [
    { name: "Three.js", level: 80 },
    { name: "WebGL", level: 75 },
    { name: "GSAP", level: 85 },
    { name: "SVG Animation", level: 80 }
  ],
  "DevOps & Cloud": [
    { name: "Docker", level: 85 },
    { name: "Kubernetes", level: 75 },
    { name: "AWS", level: 80 },
    { name: "Azure", level: 75 },
    { name: "GCP", level: 70 }
  ]
};

// 3D animated skill sphere
function SkillSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const init = () => {
      if (!containerRef.current) return;
      
      // Setup scene
      sceneRef.current = new THREE.Scene();
      
      // Setup camera
      const element = containerRef.current;
      const width = element.clientWidth;
      const height = element.clientHeight;
      
      cameraRef.current = new THREE.PerspectiveCamera(
        75, 
        width / height, 
        0.1, 
        1000
      );
      cameraRef.current.position.z = 3;
      
      // Setup renderer
      rendererRef.current = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
      });
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      element.appendChild(rendererRef.current.domElement);
      
      // Create a sphere geometry with points
      const geometry = new THREE.IcosahedronGeometry(1, 3);
      const material = new THREE.MeshPhongMaterial({
        color: 0x2194f3,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true,
        wireframe: true
      });
      
      sphereRef.current = new THREE.Mesh(geometry, material);
      sceneRef.current.add(sphereRef.current);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      sceneRef.current.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0x2194f3, 2);
      pointLight.position.set(1, 1, 1);
      sceneRef.current.add(pointLight);
      
      const pointLight2 = new THREE.PointLight(0xff9000, 1);
      pointLight2.position.set(-1, -1, -1);
      sceneRef.current.add(pointLight2);
    };
    
    const resize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      
      // Update camera
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(clientWidth, clientHeight);
    };
    
    const animate = () => {
      if (!sphereRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Rotate the sphere
      sphereRef.current.rotation.x += 0.005;
      sphereRef.current.rotation.y += 0.005;
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize everything
    init();
    
    // Handle window resize
    window.addEventListener('resize', resize);
    
    // Start animation loop
    animate();
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', resize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (sphereRef.current) {
        sceneRef.current?.remove(sphereRef.current);
        sphereRef.current.geometry.dispose();
        (sphereRef.current.material as THREE.Material).dispose();
      }
      
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}

export default function Skills() {
  // Função para retornar gradientes baseados na categoria
  const getSkillCategoryGradient = (category: string): string => {
    switch(category) {
      case 'Languages':
        return 'linear-gradient(to right, #3b82f6, #60a5fa)'; // Blues
      case 'Frontend':
        return 'linear-gradient(to right, #8b5cf6, #a78bfa)'; // Purples
      case 'Mobile':
        return 'linear-gradient(to right, #ec4899, #f472b6)'; // Pinks
      case 'Backend':
        return 'linear-gradient(to right, #06b6d4, #67e8f9)'; // Cyans
      case 'Graphics':
        return 'linear-gradient(to right, #10b981, #34d399)'; // Emeralds
      case 'DevOps & Cloud':
        return 'linear-gradient(to right, #f59e0b, #fbbf24)'; // Ambers
      default:
        return 'linear-gradient(to right, #3b82f6, #60a5fa)'; // Default blue
    }
  };
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;
    
    // Add ID for navigation
    sectionRef.current.id = "skills";
    
    // Title animation
    const titleSplit = new SplitType(titleRef.current, { types: 'chars' });
    
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
    
    // Category headers animation
    const categoryHeaders = sectionRef.current.querySelectorAll('.category-header');
    
    gsap.from(categoryHeaders, {
      opacity: 0,
      x: -50,
      stagger: 0.1,
      duration: 0.7,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });
    
    // Skill bars animation
    const skillBars = sectionRef.current.querySelectorAll('.skill-bar-fill');
    
    gsap.from(skillBars, {
      width: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });
    
    // Skills cards tilt effect
    const cards = sectionRef.current.querySelectorAll('.skill-card');
    
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          boxShadow: `${rotateY * -0.5}px ${rotateX * 0.5}px 10px rgba(0, 0, 0, 0.1)`,
          duration: 0.5,
          ease: "power2.out",
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });
  }, []);
  
  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />
      
      {/* Rotating text accent */}
      <div className="absolute top-20 right-10 opacity-20 pointer-events-none hidden md:block">
        <RotatingText 
          text="SKILLS•EXPERTISE•TECHNOLOGIES•" 
          className="w-64 h-64"
          speed={10}
        />
      </div>
      
      {/* Metamorphic 3D elements */}
      <div className="absolute top-40 left-20 w-64 h-64 opacity-30 pointer-events-none hidden md:block">
        <Metamorph3D 
          variant="icosahedron"
          color="#8b5cf6"  // Purple
          wireframe={true}
          speed={0.5}
          size={1.5}
        />
      </div>
      
      <div className="absolute bottom-40 right-10 w-48 h-48 opacity-30 pointer-events-none hidden md:block">
        <Metamorph3D 
          variant="torus"
          color="#06b6d4"  // Cyan
          wireframe={true}
          speed={0.7}
          size={1.2}
        />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="w-full h-full" style={{ filter: 'blur(40px)' }}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full bg-primary/30 rounded-full animate-blob" />
          </div>
          <div className="absolute top-3/4 right-1/4 w-1/3 h-1/3 transform translate-x-1/2 translate-y-1/2">
            <div className="w-full h-full bg-purple-500/30 rounded-full animate-blob animation-delay-2000" />
          </div>
          <div className="absolute bottom-1/4 left-2/3 w-1/4 h-1/4 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-full h-full bg-blue-500/30 rounded-full animate-blob animation-delay-4000" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <AnimatedText 
              text="Technical Skills"
              tag="h2"
              className="text-4xl md:text-6xl font-bold mb-16"
              textStyle="gradient"
              staggerWords={true}
              revealFromDirection="left"
              splitOptions={{ types: 'chars, words' }}
            />
            
            <div className="space-y-12">
              {Object.entries(skillsByCategory).map(([category, skillsInCategory]) => (
                <div 
                  key={category} 
                  className="skill-category"
                  onMouseEnter={() => setActiveCategory(category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <h3 
                    className="category-header text-2xl font-semibold mb-6 relative"
                    style={{ 
                      background: getSkillCategoryGradient(category),
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {category}
                    <span 
                      className="block h-1 w-16 mt-1 rounded-full transition-all duration-300 opacity-70"
                      style={{ background: getSkillCategoryGradient(category) }}
                    ></span>
                  </h3>
                  
                  <div className="space-y-4">
                    {skillsInCategory.map((skill, index) => (
                      <div 
                        key={index}
                        className={`skill-item transition-all duration-300 ${
                          activeCategory === category ? 'opacity-100 scale-100' : 
                          activeCategory ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="skill-bar-fill h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${skill.level}%`,
                              background: getSkillCategoryGradient(category)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/3 flex justify-center items-center">
            <div className="relative w-full h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background rounded-xl" />
              <SkillSphere />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
