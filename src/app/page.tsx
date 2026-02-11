"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./landing.module.css";
import { 
  Download, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3,
  PieChart, 
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Zap,
  Moon,
  Sun,
  Globe,
  ChevronDown
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";

export default function Home() {
  const router = useRouter();
  const { user, darkMode, toggleTheme, language, setLanguage, t } = useFinance();
  const [isLangOpen, setLangOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/finova-v1.0.apk';
    link.download = 'finova-v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className={`${styles.container} ${!darkMode ? styles.lightMode : ''}`}>
      {/* Animated Background */}
      <div className={styles.backgroundEffects}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div style={{ background: '#4f46e5', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={18} color="white" />
          </div>
          Finova
        </div>
        
        <div className={styles.navActions}>
            <div className={styles.controlsGroup}>
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className={styles.iconBtn}>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Language Toggle */}
              <div className={styles.langWrapper}>
                <button
                  className={styles.langTrigger}
                  onClick={() => setLangOpen(!isLangOpen)}
                  onBlur={() => setTimeout(() => setLangOpen(false), 200)} // Delay to allow click
                >
                  <Globe size={18} />
                  <span>{language === 'uz' ? "O'zbek" : language === 'ru' ? "Русский" : "English"}</span>
                  <ChevronDown size={14} style={{ opacity: 0.6 }} />
                </button>

                {/* Custom Dropdown */}
                <div className={`${styles.langDropdown} ${isLangOpen ? styles.show : ''}`}>
                  <div className={styles.langOption} onClick={() => { setLanguage('uz'); setLangOpen(false); }}>
                    <span>🇺🇿</span> O'zbek
                  </div>
                  <div className={styles.langOption} onClick={() => { setLanguage('ru'); setLangOpen(false); }}>
                    <span>🇷🇺</span> Русский
                  </div>
                  <div className={styles.langOption} onClick={() => { setLanguage('en'); setLangOpen(false); }}>
                    <span>🇺🇸</span> English
                  </div>
                </div>
            </div>
            </div>

            {/* Always show Download button instead of Dashboard */}
            <button onClick={handleDownload} className={styles.dashboardBtn}>
                <Download size={18} style={{ marginRight: '8px' }} />
                {t.landingPage?.hero.download || "Yuklab Olish"}
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className={styles.heroSection}>
        {/* Left Content */}
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <div className={styles.badgeDot} />
            <span>{t.landingPage?.hero.badge || "Android uchun maxsus"}</span>
          </div>
          
          <h1 className={styles.title}>
            {t.landingPage?.hero.title || "Barcha Moliya"} <br />
            <span>{t.landingPage?.hero.titleHighlight || "Bitta Ilovada."}</span>
          </h1>
          
          <p className={styles.description}>
            {t.landingPage?.hero.description || "Pullaringiz qayerga ketayotganini aniq bilib, kelajagingiz uchun to'g'ri qarorlar qabul qiling."}
          </p>
          
          <div className={styles.ctaGroup}>
            <button className={styles.primaryBtn} onClick={handleDownload} style={{ width: '100%', maxWidth: '300px', justifyContent: 'center' }}>
              <Download size={24} /> 
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8, lineHeight: 1 }}>
                    {t.landingPage?.hero.forAndroid || "Android uchun"}
                </div>
                <div style={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                    {t.landingPage?.hero.download || "APK Yuklab Olish"}
                </div>
              </div>
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
              {t.landingPage?.hero.version || "v1.0.2 • 15 MB • Android 8.0+"}
            </p>
          </div>
        </div>

        {/* Right Visual (3D Phone) */}
        <div className={styles.heroVisual}>
          <div className={styles.phoneWrapper}>
            <div className={styles.phone}>
              <div className={styles.notch} />
              <div className={styles.phoneReflection} />
              
              {/* App Screen Simulation */}
              <div className={styles.screen}>
                
                {/* Header */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', marginTop: '1rem'}}>
                    <div style={{color: 'white', fontWeight: 'bold'}}>Salom, Elyor</div>
                    <div style={{width: 32, height: 32, borderRadius: '50%', background: '#374151'}} />
                </div>

                {/* Balance Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                  borderRadius: '24px',
                  padding: '24px',
                  color: 'white',
                  marginBottom: '20px',
                  boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
                }}>
                  <div style={{opacity: 0.8, fontSize: '0.8rem', marginBottom: '4px'}}>{t.totalBalance}</div>
                  <div style={{fontSize: '1.8rem', fontWeight: '800'}}>12,500,000</div>
                  <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
                    <div style={{background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem'}}>+15% o&apos;sish</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'}}>
                   <div style={{background: '#1f2937', padding: '16px', borderRadius: '20px'}}>
                      <TrendingUp color="#10b981" size={20} style={{marginBottom: '8px'}}/>
                      <div style={{color: '#9ca3af', fontSize: '0.75rem'}}>{t.income}</div>
                      <div style={{color: 'white', fontWeight: 'bold'}}>+4.2M</div>
                   </div>
                   <div style={{background: '#1f2937', padding: '16px', borderRadius: '20px'}}>
                      <BarChart3 color="#ef4444" size={20} style={{marginBottom: '8px'}}/>
                      <div style={{color: '#9ca3af', fontSize: '0.75rem'}}>{t.expense}</div>
                      <div style={{color: 'white', fontWeight: 'bold'}}>-1.8M</div>
                   </div>
                </div>

                {/* Transactions List */}
                <div style={{flex: 1}}>
                  <div style={{color: 'white', fontWeight: 'bold', marginBottom: '12px'}}>{t.recentTransactionsShort}</div>
                  {[1, 2].map((i) => (
                    <div key={i} style={{background: '#1f2937', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                           <div style={{width: 40, height: 40, borderRadius: '12px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <ShieldCheck size={18} color="#9ca3af" />
                           </div>
                           <div>
                              <div style={{color: 'white', fontSize: '0.9rem', fontWeight: '500'}}>Oziq-ovqat</div>
                              <div style={{color: '#6b7280', fontSize: '0.75rem'}}>Bugun, 14:30</div>
                           </div>
                        </div>
                        <div style={{color: 'white', fontWeight: 'bold'}}>-150,000</div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
          
          {/* Floating Cards */}
          <div className={`${styles.floatingCard} ${styles.cardRight}`}>
              <div style={{background: '#10b981', padding: '8px', borderRadius: '12px'}}>
                 <ArrowUpRight color="white" size={20} />
              </div>
              <div>
                 <div style={{color: '#9ca3af', fontSize: '10px'}}>Muvaffaqiyatli</div>
                 <div style={{color: 'white', fontWeight: 'bold'}}>To'lov qabul qilindi</div>
              </div>
          </div>
        </div>
      </main>

      {/* Why Finova? Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>{t.landingPage?.features.title}</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconBox} style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Zap size={24} />
            </div>
            <h3>{t.landingPage?.features.fast.title}</h3>
            <p>{t.landingPage?.features.fast.desc}</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconBox} style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
              <PieChart size={24} />
            </div>
            <h3>{t.landingPage?.features.control.title}</h3>
            <p>{t.landingPage?.features.control.desc}</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconBox} style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <Lock size={24} />
            </div>
            <h3>{t.landingPage?.features.secure.title}</h3>
            <p>{t.landingPage?.features.secure.desc}</p>
          </div>
        </div>
      </section>

      {/* Who is it for? Section */}
      <section className={styles.audienceSection}>
        <div className={styles.audienceContent}>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '2rem' }}>
            {t.landingPage?.audience.title}
          </h2>
          <div className={styles.audienceList}>
            <div className={styles.audienceItem}>
              <CheckCircle2 color="#4f46e5" size={24} />
              <div>
                <h4>{t.landingPage?.audience.students.title}</h4>
                <p>{t.landingPage?.audience.students.desc}</p>
              </div>
            </div>
            <div className={styles.audienceItem}>
              <CheckCircle2 color="#4f46e5" size={24} />
              <div>
                <h4>{t.landingPage?.audience.families.title}</h4>
                <p>{t.landingPage?.audience.families.desc}</p>
              </div>
            </div>
            <div className={styles.audienceItem}>
              <CheckCircle2 color="#4f46e5" size={24} />
              <div>
                <h4>{t.landingPage?.audience.business.title}</h4>
                <p>{t.landingPage?.audience.business.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.logo}>Finova</div>
          <p>{t.landingPage?.footer}</p>
        </div>
      </footer>
    </div>
  );
}
