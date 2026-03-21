"use client";
import React, { useEffect, useRef } from 'react';
import { useFinance } from '@/context/FinanceContext';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  baseX: number;
  baseY: number;
  density: number;

  constructor(width: number, height: number, color: string) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5; // Random movement
    this.speedY = Math.random() * 1 - 0.5;
    this.color = color;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
  }

  update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, width: number, height: number) {
    // Collision detection with mouse (Repulsion)
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = 150; // Interaction radius
    const force = (maxDistance - distance) / maxDistance;
    const directionX = forceDirectionX * force * this.density;
    const directionY = forceDirectionY * force * this.density;

    if (distance < maxDistance) {
      // Repulsion: Move AWAY from mouse
      this.x -= directionX;
      this.y -= directionY;
    } else {
      // Return to natural movement or original position?
      // "Sochilib turgan" implies freely moving or returning. 
      // Let's make them float freely but generally return if pushed too far, 
      // or just standard floating physics.
      // Let's stick to standard floating + collisions.
      
      if (this.x !== this.baseX) {
          const dx = this.x - this.baseX;
          this.x -= dx/10; // Slow return
      }
       if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy/10;
      }
      
      // Floating effect
      this.x += this.speedX;
      this.y += this.speedY;
    }

    // Boundary check / Wrap around
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useFinance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray: Particle[] = [];
    const mouse = { x: -1000, y: -1000 }; // Initially off screen

    const color = darkMode ? '#ffffff' : '#94a3b8'; // Single uniform color

    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000; // Density
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(canvas.width, canvas.height, color));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(ctx, mouse.x, mouse.y, canvas.width, canvas.height);
      }
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    
    // We want collision to stop when mouse leaves
    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [darkMode]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ParticleBackground;
