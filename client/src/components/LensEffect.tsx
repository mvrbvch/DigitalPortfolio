import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const LensRefractionShader = {
  uniforms: {
    tDiffuse: { value: null },
    distortion: { value: 0.2 },
    distortion2: { value: 0.1 },
    speed: { value: 0.1 },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float distortion;
    uniform float distortion2;
    uniform float speed;
    uniform float time;

    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 distortedUv = uv + (uv - 0.5) * distortion * sin(time * speed);
      distortedUv += (uv - 0.5) * distortion2 * cos(time * speed);
      gl_FragColor = texture2D(tDiffuse, distortedUv);
    }
  `,
};

const LensEffect = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial(LensRefractionShader);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const lensPass = new ShaderPass(LensRefractionShader);
    composer.addPass(lensPass);

    const animate = () => {
      requestAnimationFrame(animate);
      LensRefractionShader.uniforms.time.value += 0.05;
      composer.render();
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="fixed inset-0 -z-20 pointer-events-none" />
  );
};

export default LensEffect;
