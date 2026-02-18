"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import { useFinance } from "@/context/FinanceContext";
import { 
  DashboardIcon, 
  TransactionsIcon, 
  ChartsIcon, 
  GoalsIcon, 
  UserIcon,
  EditBoxIcon
} from "@/components/Icons";
import { motion, AnimatePresence } from "framer-motion";

// World Class Fix: The "Snapshot" Route Component
// This captures exactly how the page looked at mount and keeps it UNCHANGED during the exit animation.
const RouteSnapshot = memo(({ children, path }: { children: React.ReactNode, path: string }) => {
  return <div style={{ width: '100%', height: '100%' }}>{children}</div>;
});
RouteSnapshot.displayName = 'RouteSnapshot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, user } = useFinance();
  const router = useRouter();
  
  const tabOrder = ['/dashboard', '/dashboard/transactions', '/dashboard/charts', '/dashboard/goals', '/dashboard/settings'];
  const [direction, setDirection] = useState(0);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      const currentIndex = tabOrder.indexOf(pathname);
      const prevIndex = tabOrder.indexOf(prevPath);
      if (currentIndex !== -1 && prevIndex !== -1) {
        setDirection(currentIndex > prevIndex ? 1 : -1);
      }
      setPrevPath(pathname);
    }
  }, [pathname, prevPath]);

  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 1
    }),
    animate: {
      x: 0,
      opacity: 1,
      zIndex: 2,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-20%" : "20%", // Parallax exit (Premium effect)
      opacity: 0,
      zIndex: 0,
    }),
  };

  const isActive = (path: string) => pathname === path;
  const pageTitle = () => {
    switch(pathname) {
      case '/dashboard': return 'Dashboard';
      case '/dashboard/transactions': return t.transactions;
      case '/dashboard/charts': return t.charts;
      case '/dashboard/goals': return t.goals;
      case '/dashboard/settings': return 'Profil';
      default: return 'Finova';
    }
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}><div className={styles.brand}>{pageTitle()}</div></div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}><DashboardIcon size={20} /> {t.dashboard}</Link>
          <Link href="/dashboard/transactions" className={`${styles.navItem} ${isActive('/dashboard/transactions') ? styles.active : ''}`}><TransactionsIcon size={20} /> {t.transactions}</Link>
          <Link href="/dashboard/charts" className={`${styles.navItem} ${isActive('/dashboard/charts') ? styles.active : ''}`}><ChartsIcon size={20} /> {t.charts}</Link>
          <Link href="/dashboard/goals" className={`${styles.navItem} ${isActive('/dashboard/goals') ? styles.active : ''}`}><GoalsIcon size={20} /> {t.goals}</Link>
          <Link href="/dashboard/settings" className={`${styles.navItem} ${isActive('/dashboard/settings') ? styles.active : ''}`}><UserIcon size={20} /> Profil</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        {pathname !== '/dashboard/settings' && pathname !== '/dashboard' && (
          <header className={styles.mobileHeader}><div className={styles.brand}>{pageTitle()}</div></header>
        )}

        <div 
          className={`${styles.contentContainer} ${(pathname === '/dashboard/settings' || pathname === '/dashboard') ? styles.fullScreenContent : ''}`}
          style={{ 
            position: 'relative', 
            overflow: 'hidden',
            background: 'var(--background)',
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: '100%',
            gridTemplateRows: '100%',
          }}
        >
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={pathname}
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                style={{
                  gridColumn: 1,
                  gridRow: 1,
                  width: '100%',
                  willChange: 'transform',
                  transformStyle: 'preserve-3d'
                }}
              >
                <RouteSnapshot path={pathname}>
                  {children}
                </RouteSnapshot>
              </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
