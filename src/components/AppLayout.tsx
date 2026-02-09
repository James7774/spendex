"use client";
import { useState, useEffect } from 'react';
import ChatBot from "@/components/ChatBot";
import AndroidOptimizer from "@/components/AndroidOptimizer";
import Onboarding from "@/components/Onboarding";
import PinLock from "@/components/PinLock";
import { SplashScreen as CapSplash } from '@capacitor/splash-screen';
import dynamic from "next/dynamic";
import { useFinance } from "@/context/FinanceContext";
import { motion } from "framer-motion";

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), { 
  ssr: false,
  loading: () => <div style={{ position: 'fixed', inset: 0, background: '#0a0c10', zIndex: 99999 }} />
});

import { usePathname } from 'next/navigation';

import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isOverlayOpen } = useFinance();
  const pathname = usePathname();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Splash State
  const [showSplash, setShowSplash] = useState(true);
  const [splashOpacity, setSplashOpacity] = useState(1);

  useEffect(() => {
    // Check onboarding status
    const seen = localStorage.getItem('hasSeenOnboarding') === 'true';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasSeenOnboarding(seen);

    // Splash Logic
    const shouldSkipSplash = sessionStorage.getItem('finova_skip_splash');
    if (shouldSkipSplash) {
        setShowSplash(false);
    } else {
        const fadeTimer = setTimeout(() => {
           setSplashOpacity(0);
        }, 3000); // Start fading after 3 seconds
    
        const removeTimer = setTimeout(() => {
           setShowSplash(false);
        }, 3500); // Fully remove after 3.5 seconds
        
        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(removeTimer);
        };
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    CapSplash.hide();
  }, []);

  const handleOnboardingFinish = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  // Prevent ANY rendering including dashboard flash while checking or mounting
  if (!isMounted || hasSeenOnboarding === null) {
      return (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--background)', zIndex: 9999999 }}>
           <SplashScreen />
        </div>
      );
  }

  // Case 1: Not logged in -> Show Onboarding/Auth
  if (user === null) {
    return (
      <>
        <AndroidOptimizer />
        <Onboarding onFinish={handleOnboardingFinish} />
        {showSplash && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999999, opacity: splashOpacity, transition: 'opacity 0.5s', pointerEvents: 'none' }}>
             <SplashScreen />
          </div>
        )}
      </>
    );
  }

  // Case 2: Logged in -> Show App
  return (
    <>
        <AndroidOptimizer />
        <PinLock />
        <motion.div 
            animate={{ 
                opacity: isOverlayOpen ? 0.4 : 1, 
                scale: isOverlayOpen ? 0.98 : 1,
                filter: isOverlayOpen ? 'blur(10px)' : 'blur(0px)'
            }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{ 
                width: '100%',
                pointerEvents: isOverlayOpen ? 'none' : 'auto',
                willChange: 'transform, filter, opacity'
            }}
        >
            {children}
        </motion.div>
        
        {/* Global UI Elements outside of animation container for stability */}
        <BottomNav />
        
        {pathname === '/dashboard/settings' && <ChatBot />}
        {showSplash && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999999, opacity: splashOpacity, transition: 'opacity 0.5s', pointerEvents: 'none' }}>
             <SplashScreen />
          </div>
        )}
    </>
  );
}
