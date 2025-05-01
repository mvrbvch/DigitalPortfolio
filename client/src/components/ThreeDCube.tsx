import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDCubeProps {
  className?: string;
}

export default function ThreeDCube({ className = '' }: ThreeDCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const cube = useRef<THREE.Mesh | null>(null);

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
    camera.current.position.z = 5;
    
    // Renderer setup
    renderer.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.current.setSize(clientWidth, clientHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.current.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.current.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.current.add(directionalLight);
    
    // Create cube with technology names on faces
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Create materials for each face with different colors
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x2194f3, emissive: 0x143a61, shininess: 100 }), // Right - JavaScript
      new THREE.MeshPhongMaterial({ color: 0x3f51b5, emissive: 0x1a237e, shininess: 100 }), // Left - TypeScript
      new THREE.MeshPhongMaterial({ color: 0x4caf50, emissive: 0x1b5e20, shininess: 100 }), // Top - Node.js
      new THREE.MeshPhongMaterial({ color: 0x9c27b0, emissive: 0x4a148c, shininess: 100 }), // Bottom - React
      new THREE.MeshPhongMaterial({ color: 0xff9800, emissive: 0xe65100, shininess: 100 }), // Front - Three.js
      new THREE.MeshPhongMaterial({ color: 0xf44336, emissive: 0xb71c1c, shininess: 100 })  // Back - GSAP
    ];
    
    // Create cube
    cube.current = new THREE.Mesh(cubeGeometry, materials);
    scene.current.add(cube.current);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (cube.current) {
        cube.current.rotation.x += 0.01;
        cube.current.rotation.y += 0.01;
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
    
    // Mouse movement effect
    const handleMouseMove = (event: MouseEvent) => {
      if (!cube.current) return;
      
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Subtle rotation influence from mouse position
      cube.current.rotation.x += mouseY * 0.01;
      cube.current.rotation.y += mouseX * 0.01;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (containerRef.current && renderer.current) {
        containerRef.current.removeChild(renderer.current.domElement);
      }
      
      if (cube.current) {
        scene.current?.remove(cube.current);
        cube.current.geometry.dispose();
        
        if (Array.isArray(cube.current.material)) {
          cube.current.material.forEach(material => material.dispose());
        } else {
          cube.current.material.dispose();
        }
      }
      
      renderer.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`${className}`}
      aria-hidden="true"
    />
  );
}