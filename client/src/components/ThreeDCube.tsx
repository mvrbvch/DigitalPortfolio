import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface ThreeDCubeProps {
  className?: string;
  wireframe?: boolean;
  morphSpeed?: number;
  rotationSpeed?: number;
  colors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    quaternary?: string;
  };
}

export default function ThreeDCube({ 
  className = '',
  wireframe = false,
  morphSpeed = 1,
  rotationSpeed = 1,
  colors = {
    primary: '#3b82f6',    // Blue
    secondary: '#8b5cf6',  // Purple
    tertiary: '#06b6d4',   // Cyan
    quaternary: '#ec4899'  // Pink
  }
}: ThreeDCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const cube = useRef<THREE.Mesh | null>(null);
  const clock = useRef<THREE.Clock>(new THREE.Clock());
  const [morphState, setMorphState] = useState<'cube' | 'sphere' | 'torus' | 'morph'>('cube');
  const morphTargets = useRef<{
    cube: THREE.BufferGeometry | null;
    sphere: THREE.BufferGeometry | null;
    torus: THREE.BufferGeometry | null;
  }>({
    cube: null,
    sphere: null,
    torus: null
  });
  
  // Convert hex colors to THREE.Color
  const primaryColor = new THREE.Color(colors.primary);
  const secondaryColor = new THREE.Color(colors.secondary);
  const tertiaryColor = new THREE.Color(colors.tertiary);
  const quaternaryColor = new THREE.Color(colors.quaternary);

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
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.current.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.current.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.current.add(directionalLight);
    
    // Create morphing geometries
    morphTargets.current.cube = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);
    morphTargets.current.sphere = new THREE.SphereGeometry(1.5, 64, 64);
    morphTargets.current.torus = new THREE.TorusGeometry(1, 0.4, 64, 64);
    
    // Create materials with gradient effect
    const materialOptions: THREE.MeshPhongMaterialParameters = {
      shininess: 100,
      wireframe: wireframe
    };
    
    // Create materials for each face with different colors
    const materials = [
      new THREE.MeshPhongMaterial({ 
        ...materialOptions,
        color: primaryColor, 
        emissive: primaryColor.clone().multiplyScalar(0.2) 
      }),
      new THREE.MeshPhongMaterial({ 
        ...materialOptions,
        color: secondaryColor, 
        emissive: secondaryColor.clone().multiplyScalar(0.2) 
      }),
      new THREE.MeshPhongMaterial({ 
        ...materialOptions,
        color: tertiaryColor, 
        emissive: tertiaryColor.clone().multiplyScalar(0.2) 
      }),
      new THREE.MeshPhongMaterial({ 
        ...materialOptions,
        color: quaternaryColor, 
        emissive: quaternaryColor.clone().multiplyScalar(0.2) 
      }),
      new THREE.MeshPhongMaterial({ 
        ...materialOptions,
        color: primaryColor, 
        emissive: primaryColor.clone().multiplyScalar(0.2) 
      }),
      new THREE.MeshPhongMaterial({ 
        ...materialOptions,
        color: secondaryColor, 
        emissive: secondaryColor.clone().multiplyScalar(0.2) 
      })
    ];
    
    // Create cube
    cube.current = new THREE.Mesh(morphTargets.current.cube, materials);
    scene.current.add(cube.current);
    
    // Setup auto-morphing between shapes
    const setupMorphingTimeline = () => {
      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 1,
        onUpdate: () => {
          // Will be handled in the animation loop
        }
      });
      
      // Morph cube to sphere
      timeline.to({}, {
        duration: 2 / morphSpeed,
        onStart: () => {
          setMorphState('morph');
        },
        onComplete: () => {
          setMorphState('sphere');
          if (cube.current && morphTargets.current.sphere) {
            cube.current.geometry.dispose();
            cube.current.geometry = morphTargets.current.sphere;
          }
        }
      });
      
      // Pause at sphere
      timeline.to({}, { duration: 2 });
      
      // Morph sphere to torus
      timeline.to({}, {
        duration: 2 / morphSpeed,
        onStart: () => {
          setMorphState('morph');
        },
        onComplete: () => {
          setMorphState('torus');
          if (cube.current && morphTargets.current.torus) {
            cube.current.geometry.dispose();
            cube.current.geometry = morphTargets.current.torus;
          }
        }
      });
      
      // Pause at torus
      timeline.to({}, { duration: 2 });
      
      // Morph torus back to cube
      timeline.to({}, {
        duration: 2 / morphSpeed,
        onStart: () => {
          setMorphState('morph');
        },
        onComplete: () => {
          setMorphState('cube');
          if (cube.current && morphTargets.current.cube) {
            cube.current.geometry.dispose();
            cube.current.geometry = morphTargets.current.cube;
          }
        }
      });
      
      // Pause at cube
      timeline.to({}, { duration: 2 });
      
      return timeline;
    };
    
    const morphingTimeline = setupMorphingTimeline();
    
    // Animation
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      if (cube.current) {
        const time = clock.current.getElapsedTime() * rotationSpeed;
        
        // Base rotation
        cube.current.rotation.x = time * 0.3;
        cube.current.rotation.y = time * 0.5;
        
        // Apply deformation during morph state
        if (morphState === 'morph') {
          const geometryPositions = cube.current.geometry.attributes.position;
          const count = geometryPositions.count;
          
          for (let i = 0; i < count; i++) {
            const x = geometryPositions.getX(i);
            const y = geometryPositions.getY(i);
            const z = geometryPositions.getZ(i);
            
            // Apply noise based on time
            const noise = Math.sin(time + x * 5) * 0.1 + 
                         Math.cos(time + y * 5) * 0.1 + 
                         Math.sin(time + z * 5) * 0.1;
            
            geometryPositions.setXYZ(
              i, 
              x + noise, 
              y + noise, 
              z + noise
            );
          }
          
          geometryPositions.needsUpdate = true;
        }
      }
      
      if (renderer.current && scene.current && camera.current) {
        renderer.current.render(scene.current, camera.current);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    
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
      if (!cube.current || !containerRef.current) return;
      
      // Calculate mouse position relative to the container
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Calculate distance from center of container
      const distanceFromCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      
      // Apply more influence when mouse is closer to the cube
      if (distanceFromCenter < 1.5) {
        // Create a target rotation based on mouse position
        const targetRotationX = mouseY * 1.5;
        const targetRotationY = mouseX * 1.5;
        
        // Smoothly interpolate current rotation towards target
        gsap.to(cube.current.rotation, {
          x: targetRotationX,
          y: targetRotationY,
          duration: 1,
          overwrite: true,
          ease: "power2.out"
        });
      } else {
        // When mouse is far, return to default rotation
        gsap.to(cube.current.rotation, {
          x: 0,
          y: 0,
          duration: 1.5,
          overwrite: true,
          ease: "elastic.out(1, 0.5)"
        });
      }
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      morphingTimeline.kill();
      
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      
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
      
      // Dispose of all geometries
      Object.values(morphTargets.current).forEach(geometry => {
        geometry?.dispose();
      });
      
      renderer.current?.dispose();
    };
  }, [wireframe, morphSpeed, rotationSpeed, primaryColor, secondaryColor, tertiaryColor, quaternaryColor]);

  return (
    <div 
      ref={containerRef} 
      className={`${className}`}
      aria-hidden="true"
    />
  );
}