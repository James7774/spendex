"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import { useFinance } from "@/context/FinanceContext";
import { 
  DashboardIcon, 
  TransactionsIcon, 
  ChartsIcon, 
  GoalsIcon, 
  UserIcon
} from "@/components/Icons";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

// FrozenRoute avoids re-rendering the exiting page during transition
const FrozenRoute = memo(({ children }: { children: React.ReactNode }) => {
  const context = useRef(children);
  return <div style={{ height: '100%', width: '100%' }}>{context.current}</div>;
});
FrozenRoute.displayName = 'FrozenRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useFinance();
  
  const tabOrder = ['/dashboard', '/dashboard/transactions', '/dashboard/charts', '/dashboard/goals', '/dashboard/settings'];
  const [direction, setDirection] = useState(0);
  const [prevPath, setPrevPath] = useState(pathname);

  // Senior Fix: Force body background to match header to hide sub-pixel gaps
  useEffect(() => {
    const isDashboard = pathname === '/dashboard';
    document.body.style.background = isDashboard ? 'var(--background)' : '#0a0c10';
    document.documentElement.style.background = isDashboard ? 'var(--background)' : '#0a0c10';
    
    return () => {
      document.body.style.background = '';
      document.documentElement.style.background = '';
    };
  }, [pathname]);

  // Synchronize direction based on navigation
  useEffect(() => {
    if (pathname !== prevPath) {
      const currentIndex = tabOrder.indexOf(pathname);
      const prevIndex = tabOrder.indexOf(prevPath);
      if (currentIndex !== -1 && prevIndex !== -1) {
        setDirection(currentIndex > prevIndex ? 1 : -1);
      }
      setPrevPath(pathname);
    }
  }, [pathname, prevPath, tabOrder]);

  // Handle Swipe logic removed as requested for 'oddiy o'taversin'

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15, ease: [0, 0, 0.2, 1] as const } },
    exit: { opacity: 0, transition: { duration: 0.1, ease: [0.4, 0, 1, 1] as const } },
  };

  const isActive = (path: string) => pathname === path;
  
  const getPageTitle = (path: string) => {
    switch(path) {
      case '/dashboard': return 'Dashboard';
      case '/dashboard/transactions': return t.transactions;
      case '/dashboard/charts': return t.charts;
      case '/dashboard/goals': return t.goals;
      case '/dashboard/settings': return 'Profil';
      default: return 'Spendex';
    }
  };

  const isFullPage = (path: string) => path === '/dashboard' || path === '/dashboard/settings';

  return (
    <div className={styles.layout} style={{ 
      background: '#0a0c10', 
      overflow: 'hidden', 
      width: '100vw', 
      height: '100dvh',
      margin: 0,
      padding: 0
    }}>
      {/* Sidebar - Desktop Only */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}><div className={styles.brand}>Spendex</div></div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}><DashboardIcon size={20} /> {t.dashboard}</Link>
          <Link href="/dashboard/transactions" className={`${styles.navItem} ${isActive('/dashboard/transactions') ? styles.active : ''}`}><TransactionsIcon size={20} /> {t.transactions}</Link>
          <Link href="/dashboard/charts" className={`${styles.navItem} ${isActive('/dashboard/charts') ? styles.active : ''}`}><ChartsIcon size={20} /> {t.charts}</Link>
          <Link href="/dashboard/goals" className={`${styles.navItem} ${isActive('/dashboard/goals') ? styles.active : ''}`}><GoalsIcon size={20} /> {t.goals}</Link>
          <Link href="/dashboard/settings" className={`${styles.navItem} ${isActive('/dashboard/settings') ? styles.active : ''}`}><UserIcon size={20} /> Profil</Link>
        </nav>
      </aside>

      <main className={styles.main} style={{ 
        position: 'relative', 
        height: '100dvh', 
        width: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <AnimatePresence custom={direction} initial={false}>
            <motion.div
            key={pathname}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={styles.pageMotionWrapper}
            style={{
              position: 'absolute',
              inset: 0,
              width: '101vw', // Precise bleed
              marginLeft: '-0.5vw',
              height: '100%',
              background: 'var(--background)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              margin: 0,
              padding: 0,
            }}
          >
            {/* Header */}
            {!isFullPage(pathname) && (
              <header className={styles.mobileHeader} style={{ flexShrink: 0 }}>
                <div className={styles.brand}>{getPageTitle(pathname)}</div>
              </header>
            )}
            
            {/* Page Content */}
            <div 
              style={{ 
                flex: 1, 
                width: '100%',
                overflowY: 'auto', 
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '100px'
              }}
              className={styles.fullWidthLayout}
            >
              <FrozenRoute key={pathname}>
                {children}
              </FrozenRoute>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
