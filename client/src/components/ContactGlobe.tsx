import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const init = () => {
      if (!containerRef.current) return;
      
      // Scene setup
      sceneRef.current = new THREE.Scene();
      
      // Camera setup
      const element = containerRef.current;
      const width = element.clientWidth;
      const height = element.clientHeight;
      
      cameraRef.current = new THREE.PerspectiveCamera(
        45, 
        width / height, 
        0.1, 
        1000
      );
      cameraRef.current.position.z = 4;
      
      // Renderer setup
      rendererRef.current = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
      });
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      element.appendChild(rendererRef.current.domElement);
      
      // Create an earth-like sphere
      const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
      
      // Basic globe material with illumination
      const globeMaterial = new THREE.MeshStandardMaterial({
        color: 0x0077cc,
        metalness: 0.1,
        roughness: 0.7,
        opacity: 0.9,
        transparent: true,
        emissive: 0x0033aa,
        emissiveIntensity: 0.1,
        wireframe: true
      });
      
      globeRef.current = new THREE.Mesh(sphereGeometry, globeMaterial);
      sceneRef.current.add(globeRef.current);
      
      // Add a subtle glow effect using a larger transparent sphere
      const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
      const glowMaterial = new THREE.MeshPhongMaterial({
        color: 0x0088ff, 
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide
      });
      
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      sceneRef.current.add(glowMesh);
      
      // Add a few point locations to represent contact points
      addContactPoints();
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      sceneRef.current.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      sceneRef.current.add(directionalLight);
      
      const hemisphereLight = new THREE.HemisphereLight(0xaaaaff, 0x806060, 0.6);
      sceneRef.current.add(hemisphereLight);
    };
    
    // Add contact points on the globe
    const addContactPoints = () => {
      if (!sceneRef.current) return;
      
      const scene = sceneRef.current;
      
      // Create material for contact points
      const pointMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        emissive: 0xff8800,
        emissiveIntensity: 0.5,
      });
      
      // Define a few coordinates (simplified)
      const locations = [
        { lat: 0, lng: 0 },          // Center (example)
        { lat: 37.7749, lng: -122.4194 }, // San Francisco
        { lat: 51.5074, lng: -0.1278 },  // London
        { lat: -33.8688, lng: 151.2093 }, // Sydney
        { lat: 35.6762, lng: 139.6503 },  // Tokyo
        { lat: -23.5505, lng: -46.6333 }  // São Paulo
      ];
      
      // Add points
      locations.forEach(location => {
        const pointGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        
        // Convert lat/lng to 3D coordinates
        const phi = (90 - location.lat) * (Math.PI / 180);
        const theta = (location.lng + 180) * (Math.PI / 180);
        
        // Calculate position
        point.position.x = -1 * Math.sin(phi) * Math.cos(theta);
        point.position.z = Math.sin(phi) * Math.sin(theta);
        point.position.y = Math.cos(phi);
        
        // Add to scene
        scene.add(point);
        
        // Add pulse effect around some points
        if (Math.random() > 0.5) {
          const pulseMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.4
          });
          
          const pulseGeometry = new THREE.SphereGeometry(0.03, 16, 16);
          const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
          pulse.position.copy(point.position);
          scene.add(pulse);
          
          // Animate pulse with scale
          const pulseTimeline = gsap.timeline({
            repeat: -1,
            delay: Math.random() * 2
          });
          
          pulseTimeline.to(pulse.scale, {
            x: 2,
            y: 2,
            z: 2,
            duration: 1.5,
            ease: "power1.out"
          });
          
          pulseTimeline.to(pulseMaterial, {
            opacity: 0,
            duration: 1.5,
            ease: "power1.out"
          }, 0);
          
          pulseTimeline.set(pulse.scale, {
            x: 1,
            y: 1,
            z: 1
          });
          
          pulseTimeline.set(pulseMaterial, {
            opacity: 0.4
          });
        }
      });
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const element = containerRef.current;
      const width = element.clientWidth;
      const height = element.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    // Animation loop
    const animate = () => {
      if (!globeRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Rotate the globe
      globeRef.current.rotation.y += 0.002;
      
      // Render
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    init();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !globeRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      
      // Subtle effect on globe rotation based on mouse position
      gsap.to(globeRef.current.rotation, {
        y: mouseX * 0.5,
        duration: 2,
        ease: "power2.out"
      });
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        
        if (rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      
      // Dispose geometries and materials
      if (globeRef.current) {
        sceneRef.current?.remove(globeRef.current);
        globeRef.current.geometry.dispose();
        (globeRef.current.material as THREE.Material).dispose();
      }
      
      // Dispose renderer
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