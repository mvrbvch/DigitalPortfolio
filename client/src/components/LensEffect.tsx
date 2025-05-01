import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface LensEffectProps {
  className?: string;
}

export default function LensEffect({ className = '' }: LensEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const lensRef = useRef<THREE.Mesh | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const init = () => {
      if (!containerRef.current) return;

      // Scene setup
      sceneRef.current = new THREE.Scene();

      // Camera setup
      const element = containerRef.current;
      const width = element.clientWidth;
      const height = element.clientHeight;
      
      cameraRef.current = new THREE.PerspectiveCamera(
        70, 
        width / height, 
        0.1, 
        1000
      );
      cameraRef.current.position.z = 2;

      // Renderer setup
      rendererRef.current = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
      });
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      element.appendChild(rendererRef.current.domElement);

      // Create a lens effect with a curved sphere
      const geometry = new THREE.SphereGeometry(0.5, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        color: 0x2194f3,
        transparent: true,
        opacity: 0.15,
        shininess: 100,
        specular: 0xffffff,
        refractionRatio: 0.98,
      });

      lensRef.current = new THREE.Mesh(geometry, material);
      sceneRef.current.add(lensRef.current);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      sceneRef.current.add(ambientLight);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      sceneRef.current.add(directionalLight);

      // Add point light inside the lens
      const pointLight = new THREE.PointLight(0x4477ff, 2, 2);
      lensRef.current.add(pointLight);
      pointLight.position.set(0, 0, 0.1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const element = containerRef.current;
      const width = element.clientWidth;
      const height = element.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    const animate = () => {
      if (!lensRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Move lens towards mouse position with smooth easing
      gsap.to(lensRef.current.position, {
        x: mouseRef.current.x * 0.8,
        y: mouseRef.current.y * 0.8,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto"
      });
      
      // Rotate lens slightly based on mouse position for a dynamic feel
      gsap.to(lensRef.current.rotation, {
        x: mouseRef.current.y * 0.2,
        y: mouseRef.current.x * 0.2,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto"
      });
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    init();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (lensRef.current) {
        lensRef.current.geometry.dispose();
        (lensRef.current.material as THREE.Material).dispose();
      }
      
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}