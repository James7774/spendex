"use client";
import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import { useFinance, User } from '@/context/FinanceContext';
import { useRouter } from 'next/navigation';

import { translations } from '@/locales';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, language, t: contextT } = useFinance();
  const t = (translations as any)[language]?.auth || contextT.auth;
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'initial' | 'password'>('initial');
  const [isHovered, setIsHovered] = useState(false);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation Logic
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordCheck = {
    min: (p: string) => p.length >= 8,
    max: (p: string) => p.length <= 15,
    upper: (p: string) => /[A-Z]/.test(p),
    digit: (p: string) => /[0-9]/.test(p)
  };
  const isValidPassword = (password: string) => 
    passwordCheck.min(password) && passwordCheck.max(password) && 
    passwordCheck.upper(password) && passwordCheck.digit(password);

  // Handlers
  const handleAuthSuccess = (user: User) => {
    const randomId = Math.random().toString(36).substr(2);
    const sessionToken = `session_${randomId}`;
    
    localStorage.setItem('finflow_session_token', sessionToken);
    localStorage.setItem('finflow_user_phone', user.phone);
    login(user);
    setIsLoading(false);
    router.push('/dashboard');
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    const phone = `+998 (00) 000-00-00`;
    const timestamp = Date.now();
    handleAuthSuccess({ id: provider[0] + timestamp, name: `${provider} User`, phone, avatar: '' });
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail(formData.email)) setAuthStep('password');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPassword(formData.password)) {
      setIsLoading(true);
      const timestamp = Date.now();
      handleAuthSuccess({ id: 'u' + timestamp, name: formData.email.split('@')[0], phone: formData.email });
    }
  };

  const Requirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={styles.requirement}>
      <div className={`${styles.reqDot} ${met ? styles.met : ''}`} />
      {text}
    </div>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* LOGO SECTION */}
        <div className={styles.logoWrapper} 
             onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className={`${styles.logo} ${isHovered ? styles.logoHovered : ''}`}>F</div>
          
          {/* TOOLTIP (KALOMAT) */}
          <div className={`${styles.tooltip} ${isHovered ? styles.tooltipVisible : ''}`}>
            {t.magicWord}
            <div className={styles.tooltipArrow} />
          </div>
        </div>

        {/* TITLES */}
        <h2 className={styles.title}>{t.welcomeTitle}</h2>
        <p className={styles.subtitle}>{t.welcomeSubtitle}</p>

        {authStep === 'initial' ? (
          <div className={styles.formContainer}>
            <div className={styles.socialGrid}>
              <button onClick={() => handleSocialLogin('Google')} className={styles.socialMini}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                {t.continueGoogle}
              </button>
              <button onClick={() => handleSocialLogin('Apple')} className={styles.socialMini}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                {t.continueApple}
              </button>
            </div>

            <div className={styles.divider}>
              <span className={styles.dividerText}>{t.or}</span>
            </div>

            <form onSubmit={handleEmailContinue} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{t.emailLabel}</label>
                <input type="email" placeholder={t.emailPlaceholder} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={styles.input} />
              </div>
              <button type="submit" disabled={!isValidEmail(formData.email)} className={`${styles.primaryBtn} ${!isValidEmail(formData.email) ? styles.disabled : ''}`}>
                {t.continueBtn}
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.formContainer}>
            <button onClick={() => setAuthStep('initial')} className={styles.backBtn}>← {t.back}</button>
            <div className={styles.emailChip}>{formData.email}</div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{t.password}</label>
                <input type="password" placeholder={t.passwordPlaceholder} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} autoFocus className={styles.input} />
              </div>

              <div className={styles.reqGrid}>
                <Requirement met={passwordCheck.min(formData.password)} text={t.reqMin} />
                <Requirement met={passwordCheck.max(formData.password)} text={t.reqMax} />
                <Requirement met={passwordCheck.upper(formData.password)} text={t.reqUpper} />
                <Requirement met={passwordCheck.digit(formData.password)} text={t.reqDigit} />
              </div>

              <button type="submit" disabled={isLoading || !isValidPassword(formData.password)} className={`${styles.primaryBtn} ${(!isValidPassword(formData.password) || isLoading) ? styles.disabled : ''}`}>
                {isLoading ? '...' : t.login}
              </button>
            </form>
          </div>
        )}

        <p className={styles.footer}>
          {t.terms} <span className={styles.link}>{t.termsAgree}</span> {t.termsAnd} <span className={styles.link}>{t.privacy}</span> {t.termsEnd}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
