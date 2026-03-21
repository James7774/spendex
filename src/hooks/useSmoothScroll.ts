'use client';

import { useEffect } from 'react';

/**
 * Custom smooth scroll hook
 * Mouse wheel, touchpad VA touch (mobil) scroll tezligini sekinlashtiradi
 * Barcha brauzerlarda va qurilmalarda ishlaydi
 */
export function useSmoothScroll(options?: {
  speed?: number;      // Scroll tezligi (0.1 - 1.0), default: 0.5
  smoothness?: number; // Yumshoqlik darajasi (0.01 - 0.2), default: 0.1
  enabled?: boolean;   // Yoqish/o'chirish, default: true
}) {
  const {
    speed = 0.5,        // 50% tezlik (o'rtacha)
    smoothness = 0.1,   // Yumshoq animatsiya
    enabled = true
  } = options || {};

  useEffect(() => {
    if (!enabled) return;

    // Mobil qurilmani aniqlash
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let animationFrameId: number | null = null;
    let isAnimating = false;

    // Touch uchun o'zgaruvchilar
    let touchStartY = 0;
    let lastTouchY = 0;
    let touchVelocity = 0;

    // Scroll animatsiyasi
    const animateScroll = () => {
      const diff = targetScrollY - currentScrollY;
      
      if (Math.abs(diff) < 0.5) {
        currentScrollY = targetScrollY;
        window.scrollTo(0, currentScrollY);
        isAnimating = false;
        return;
      }

      currentScrollY += diff * smoothness;
      window.scrollTo(0, currentScrollY);
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    // Animatsiyani boshlash
    const startAnimation = () => {
      if (!isAnimating) {
        isAnimating = true;
        currentScrollY = window.scrollY;
        animationFrameId = requestAnimationFrame(animateScroll);
      }
    };

    // Target pozitsiyani chegaralash
    const clampTarget = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
    };

    // ========== WHEEL EVENT (Desktop) ==========
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * speed;
      targetScrollY += delta;
      clampTarget();
      startAnimation();
    };

    // ========== TOUCH EVENTS (Mobile) ==========
    const handleTouchStart = (e: TouchEvent) => {
      // Animatsiyani to'xtatish
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        isAnimating = false;
      }
      
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      touchVelocity = 0;
      
      // Hozirgi pozitsiyani sinxronlash
      targetScrollY = window.scrollY;
      currentScrollY = window.scrollY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      const currentTouchY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentTouchY; // Yuqoriga siljiganda +, pastga -
      
      // Velocity hisoblash (inertia uchun)
      touchVelocity = deltaY;
      lastTouchY = currentTouchY;
      
      // Target pozitsiyani yangilash (sekinroq)
      targetScrollY += deltaY * speed;
      clampTarget();
      
      // To'g'ridan-to'g'ri scroll (yumshoq)
      currentScrollY += (targetScrollY - currentScrollY) * 0.3;
      window.scrollTo(0, currentScrollY);
    };

    const handleTouchEnd = () => {
      // Inertia effekti - barmoqni ko'targanda davom etsin
      if (Math.abs(touchVelocity) > 5) {
        // Inertia miqdori
        const inertia = touchVelocity * speed * 8;
        targetScrollY += inertia;
        clampTarget();
        startAnimation();
      }
    };

    // ========== KEYBOARD EVENTS ==========
    const handleKeydown = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      
      if (!scrollKeys.includes(e.key)) return;
      
      const tagName = (e.target as HTMLElement).tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return;

      e.preventDefault();

      let delta = 0;
      const pageAmount = window.innerHeight * 0.8;
      const arrowAmount = 100;

      switch (e.key) {
        case 'ArrowUp':
          delta = -arrowAmount * speed;
          break;
        case 'ArrowDown':
          delta = arrowAmount * speed;
          break;
        case 'PageUp':
          delta = -pageAmount * speed;
          break;
        case 'PageDown':
        case ' ':
          delta = pageAmount * speed;
          break;
        case 'Home':
          targetScrollY = 0;
          startAnimation();
          return;
        case 'End':
          targetScrollY = document.documentElement.scrollHeight - window.innerHeight;
          startAnimation();
          return;
      }

      targetScrollY += delta;
      clampTarget();
      startAnimation();
    };

    // Sinxronlash
    const syncScroll = () => {
      if (!isAnimating) {
        targetScrollY = window.scrollY;
        currentScrollY = window.scrollY;
      }
    };

    // ========== EVENT LISTENERS ==========
    // Wheel (desktop)
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Touch (mobile)
    if (isTouchDevice) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Keyboard
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', syncScroll);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      
      if (isTouchDevice) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
      
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', syncScroll);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed, smoothness, enabled]);
}

export default useSmoothScroll;
