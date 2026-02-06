"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import { useFinance } from "@/context/FinanceContext";
import { useEffect, useState } from "react";
import { 
  DashboardIcon, 
  TransactionsIcon, 
  ChartsIcon, 
  GoalsIcon, 
  UserIcon,
  EditBoxIcon
} from "@/components/Icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, user } = useFinance();
  const router = useRouter();
  // Helper to check active link
  const isActive = (path: string) => pathname === path;

  // Responsive state detection
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const currentWidth = window.innerWidth;
      const screenHeight = window.screen.height;
      
      setIsLandscape(currentWidth > currentHeight && currentHeight < 550);

      // Keyboard detection threshold
      const isKeyboardVisible = currentHeight < screenHeight * 0.75;
      setIsKeyboardOpen(isKeyboardVisible);
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        setIsKeyboardOpen(true);
      }
    };

    const handleBlur = () => {
      // Defer to resize listener for accurate check on blur
      setTimeout(handleResize, 100);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return (
    <div className={styles.layout}>
      {/* Sidebar - Desktop Only */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <span className={styles.brandHighlight}>Fi</span>nova
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
            <div 
                className={styles.userProfile} 
                onClick={() => router.push('/dashboard/settings')}
                style={{ cursor: 'pointer' }}
            >
              <div className={styles.avatar}>
                  {user.avatar ? (
                      <Image src={user.avatar} alt="avatar" width={48} height={48} />
                  ) : (
                      user.name?.charAt(0).toUpperCase() || 'U'
                  )}
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

      {/* Main Content */}
      <main className={styles.main}>
        {/* Mobile Header - Hidden on Profile page for Uzum-style full screen */}
        {pathname !== '/dashboard/settings' && (
          <header 
            className={styles.mobileHeader}
          >
            <div className={styles.brand}>
              <span className={styles.brandHighlight}>Fi</span>nova
            </div>
            
            <div className={styles.mobileProfile} onClick={() => router.push('/dashboard/settings')}>
               {user?.avatar ? (
                 <Image 
                   src={user.avatar} 
                   alt="me" 
                   width={36} 
                   height={36} 
                   className={styles.mobileAvatarImg}
                   unoptimized
                 />
               ) : (
                  <div>{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
               )}
            </div>
          </header>
        )}

        <div className={`${styles.contentContainer} ${pathname === '/dashboard/settings' ? styles.fullScreenContent : ''}`}>
            {children}
        </div>

        {/* Bottom Navigation Wrapper - Handles Safe Area and Positioning */}
        <div 
            className={styles.bottomNavWrapper}
            style={{ 
                transform: (isKeyboardOpen || isLandscape) ? 'translateY(150%)' : 'translateY(0)',
                opacity: (isKeyboardOpen || isLandscape) ? 0 : 1,
                visibility: (isKeyboardOpen || isLandscape) ? 'hidden' : 'visible',
                transition: (isKeyboardOpen || isLandscape) 
                    ? 'all 0.2s ease-in' 
                    : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            <nav className={styles.bottomNav}>
              <Link href="/dashboard/transactions" className={`${styles.bottomNavItem} ${isActive('/dashboard/transactions') ? styles.bottomNavActive : ''}`}>
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>{t.transactionsShort}</span>
              </Link>
              <Link href="/dashboard/charts" className={`${styles.bottomNavItem} ${isActive('/dashboard/charts') ? styles.bottomNavActive : ''}`}>
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span>{t.chartsShort}</span>
              </Link>
              <Link href="/dashboard" className={`${styles.bottomNavItem} ${isActive('/dashboard') ? styles.bottomNavActive : ''}`}>
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>{t.dashboardShort}</span>
              </Link>
              <Link href="/dashboard/goals" className={`${styles.bottomNavItem} ${isActive('/dashboard/goals') ? styles.bottomNavActive : ''}`}>
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                <span>{t.goalsShort}</span>
              </Link>
              <Link href="/dashboard/settings" className={`${styles.bottomNavItem} ${isActive('/dashboard/settings') ? styles.bottomNavActive : ''}`}>
                <UserIcon className={styles.navIcon} size={24} />
                <span>Profil</span>
              </Link>
            </nav>
        </div>
      </main>
    </div>
  );
}
