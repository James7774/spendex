"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';

const languages = [
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
] as const;

export default function LanguageSelector() {
  const { language, setLanguage } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative', zIndex: 50 }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-main)',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
        aria-label="Select Language"
      >
        <span style={{ fontSize: '1.2rem' }}>{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginLeft: '4px',
            opacity: 0.7
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--surface)', // Uses theme variable
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            padding: '4px',
            width: '160px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: language === lang.code ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                color: language === lang.code ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontSize: '0.9rem',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) e.currentTarget.style.background = 'var(--background)'; // Hover effect
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
              {lang.label}
              {language === lang.code && (
                <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}>✔</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
