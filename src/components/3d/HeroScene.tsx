"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core: Holographic Futuristic Polyhedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      emissive: 0x2e1065,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 0.6,
      wireframe: false,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // Core Wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireframeMesh = new THREE.Mesh(coreGeometry, wireframeMaterial);
    wireframeMesh.scale.set(1.02, 1.02, 1.02);
    mainGroup.add(wireframeMesh);

    // 2. Gimbal Orbiting Cyber Rings
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.9, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 3. Orbiting Satellite Tech Nodes
    const satelliteGroup = new THREE.Group();
    mainGroup.add(satelliteGroup);

    const satGeo = new THREE.OctahedronGeometry(0.18, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
    });

    const satellites: THREE.Mesh[] = [];
    const numSatellites = 4;
    for (let i = 0; i < numSatellites; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      const angle = (i / numSatellites) * Math.PI * 2;
      sat.position.set(Math.cos(angle) * 2.4, Math.sin(angle * 2) * 0.5, Math.sin(angle) * 2.4);
      satellites.push(sat);
      satelliteGroup.add(sat);
    }

    // 4. Floating Particle Cloud
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x38bdf8); // Cyan
    const colorB = new THREE.Color(0xa855f7); // Purple

    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = colorA.clone().lerp(colorB, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 4, 15);
    pointLight1.position.set(3, 4, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 4, 15);
    pointLight2.position.set(-3, -3, 2);
    scene.add(pointLight2);

    // Mouse Tracking with smooth dampening
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Click pulse
    const handleClick = () => {
      coreMesh.scale.set(1.15, 1.15, 1.15);
      setTimeout(() => {
        coreMesh.scale.set(1, 1, 1);
      }, 300);
    };

    container.addEventListener("click", handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Parallax smooth interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      if (!prefersReducedMotion) {
        // Core rotation
        coreMesh.rotation.x += 0.005;
        coreMesh.rotation.y += 0.008;
        wireframeMesh.rotation.x -= 0.003;
        wireframeMesh.rotation.y += 0.006;

        // Rings rotation
        ring1.rotation.z += 0.01;
        ring1.rotation.x += 0.005;
        ring2.rotation.z -= 0.008;
        ring2.rotation.y += 0.006;

        // Satellite orbital rotation
        satelliteGroup.rotation.y += 0.012;
        satelliteGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
        satellites.forEach((sat, idx) => {
          sat.rotation.x += 0.02;
          sat.rotation.y += 0.03;
          sat.position.y += Math.sin(elapsedTime * 2 + idx) * 0.004;
        });

        // Floating particles rotation
        particles.rotation.y += 0.0008;
        particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

        // Group float wobble
        mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
      }

      // Parallax tilt
      mainGroup.rotation.y = mouseX * 0.8;
      mainGroup.rotation.x = -mouseY * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[320px] lg:min-h-[460px] relative cursor-pointer select-none"
      aria-label="Interactive 3D Holographic Scene"
      title="Interactive 3D Scene - Drag mouse to interact"
    >
      <div className="absolute bottom-2 right-4 text-[11px] font-mono tracking-wider text-white/30 pointer-events-none uppercase">
        WebGL Visualizer • Interactive
      </div>
    </div>
  );
}
