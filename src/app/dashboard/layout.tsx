"use client";
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

  // Dashboard Layout should be focused on structural organization
  // Responsive behaviors for BottomNav are handled by the component itself outside the animation container

  // Dynamic Title Helper
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
      {/* Sidebar - Desktop Only */}
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

      {/* Main Content */}
      <main className={styles.main}>
        {/* Mobile Header - Hidden on Profile and Dashboard pages for custom headers */}
        {pathname !== '/dashboard/settings' && pathname !== '/dashboard' && (
          <header 
            className={styles.mobileHeader}
          >
            <div className={styles.brand}>
              {getPageTitle()}
            </div>
          </header>
        )}

        <div className={`${styles.contentContainer} ${(pathname === '/dashboard/settings' || pathname === '/dashboard') ? styles.fullScreenContent : ''}`}>
            {children}
        </div>
      </main>
    </div>
  );
}
