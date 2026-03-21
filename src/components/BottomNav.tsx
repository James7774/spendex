"use client";
import { usePathname, useRouter } from "next/navigation";
import { useFinance } from "@/context/FinanceContext";
import React, { useEffect, useState, useMemo } from "react";
import { UserIcon } from "@/components/Icons";
import styles from "@/app/dashboard/dashboard.module.css";

import Link from "next/link";

const getNavItems = (t: any) => [
  { href: "/dashboard", label: t.dashboardShort || "Home", iconId: "home" },
  { href: "/dashboard/transactions", label: t.transactionsShort || "History", iconId: "transactions" },
  { href: "/dashboard/charts", label: t.chartsShort || "Chart", iconId: "charts" },
  { href: "/dashboard/goals", label: t.goalsShort || "Goal", iconId: "goals" },
  { href: "/dashboard/settings", label: "Profil", iconId: "profile" },
];

const BRAND_COLOR = "#6366f1"; // Global professional brand color

const NavIcon = ({ id, active }: { id: string; active?: boolean }) => {
  const iconColor = active ? BRAND_COLOR : "var(--text-secondary)";
  const strokeWidth = active ? "2.5" : "2";

  switch (id) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case "transactions":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "charts":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      );
    case "goals":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        </svg>
      );
    case "profile":
      return <div className={styles.navIcon} style={{ color: iconColor }}><UserIcon size={20} strokeWidth={strokeWidth} /></div>;
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
        zIndex: 9999, // Ensure it's above everything
        pointerEvents: 'auto'
      }}
    >
      <nav 
        className={styles.bottomNav} 
        style={{ 
          position: 'relative', 
          height: '66px', 
          borderRadius: '28px',
          padding: '0 8px',
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <div 
              key={item.href} 
              onClick={() => {
                if (!active) router.push(item.href);
              }}
              className={styles.bottomNavItem}
              style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                height: '100%',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                zIndex: 10000
              } as React.CSSProperties}
            >
              <div 
                style={{
                  width: '46px',
                  height: '30px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? `${BRAND_COLOR}15` : 'transparent',
                  transition: 'all 0.2s ease',
                  marginBottom: '2px'
                }}
              >
                 <NavIcon id={item.iconId} active={active} />
              </div>

              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: active ? '850' : '600',
                  color: active ? BRAND_COLOR : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.01em'
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
