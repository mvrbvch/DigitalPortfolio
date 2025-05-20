import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface ThreeBackgroundProps {
  className?: string;
  particleDensity?: number;
  colorScheme?: "blue" | "purple" | "mixed";
  containerRef?: React.RefObject<HTMLDivElement> | null;
}

export default function ThreeBackground({
  className = "",
  particleDensity = 1500,
  colorScheme = "blue",
  containerRef = null,
}: ThreeBackgroundProps) {
  containerRef = containerRef || useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const particles = useRef<THREE.Points | null>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    scene.current = new THREE.Scene();

    // Camera setup
    const { clientWidth, clientHeight } = containerRef.current;
    camera.current = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    camera.current.position.z = 30;

    // Renderer setup
    renderer.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.current.setSize(clientWidth, clientHeight);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.current.domElement);

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = particleDensity;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Generate colors based on color scheme
    const getColor = (index: number) => {
      switch (colorScheme) {
        case "blue":
          return {
            r: 0.5 + Math.random() * 0.3, // Soft blue base
            g: 0.7 + Math.random() * 0.3,
            b: 0.9 + Math.random() * 0.1,
          };
        case "purple":
          return {
            r: 0.6 + Math.random() * 0.4, // Purple base
            g: 0.4 + Math.random() * 0.2,
            b: 0.8 + Math.random() * 0.2,
          };
        case "mixed":
        default:
          // Mix of colors based on position in array
          const segment = index % 3;
          if (segment === 0) {
            // Blues
            return {
              r: 0.2 + Math.random() * 0.3,
              g: 0.5 + Math.random() * 0.3,
              b: 0.8 + Math.random() * 0.2,
            };
          } else if (segment === 1) {
            // Purples
            return {
              r: 0.6 + Math.random() * 0.3,
              g: 0.3 + Math.random() * 0.2,
              b: 0.7 + Math.random() * 0.3,
            };
          } else {
            // Cyans
            return {
              r: 0.2 + Math.random() * 0.2,
              g: 0.7 + Math.random() * 0.3,
              b: 0.8 + Math.random() * 0.2,
            };
          }
      }
    };

    // Create random positions, colors, and sizes
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Create particles in a spherical distribution for more uniform appearance
      const radius = 25 + Math.random() * 15; // 25-40 units radius sphere
      const theta = Math.random() * Math.PI * 2; // 0 to 2π
      const phi = Math.acos(Math.random() * 2 - 1); // -1 to 1, then arccos for sphere distribution

      // Convert spherical to cartesian coordinates
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta); // x
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i3 + 2] = radius * Math.cos(phi); // z

      // Color
      const color = getColor(i);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Size
      sizes[i] = Math.random() * 0.2 + 0.05; // 0.05 to 0.25 size
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    particlesGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Use ShaderMaterial for more advanced particle effects
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    particles.current = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.current.add(particles.current);

    // Initial animation for particles - expanding from center
    gsap.fromTo(
      particles.current.scale,
      { x: 0.3, y: 0.3, z: 0.3 },
      { x: 1, y: 1, z: 1, duration: 2.5, ease: "power3.out" }
    );

    // Mouse move effect
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 20 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 20 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (particles.current) {
        // Base rotation
        particles.current.rotation.x += 0.0003;
        particles.current.rotation.y += 0.0005;

        // Additional rotation based on mouse position
        const targetRotationX =
          particles.current.rotation.x + mousePosition.current.y * 0.0005;
        const targetRotationY =
          particles.current.rotation.y + mousePosition.current.x * 0.0005;

        // Smooth rotation
        particles.current.rotation.x +=
          (targetRotationX - particles.current.rotation.x) * 0.05;
        particles.current.rotation.y +=
          (targetRotationY - particles.current.rotation.y) * 0.05;

        // Subtle "breathing" effect using scale
        const time = Date.now() * 0.0005;
        const breathingScale = Math.sin(time) * 0.04 + 1;
        particles.current.scale.set(
          breathingScale,
          breathingScale,
          breathingScale
        );
      }

      if (renderer.current && scene.current && camera.current) {
        renderer.current.render(scene.current, camera.current);
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera.current || !renderer.current) return;

      const { clientWidth, clientHeight } = containerRef.current;

      camera.current.aspect = clientWidth / clientHeight;
      camera.current.updateProjectionMatrix();

      renderer.current.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.current) {
        containerRef.current.removeChild(renderer.current.domElement);
      }

      if (particles.current) {
        scene.current?.remove(particles.current);
        particles.current.geometry.dispose();
        (particles.current.material as THREE.Material).dispose();
      }

      renderer.current?.dispose();
    };
  }, [particleDensity, colorScheme]);

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 right-0 inset-0 -z-10 ${className}`}
      aria-hidden="true"
    />
  );
}
