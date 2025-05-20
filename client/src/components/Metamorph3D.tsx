import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface Metamorph3DProps {
  className?: string;
  variant?: "sphere" | "torus" | "icosahedron";
  color?: string;
  wireframe?: boolean;
  speed?: number;
  size?: number;
  position?: { x: number; y: number; z: number };
}

export default function Metamorph3D({
  className = "",
  variant = "icosahedron",
  color = "#3b82f6", // primary blue
  wireframe = true,
  speed = 1,
  size = 20,
  position = { x: 0, y: 0, z: 0 },
}: Metamorph3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const noiseIntensityRef = useRef<number>(0);
  const morphStateRef = useRef<number>(0); // 0 to 1, used for morphing

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    sceneRef.current = new THREE.Scene();

    // Setup camera
    const element = containerRef.current;
    const width = element.clientWidth;
    const height = element.clientHeight;

    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      1000
    );
    cameraRef.current.position.z = 5;

    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    element.appendChild(rendererRef.current.domElement);

    // Create geometry based on variant
    let geometry: THREE.BufferGeometry;

    switch (variant) {
      case "torus":
        geometry = new THREE.TorusGeometry(1 * size, 0.4 * size, 64, 100);
        break;
      case "icosahedron":
        geometry = new THREE.IcosahedronGeometry(1 * size, 4);
        break;
      case "sphere":
      default:
        geometry = new THREE.SphereGeometry(1 * size, 64, 64);
    }

    // Store original vertex positions for morphing
    const originalPositions = new Float32Array(
      geometry.attributes.position.array
    );

    // Create material
    const colorObj = new THREE.Color(color);
    const material = new THREE.MeshPhongMaterial({
      color: colorObj,
      wireframe: wireframe,
      emissive: colorObj.clone().multiplyScalar(0.2),
      shininess: 50,
      specular: 0xffffff,
    });

    // Create mesh
    objectRef.current = new THREE.Mesh(geometry, material);
    objectRef.current.position.set(position.x, position.y, position.z);
    sceneRef.current.add(objectRef.current);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 2, 2);
    sceneRef.current.add(pointLight);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const element = containerRef.current;
      const width = element.clientWidth;
      const height = element.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    // Apply noise deformation to vertices
    const applyNoiseDeformation = (time: number, morphState: number) => {
      if (!objectRef.current) return;

      const positionAttribute = objectRef.current.geometry.attributes.position;
      const positions = positionAttribute.array;

      for (let i = 0; i < positions.length; i += 3) {
        // Get original position
        const originalX = originalPositions[i];
        const originalY = originalPositions[i + 1];
        const originalZ = originalPositions[i + 2];

        // Apply simplex noise based on position and time
        const vertexTime =
          time + originalX * 10 + originalY * 10 + originalZ * 10;

        // Different noise patterns based on variant
        let noiseX, noiseY, noiseZ;

        if (variant === "torus") {
          noiseX = Math.sin(vertexTime * 0.3) * 0.1;
          noiseY = Math.cos(vertexTime * 0.2) * 0.1;
          noiseZ = Math.sin(vertexTime * 0.1) * 0.1;
        } else if (variant === "icosahedron") {
          noiseX =
            Math.sin(vertexTime * 0.2) * Math.cos(vertexTime * 0.1) * 0.15;
          noiseY = Math.cos(vertexTime * 0.3) * 0.15;
          noiseZ = Math.sin(vertexTime * 0.4) * 0.15;
        } else {
          // Sphere
          noiseX = Math.sin(vertexTime * 0.2) * 0.1;
          noiseY = Math.cos(vertexTime * 0.3) * 0.1;
          noiseZ = Math.sin(vertexTime * 0.4) * 0.1;
        }

        // Apply noise with intensity controlled by morphState
        positions[i] =
          originalX + noiseX * noiseIntensityRef.current * morphState;
        positions[i + 1] =
          originalY + noiseY * noiseIntensityRef.current * morphState;
        positions[i + 2] =
          originalZ + noiseZ * noiseIntensityRef.current * morphState;
      }

      positionAttribute.needsUpdate = true;
    };

    // Animation loop
    const animate = () => {
      if (
        !sceneRef.current ||
        !cameraRef.current ||
        !rendererRef.current ||
        !objectRef.current
      )
        return;

      const time = clockRef.current.getElapsedTime() * speed;

      // Rotate object
      objectRef.current.rotation.x = time * 0.3;
      objectRef.current.rotation.y = time * 0.5;

      // Apply noise deformation
      applyNoiseDeformation(time, morphStateRef.current);

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Add scroll trigger to animate noise intensity
    const handleInView = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // When element comes into view, animate to noisy state
          gsap.to(noiseIntensityRef, {
            current: 1,
            duration: 1.5,
            ease: "power2.out",
          });

          gsap.to(morphStateRef, {
            current: 1,
            duration: 2,
            ease: "power2.inOut",
          });
        } else {
          // When element goes out of view, animate back to clean state
          gsap.to(noiseIntensityRef, {
            current: 0,
            duration: 1.5,
            ease: "power2.out",
          });

          gsap.to(morphStateRef, {
            current: 0,
            duration: 2,
            ease: "power2.inOut",
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleInView, {
      threshold: 0.1,
    });

    observer.observe(containerRef.current);

    // Add event listeners
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (objectRef.current) {
        objectRef.current.geometry.dispose();
        (objectRef.current.material as THREE.Material).dispose();
      }

      rendererRef.current?.dispose();
    };
  }, [variant, color, wireframe, speed, size, position]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
