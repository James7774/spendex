"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFinance } from "@/context/FinanceContext";
import { useEffect, useState } from "react";
import { 
  UserIcon 
} from "@/components/Icons";
import styles from "@/app/dashboard/dashboard.module.css";

import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();
  const { t, isOverlayOpen } = useFinance();
  
  const isActive = (path: string) => pathname === path;

  // Responsive state detection
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const currentHeight = vv.height;
        const screenHeight = window.screen.height;
        
        // Accurate keyboard detection using visual viewport
        const isKeyboardVisible = currentHeight < screenHeight * 0.8;
        setIsKeyboardOpen(isKeyboardVisible);
        
        setIsLandscape(vv.width > currentHeight && currentHeight < 550);
      } else {
        const currentHeight = window.innerHeight;
        const screenHeight = window.screen.height;
        setIsKeyboardOpen(currentHeight < screenHeight * 0.75);
      }
    };

    const handleFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
          setIsKeyboardOpen(true);
        }
    };

    const handleBlur = () => {
        // Defer to check actual layout after transition
        setTimeout(handleResize, 300);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // Only show on dashboard pages
  if (!pathname.startsWith('/dashboard')) return null;

  const navItems = [
    { href: "/dashboard", label: t.dashboardShort, icon: (
      <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { href: "/dashboard/transactions", label: t.transactionsShort, icon: (
      <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )},
    { href: "/dashboard/charts", label: t.chartsShort, icon: (
      <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )},
    { href: "/dashboard/goals", label: t.goalsShort, icon: (
      <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    )},
    { href: "/dashboard/settings", label: "Profil", icon: <UserIcon className={styles.navIcon} size={24} /> },
  ];

  return (
    <div 
        className={styles.bottomNavWrapper}
        style={{ 
            display: (isKeyboardOpen || isLandscape || isOverlayOpen) ? 'none' : 'flex',
            opacity: (isKeyboardOpen || isLandscape || isOverlayOpen) ? 0 : 1,
            transform: (isKeyboardOpen || isLandscape || isOverlayOpen) ? 'translateY(20px)' : 'translateY(0)',
            transition: (isKeyboardOpen || isLandscape || isOverlayOpen) ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            visibility: (isKeyboardOpen || isLandscape || isOverlayOpen) ? 'hidden' : 'visible'
        }}
    >
        <nav className={styles.bottomNav}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className={`${styles.bottomNavItem} ${active ? styles.bottomNavActive : ""}`}>
                <div className={styles.iconContainer}>
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-active-pill"
                      className={styles.activePill}
                      transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    />
                  )}
                  {item.icon}
                </div>
                <span style={{ position: 'relative', zIndex: 1, fontSize: '0.7rem' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
    </div>
  );
}
