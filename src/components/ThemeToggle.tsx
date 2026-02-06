"use client";
import React from 'react';
import { useFinance } from '@/context/FinanceContext';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useFinance();

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      style={{
        width: '52px',
        height: '26px',
        background: darkMode ? '#475569' : '#e0e7ff', 
        borderRadius: '999px',
        border: 'none',
        outline: 'none', // Ko'k focus ring ni olib tashlash
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        transition: 'background 0.3s ease',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: darkMode ? 'calc(100% - 23px)' : '3px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: darkMode ? '#1e293b' : '#ffffff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px'
      }}>
        {darkMode ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fbbf24' }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </div>
    </button>
  );
}
