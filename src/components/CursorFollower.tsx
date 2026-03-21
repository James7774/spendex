"use client";
import React, { useEffect, useRef } from 'react';
import { useFinance } from '@/context/FinanceContext';

const CursorFollower = () => {
  const { darkMode } = useFinance();
  const trailsRef = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    
    // Initialize trails (positions)
    const trails = Array.from({ length: 20 }).map(() => ({ x: 0, y: 0 }));
    
    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      let x = mouseX;
      let y = mouseY;

      trails.forEach((trail, index) => {
        const dot = trailsRef.current[index];
        if (!dot) return;

        // Smooth follow logic (Snake effect)
        // Next dot moves towards the previous dot (or mouse for the first one)
        trail.x += (x - trail.x) * 0.4; // Speed
        trail.y += (y - trail.y) * 0.4;
        
        dot.style.left = `${trail.x}px`;
        dot.style.top = `${trail.y}px`;
        
        // Use current trail position as target for the next dot
        x = trail.x; 
        y = trail.y;
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', moveCursor);
    animate();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  const color = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(59, 130, 246, 0.8)';

  return (
    <>
      <style jsx global>{`
        .trail-dot {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          border-radius: 50%;
          background-color: ${color};
          transform: translate(-50%, -50%);
        }
      `}</style>
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i} 
          ref={el => { if (el) trailsRef.current[i] = el; }} 
          className="trail-dot"
          style={{
            width: `${Math.max(4, 24 - i)}px`, // Decreasing size
            height: `${Math.max(4, 24 - i)}px`,
            opacity: 1 - i * 0.04, // Fading tail
          }}
        />
      ))}
    </>
  );
};

export default CursorFollower;
