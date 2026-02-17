"use client";
import React, { useState, useEffect, useRef } from "react";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, user } = useFinance();
  const router = useRouter();
  
  const tabOrder = [
    '/dashboard',
    '/dashboard/transactions',
    '/dashboard/charts',
    '/dashboard/goals',
    '/dashboard/settings'
  ];

  const [direction, setDirection] = useState(0);
  const [prevPath, setPrevPath] = useState(pathname);

  // Senior Logic: Sync direction immediately to prevent frame mismatch
  if (pathname !== prevPath) {
    const currentIndex = tabOrder.indexOf(pathname);
    const prevIndex = tabOrder.indexOf(prevPath);
    
    if (currentIndex !== -1 && prevIndex !== -1) {
      setDirection(currentIndex > prevIndex ? 1 : -1);
    }
    setPrevPath(pathname);
  }

  const isActive = (path: string) => pathname === path;

  // PREMIUM TELEGRAM-LIKE ANIMATION (Optimized for Android Performance)
  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      zIndex: 0,
    }),
    animate: {
      x: 0,
      zIndex: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      zIndex: 0,
    }),
  };

  const getPageTitle = () => {
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
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            {getPageTitle()}
          </div>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
             <DashboardIcon size={20} /> {t.dashboard}
          </Link>
          <Link href="/dashboard/transactions" className={`${styles.navItem} ${isActive('/dashboard/transactions') ? styles.active : ''}`}>
             <TransactionsIcon size={20} /> {t.transactions}
          </Link>
          <Link href="/dashboard/charts" className={`${styles.navItem} ${isActive('/dashboard/charts') ? styles.active : ''}`}>
             <ChartsIcon size={20} /> {t.charts}
          </Link>
          <Link href="/dashboard/goals" className={`${styles.navItem} ${isActive('/dashboard/goals') ? styles.active : ''}`}>
             <GoalsIcon size={20} /> {t.goals}
          </Link>
          <Link href="/dashboard/settings" className={`${styles.navItem} ${isActive('/dashboard/settings') ? styles.active : ''}`}>
             <UserIcon size={20} /> Profil
          </Link>
        </nav>

        {user && (
            <div className={styles.userProfile} onClick={() => router.push('/dashboard/settings')}>
              <div className={styles.avatar}>
                  {user.avatar ? <Image src={user.avatar} alt="avatar" width={48} height={48} /> : user.name?.charAt(0).toUpperCase() || 'U'}
                  <div className={styles.statusDotSmall} />
              </div>
              <div className={styles.userInfo}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p className={styles.username}>{user.name}</p>
                  <EditBoxIcon size={18} color="var(--text-secondary)" />
                </div>
                <p className={styles.plan}>{user.phone}</p>
              </div>
            </div>
        )}
      </aside>

      <main className={styles.main}>
        {pathname !== '/dashboard/settings' && pathname !== '/dashboard' && (
          <header className={styles.mobileHeader}>
            <div className={styles.brand}>{getPageTitle()}</div>
          </header>
        )}

        <div 
          className={`${styles.contentContainer} ${(pathname === '/dashboard/settings' || pathname === '/dashboard') ? styles.fullScreenContent : ''}`}
          style={{ 
            position: 'relative', 
            overflow: 'hidden',
            background: 'var(--background)',
            minHeight: '100vh',
            display: 'grid', // Use grid to stack exiting/entering elements perfectly
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
                  x: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.28 }
                }}
                style={{
                  gridColumn: 1, // Stack them on top of each other
                  gridRow: 1,
                  width: '100%',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
