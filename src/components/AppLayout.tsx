"use client";
import { useState, useEffect } from 'react';
import AndroidOptimizer from "@/components/AndroidOptimizer";
import Onboarding from "@/components/Onboarding";
import PinLock from "@/components/PinLock";
import { SplashScreen as CapSplash } from '@capacitor/splash-screen';
import dynamic from "next/dynamic";
import { useFinance } from "@/context/FinanceContext";

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
    const shouldSkipSplash = sessionStorage.getItem('spendex_skip_splash');
    if (shouldSkipSplash) {
        setShowSplash(false);
    } else {
        const fadeTimer = setTimeout(() => {
           setSplashOpacity(0);
        }, 1800); // Start fading after 1.8 seconds
    
        const removeTimer = setTimeout(() => {
           setShowSplash(false);
        }, 2200); // Fully remove after 2.2 seconds
        
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

  // Check if current path is a public policy page
  const isPublicPolicyPage = ['/privacy-policy', '/delete-account'].includes(pathname);

  // Prevent ANY rendering including dashboard flash while checking or mounting
  if (!isMounted || hasSeenOnboarding === null) {
      if (isPublicPolicyPage) return <div>{children}</div>; // Render immediately for SEO/Review
      return (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--background)', zIndex: 9999999 }}>
           <SplashScreen />
        </div>
      );
  }

  // If it's a public policy page, just render it without app layouts like splash or onboarding
  if (isPublicPolicyPage) {
    return (
      <div className="min-h-screen bg-background">
        {children}
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
        <div style={{ width: '100vw', overflowX: 'hidden' }}>
            {children}
        </div>
        
        {/* Global UI Elements outside of animation container for stability */}
        <BottomNav />
        
        {showSplash && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999999, opacity: splashOpacity, transition: 'opacity 0.5s', pointerEvents: 'none' }}>
             <SplashScreen />
          </div>
        )}
    </>
  );
}
