"use client";
import React, { useState, useEffect, useRef } from "react";
import { useFinance, Language } from "@/context/FinanceContext";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { auth, googleAuthProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { 
  translations 
} from "@/locales";
import { 
  Check, 
  Globe, 
  User as UserIcon, 
  AlertCircle, 
  ChevronLeft,
  LogIn,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import BottomSheet from "@/components/BottomSheet";

interface OnboardingProps {
  onFinish: () => void;
}

type Step = 'language' | 'login' | 'profile';

export default function Onboarding({ onFinish }: OnboardingProps) {
  const { language, setLanguage, login, t: contextT } = useFinance();
  const [step, setStep] = useState<Step>('language');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use translations directly to ensure reactivity
  const t = (translations as any)[language] || contextT;
  const ot = t?.onboarding || {};

  // States
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<{ uid: string, email: string, photo: string } | null>(null);

  const getFlagUrl = (countryCode: string) => `https://flagcdn.com/w80/${countryCode}.png`;

  // Keyboard management: scroll input into view
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };
    window.addEventListener('focusin', handleFocus);
    return () => window.removeEventListener('focusin', handleFocus);
  }, []);

  const languages = [
    { code: 'en', name: 'English', country: 'gb' },
    { code: 'ru', name: 'Русский', country: 'ru' },
    { code: 'uz', name: "O'zbek", country: 'uz' },
    { code: 'es', name: 'Español', country: 'es' },
    { code: 'ar', name: 'العربية', country: 'sa' },
    { code: 'hi', name: 'हिन्दी', country: 'in' },
    { code: 'zh-Hans', name: '简体中文', country: 'cn' },
    { code: 'fr', name: 'Français', country: 'fr' },
    { code: 'pt-BR', name: 'Português', country: 'br' },
    { code: 'de', name: 'Deutsch', country: 'de' },
    { code: 'ja', name: '日本語', country: 'jp' },
  ];

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setIsLangModalOpen(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      let user;
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle();
        user = result.user;
      } else {
        const result = await signInWithPopup(auth, googleAuthProvider);
        user = result.user;
      }
      if (!user) throw new Error(ot.errorGoogle || "Error");
      const name = user.displayName || "";
      if (name) {
        login({ id: user.uid, name: name, phone: user.email || "", avatar: (user as any).photoURL || (user as any).photoUrl || "" });
        onFinish();
      } else {
        setUserData({ uid: user.uid, email: user.email || "", photo: (user as any).photoURL || (user as any).photoUrl || "" });
        setStep('profile');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(msg.toLowerCase().includes("cancel") ? ot.cancel : (ot.errorGoogle || "Error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError(ot.errorName);
      return;
    }
    login({ id: userData?.uid || Date.now().toString(), name: `${firstName} ${lastName}`, phone: userData?.email || "", avatar: userData?.photo || "" });
    onFinish();
  };

  const currentLangObj = languages.find(l => l.code === language) || languages.find(l => l.code === 'en') || languages[0];

  return (
    <div className="ob-wrapper view-container">
      <div className="ob-glow blue" />
      <div className="ob-glow purple" />
      
      <header className="ob-header">
        <div className="header-left">
          {step !== 'language' && (
            <button className="glass-back touch-active" onClick={() => setStep(step === 'profile' ? 'login' : 'language')}>
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
        <div className="ob-progress">
           {['language', 'login', 'profile'].map((s, i) => {
             const stepsArr: Step[] = ['language', 'login', 'profile'];
             const currentIdx = stepsArr.indexOf(step);
             return (
               <div key={s} className="progress-item">
                 <div className={`progress-bar-inner ${i <= currentIdx ? 'active' : ''}`} />
               </div>
             );
           })}
        </div>
        <div className="header-right" />
      </header>

      <main className="ob-main scroll-container" ref={scrollRef}>
        <div className="adaptive-content">
          {step === 'language' && (
            <div className="page-content animate-slide">
              <div className="icon-box blue-grad">
                 <Globe size={32} />
              </div>
              <h1 className="ob-title">{ot.langTitle}</h1>
              <p className="ob-subtitle">{ot.langSub}</p>
              
              {/* Language Selector Button */}
              <div className="lang-selector-container">
                  <button 
                    className="lang-selector-btn touch-active"
                    onClick={() => setIsLangModalOpen(true)}
                  >
                     <div className="selector-left">
                        <div className="selector-flag">
                            <Image 
                                src={getFlagUrl(currentLangObj.country)} 
                                alt={currentLangObj.name}
                                width={32}
                                height={22}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <span className="selector-name">{currentLangObj.name}</span>
                     </div>
                     <ChevronDown size={20} className={`selector-arrow ${isLangModalOpen ? 'open' : ''}`} />
                  </button>
              </div>

              <div className="spacer" />
              <button className="ob-primary-btn touch-active" onClick={() => setStep('login')}>
                <span>{ot.next}</span>
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 'login' && (
            <div className="page-content animate-slide">
              <div className="icon-box purple-grad">
                 <LogIn size={32} />
              </div>
              <h1 className="ob-title">{ot.loginTitle}</h1>
              <p className="ob-subtitle">{ot.loginSub}</p>

              <div className="auth-stack">
                 <button className="ob-google-btn touch-active" onClick={handleGoogleLogin} disabled={isLoading}>
                   {isLoading ? (
                      <div className="simple-loader">
                         <div className="spinner" />
                      </div>
                   ) : (
                     <><div className="g-logo"><svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/></svg></div>
                       <span>{ot.googleBtn}</span>
                     </>
                   )}
                 </button>
                 <button className="ob-outline-btn touch-active" onClick={handleGoogleLogin} disabled={isLoading}>{ot.createBtn}</button>
                 {error && <div className="ob-error"><AlertCircle size={16} /> {error}</div>}
              </div>
              <p className="ob-legal">{ot.legal}</p>
            </div>
          )}

          {step === 'profile' && (
            <div className="page-content animate-slide">
              <div className="icon-box green-grad">
                 <UserIcon size={32} />
              </div>
              <h1 className="ob-title">{ot.profileTitle}</h1>
              <p className="ob-subtitle">{ot.profileSub}</p>

              <div className="ob-form">
                 <div className="input-group">
                    <label>{ot.firstName}</label>
                    <input type="text" placeholder="..." value={firstName} onChange={e => setFirstName(e.target.value)} />
                 </div>
                 <div className="input-group">
                    <label>{ot.lastName}</label>
                    <input type="text" placeholder="..." value={lastName} onChange={e => setLastName(e.target.value)} />
                 </div>
                 {error && <div className="ob-error"><AlertCircle size={16} /> {error}</div>}
              </div>

              <div className="spacer" />
              <button className="ob-primary-btn touch-active" onClick={handleProfileSubmit} disabled={!firstName.trim() || !lastName.trim() || isLoading}>
                <span>{ot.confirm}</span>
                <Check size={20} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Language Bottom Sheet */}
      <BottomSheet
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        title={ot.selectLang || "Select Language"}
      >
        <div className="lang-list-scroll">
            {languages.map(l => (
            <button 
                key={l.code} 
                className={`lang-item touch-active ${language === l.code ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(l.code as Language)}
            >
                <div className="lang-left">
                    <span className="lang-flag">
                        <Image 
                            src={getFlagUrl(l.country)} 
                            alt={l.name} 
                            width={32} 
                            height={24} 
                            style={{ borderRadius: '4px', objectFit: 'cover' }}
                        />
                    </span>
                    <span className="lang-name">{l.name}</span>
                </div>
                {language === l.code && <Check size={20} color="#6366f1" />}
            </button>
            ))}
        </div>
      </BottomSheet>

      <style jsx>{`
        .ob-wrapper { 
          position: fixed; inset: 0; background: var(--background); z-index: 999999;
          display: flex; flex-direction: column; color: var(--text-main); overflow: hidden;
        }
        .ob-glow { position: absolute; width: min(400px, 80vw); height: min(400px, 80vw); border-radius: 50%; filter: blur(100px); opacity: 0.15; pointer-events: none; }
        .ob-glow.blue { top: -10%; left: -10%; background: var(--primary); }
        .ob-glow.purple { bottom: -10%; right: -10%; background: #8b5cf6; }

        .ob-header { 
          display: flex; align-items: center; justify-content: space-between; 
          padding: calc(var(--safe-top) + 1rem) var(--space-md) var(--space-md); 
        }
        .header-left, .header-right { width: var(--touch-target); }
        .glass-back {
          width: var(--touch-target); height: var(--touch-target); border-radius: 14px; 
          background: var(--surface); border: 1px solid var(--border); 
          display: flex; align-items: center; justify-content: center; color: var(--text-main);
          box-shadow: var(--shadow-sm); transition: all 0.2s;
        }
        .ob-progress { flex: 1; display: flex; gap: 8px; max-width: 220px; }
        .progress-item { flex: 1; height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .progress-bar-inner { width: 0; height: 100%; background: var(--primary); transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .progress-bar-inner.active { width: 100%; }

        .ob-main { 
          flex: 1; overflow-y: auto; display: flex; flex-direction: column; 
          padding-bottom: calc(var(--safe-bottom) + 20px); 
          scrollbar-width: none;
        }
        .ob-main::-webkit-scrollbar { display: none; }

        .adaptive-content { 
          flex: 1; display: flex; flex-direction: column; 
          max-width: 500px; width: 100%; margin: 0 auto; 
          padding: 0 var(--space-lg); 
        }
        .page-content { flex: 1; display: flex; flex-direction: column; align-items: center; width: 100%; }
        
        .icon-box { 
          width: 80px; height: 80px; border-radius: 24px; display: flex; align-items: center; justify-content: center; 
          margin-bottom: 1.5rem; margin-top: 1rem; box-shadow: var(--shadow-md); color: white;
        }
        .blue-grad { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
        .purple-grad { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .green-grad { background: linear-gradient(135deg, var(--success), #14b8a6); }

        .ob-title { 
          font-size: clamp(1.5rem, 7vw, 2.22rem); font-weight: 800; margin-bottom: 0.75rem; 
          text-align: center; letter-spacing: -0.02em; line-height: 1.2; color: var(--text-main);
        }
        .ob-subtitle { 
          font-size: 1rem; color: var(--text-secondary); text-align: center; 
          line-height: 1.6; margin-bottom: 2rem; max-width: 90%; 
        }

        .lang-selector-container {
            width: 100%;
            margin: 1rem 0 2rem;
        }
        .lang-selector-btn {
            width: 100%; height: 72px; background: var(--surface);
            border: 1px solid var(--border); border-radius: 20px;
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .lang-selector-btn:hover { border-color: var(--primary); background: var(--background); }
        .selector-left { display: flex; align-items: center; gap: 16px; }
        .selector-flag { width: 42px; height: 30px; border-radius: 6px; overflow: hidden; display: flex; box-shadow: 0 2px 6px rgba(0,0,0,0.1); flex-shrink: 0; }
        .selector-name { font-size: 1.1rem; font-weight: 750; color: var(--text-main); }
        .selector-arrow { color: var(--text-secondary); transition: transform 0.3s; }
        .selector-arrow.open { transform: rotate(180deg); color: var(--primary); }

        .modal-ov { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 9999999; display: flex; align-items: flex-end; justify-content: center; }
        .bottom-sheet { background: var(--surface); width: 100%; max-width: 500px; border-radius: 32px 32px 0 0; padding: var(--space-lg); box-shadow: var(--shadow-lg); animation: sheet-up 0.4s cubic-bezier(0.32, 0.72, 0, 1); max-height: 80vh; display: flex; flex-direction: column; border: 1px solid var(--border); border-bottom: none; }
        .sheet-handle { width: 40px; height: 4px; background: var(--border); border-radius: 2px; margin: 0 auto 20px; }
        .sheet-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .sheet-title { font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0; }
        .sheet-close { background: var(--background); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border: none; }
        
        .lang-list-scroll { overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-bottom: 20px; scrollbar-width: none; }
        .lang-list-scroll::-webkit-scrollbar { display: none; }
        .lang-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-radius: 16px; background: var(--background); border: 1px solid var(--border); width: 100%; min-height: 64px; transition: all 0.2s; }
        .lang-item.selected { background: rgba(79, 70, 229, 0.1); border-color: var(--primary); }
        .lang-left { display: flex; align-items: center; gap: 12px; flex: 1; }
        .lang-name { font-size: 1rem; font-weight: 700; color: var(--text-main); }

        .auth-stack { width: 100%; display: flex; flex-direction: column; gap: 1rem; }
        .ob-google-btn {
          width: 100%; height: var(--input-height); border-radius: var(--radius-lg); background: white; color: #0f172a;
          font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px; border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-sm); padding: 0 1rem;
        }
        .simple-loader { display: flex; align-items: center; justify-content: center; }
        .spinner { width: 28px; height: 28px; border: 3px solid rgba(99, 102, 241, 0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        
        .ob-outline-btn {
          width: 100%; height: var(--input-height); border-radius: var(--radius-lg); background: transparent;
          border: 1px solid var(--border); color: var(--text-main); font-size: 1rem; font-weight: 700;
        }

        .ob-form { width: 100%; display: flex; flex-direction: column; gap: var(--space-md); }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group label { font-size: 0.8rem; font-weight: 800; color: var(--text-secondary); padding-left: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        .input-group input { 
          width: 100%; height: var(--input-height); background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 0 1rem; color: var(--text-main); font-size: 1.1rem; font-weight: 700; outline: none; transition: all 0.2s;
        }
        .input-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }

        .ob-primary-btn {
          width: 100%; height: var(--input-height); border-radius: var(--radius-lg); 
          background: var(--primary); color: white;
          font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px; border: none;
          box-shadow: 0 8px 16px rgba(79, 70, 229, 0.2); margin-top: 1rem;
        }
        .ob-primary-btn:disabled { opacity: 0.5; box-shadow: none; }

        .ob-legal { font-size: 0.75rem; color: var(--text-secondary); text-align: center; margin-top: 1.5rem; padding: 0 1rem; line-height: 1.5; }
        .ob-error { background: rgba(239, 68, 68, 0.1); color: var(--danger); padding: 12px; border-radius: 12px; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; width: 100%; margin-top: 8px; font-weight: 600; }
        
        .spacer { flex: 1; min-height: 1.5rem; }
        .touch-active:active { transform: scale(0.97); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }

        @media (max-width: 380px) {
          .ob-header { padding-top: calc(var(--safe-top) + 0.5rem); }
          .icon-box { width: 64px; height: 64px; margin-bottom: 1rem; }
          .ob-title { font-size: 1.45rem; }
          .ob-subtitle { font-size: 0.9rem; margin-bottom: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
