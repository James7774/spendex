"use client";
import { usePathname, useRouter } from "next/navigation";
import { useFinance } from "@/context/FinanceContext";
import React, { useEffect, useState, useMemo } from "react";
import { UserIcon } from "@/components/Icons";
import styles from "@/app/dashboard/dashboard.module.css";
import { motion, AnimatePresence } from "framer-motion";

const getNavItems = (t: any) => [
  { href: "/dashboard", label: t.dashboardShort || "Asosiy", iconId: "home" },
  { href: "/dashboard/transactions", label: t.transactionsShort || "Chiqim", iconId: "transactions" },
  { href: "/dashboard/charts", label: t.chartsShort || "Grafik", iconId: "charts" },
  { href: "/dashboard/goals", label: t.goalsShort || "Maqsad", iconId: "goals" },
  { href: "/dashboard/settings", label: "Profil", iconId: "profile" },
];

const NavIcon = ({ id, active }: { id: string; active?: boolean }) => {
  const strokeWidth = active ? "2.5" : "2";
  switch (id) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case "transactions":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      );
    case "charts":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      );
    case "goals":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        </svg>
      );
    case "profile":
      return <div className={styles.navIcon}><UserIcon size={active ? 22 : 20} /></div>;
    default:
      return null;
  }
};

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, isOverlayOpen } = useFinance();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
  const navItems = useMemo(() => getNavItems(t), [t]);

  useEffect(() => {
    const handleResize = () => {
      const isVisible = window.visualViewport ? window.visualViewport.height < window.screen.height * 0.8 : window.innerHeight < window.screen.height * 0.75;
      setIsKeyboardOpen(isVisible);
    };
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!pathname.startsWith('/dashboard')) return null;

  return (
    <div 
      className={styles.bottomNavWrapper}
      style={{ 
        display: (isKeyboardOpen || isOverlayOpen) ? 'none' : 'flex',
        pointerEvents: 'none' 
      }}
    >
      <nav 
        className={styles.bottomNav} 
        style={{ pointerEvents: 'auto', position: 'relative' }}
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <div 
              key={item.href} 
              onClick={() => router.push(item.href)}
              className={`${styles.bottomNavItem} ${active ? styles.bottomNavActive : ""}`}
              style={{ 
                zIndex: active ? 10 : 1,
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
              } as React.CSSProperties}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Sliding pill indicator - Minimal & Modest */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className={styles.activePill}
                    style={{ 
                      background: 'var(--text-main)', // Adaptive monochrome
                      opacity: 0.08,
                      border: 'none',
                      borderRadius: '20px'
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>
              
              <div 
                className={styles.iconContainer}
                style={{
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                  color: active ? 'var(--text-main)' : 'var(--text-secondary)' // Monochrome icons
                }}
              >
                 <NavIcon id={item.iconId} active={active} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.68rem', 
                  fontWeight: active ? '800' : '600',
                  zIndex: 2,
                  pointerEvents: 'none',
                  color: active ? 'var(--text-main)' : 'var(--text-secondary)', // Monochrome text
                  transition: 'color 0.2s ease, font-weight 0.2s ease',
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
