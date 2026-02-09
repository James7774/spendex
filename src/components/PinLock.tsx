"use client";
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, ShieldCheck } from 'lucide-react';

export default function PinLock() {
  const { isLocked, unlock } = useFinance();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        const success = unlock(newPin);
        if (!success) {
          setError(true);
          setTimeout(() => {
            setError(false);
            setPin('');
          }, 600);
        } else {
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--background)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(112, 0, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: error ? '#ef4444' : '#7000ff'
            }}
          >
            {error ? <Lock size={40} /> : <ShieldCheck size={40} />}
          </motion.div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
            {error ? "Noto'g'ri kod" : "Xavfsizlik kodi"}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Ilovaga kirish uchun 4 xonali kodni kiriting
          </p>
        </div>

        {/* PIN Indicators */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={pin.length >= i ? { scale: [1, 1.2, 1], backgroundColor: '#7000ff' } : { scale: 1, backgroundColor: 'var(--border)' }}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid var(--border)',
                background: 'transparent'
              }}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          width: '100%',
          maxWidth: '300px'
        }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontSize: '1.5rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.1s'
              }}
              className="touch-active"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick('0')}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--surface)',
              color: 'var(--text-main)',
              fontSize: '1.5rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
            className="touch-active"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            className="touch-active"
          >
            <Delete size={28} />
          </button>
        </div>

        <style jsx>{`
          .touch-active:active {
            transform: scale(0.9);
            background: rgba(112, 0, 255, 0.1) !important;
            color: #7000ff !important;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
