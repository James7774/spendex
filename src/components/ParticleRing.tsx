"use client";
import React, { useEffect, useRef } from "react";
import styles from "./ParticleRing.module.css";
import { useFinance } from "@/context/FinanceContext";

class Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  opacity: number;
  distanceFromCenter: number;

  constructor(width: number, height: number, ringRadius: number) {
    this.angle = Math.random() * Math.PI * 2;
    // Increased spread for "more distance" look
    // ringRadius is base, + random * 120 gives a thick band
    this.distanceFromCenter = Math.random() * 120 + ringRadius; 
    this.x = width / 2 + Math.cos(this.angle) * this.distanceFromCenter;
    this.y = height / 2 + Math.sin(this.angle) * this.distanceFromCenter;
    this.radius = Math.random() * 2.5 + 0.5; // Slightly larger variety
    this.speed = Math.random() * 0.005 + 0.002;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, color: string) {
    // Rotate counter-clockwise ("ichki tarafga" interpretation: standard math/CCW)
    // Actually, let's make it look like it's rotating 'in'.
    this.angle -= this.speed; 
    
    this.x = centerX + Math.cos(this.angle) * this.distanceFromCenter;
    this.y = centerY + Math.sin(this.angle) * this.distanceFromCenter;

    this.draw(ctx, color);
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
    ctx.fill();
  }
}

const ParticleRing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useFinance();

  // Refs for smooth following
  const positionRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize center
    positionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    let particles: Particle[] = [];
    let animationFrameId: number;
    
    // Config
    const ringRadius = 150; // Inner radius
    const particleCount = 350; // "Ko'paytirib" - Increased count
    const color = darkMode ? "255, 255, 255" : "37, 99, 235"; 

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height, ringRadius));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Smooth Follow Logic
      // Lerp current position towards mouse position
      const ease = 0.08; // 8% per frame
      positionRef.current.x += (mouseRef.current.x - positionRef.current.x) * ease;
      positionRef.current.y += (mouseRef.current.y - positionRef.current.y) * ease;
      
      particles.forEach((p) => p.update(ctx, positionRef.current.x, positionRef.current.y, color));
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Initial setup
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <div ref={containerRef} className={styles.particleContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default ParticleRing;
