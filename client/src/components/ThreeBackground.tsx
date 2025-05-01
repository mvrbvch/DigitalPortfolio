import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  className?: string;
}

export default function ThreeBackground({ className = '' }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const particles = useRef<THREE.Points | null>(null);

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
      antialias: true 
    });
    renderer.current.setSize(clientWidth, clientHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.current.domElement);
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Create random positions and colors
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 50; // x
      positions[i + 1] = (Math.random() - 0.5) * 50; // y
      positions[i + 2] = (Math.random() - 0.5) * 50; // z
      
      // Color (soft blue/teal palette)
      colors[i] = 0.5 + Math.random() * 0.5; // r
      colors[i + 1] = 0.7 + Math.random() * 0.3; // g
      colors[i + 2] = 0.8 + Math.random() * 0.2; // b
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    
    particles.current = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.current.add(particles.current);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (particles.current) {
        particles.current.rotation.x += 0.0005;
        particles.current.rotation.y += 0.0005;
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
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
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
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 -z-10 ${className}`}
      aria-hidden="true"
    />
  );
}