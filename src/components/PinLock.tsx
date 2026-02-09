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
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.div
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              width: '85px',
              height: '85px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #7000ff 0%, #9061f9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              color: '#fff',
              boxShadow: '0 10px 25px rgba(112, 0, 255, 0.3)'
            }}
          >
            {error ? <Lock size={42} /> : <ShieldCheck size={42} />}
          </motion.div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '10px', letterSpacing: '-0.5px' }}>
            {error ? "Noto'g'ri kod" : "Finova Xavfsizlik"}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600, opacity: 0.8 }}>
            Davom etish uchun 4 xonali kodingizni kiriting
          </p>
        </div>

        {/* PIN Indicators */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '70px' }}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={pin.length >= i ? { 
                scale: [1, 1.3, 1], 
                backgroundColor: '#7000ff',
                borderColor: '#7000ff',
                boxShadow: '0 0 15px rgba(112, 0, 255, 0.4)'
              } : { 
                scale: 1, 
                backgroundColor: 'transparent',
                borderColor: 'var(--border)'
              }}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: '2.5px solid var(--border)',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          width: '100%',
          maxWidth: '320px'
        }}>
          {[
            { num: '1', letters: '' },
            { num: '2', letters: 'ABC' },
            { num: '3', letters: 'DEF' },
            { num: '4', letters: 'GHI' },
            { num: '5', letters: 'JKL' },
            { num: '6', letters: 'MNO' },
            { num: '7', letters: 'PQRS' },
            { num: '8', letters: 'TUV' },
            { num: '9', letters: 'WXYZ' }
          ].map((item) => (
            <button
              key={item.num}
              onClick={() => handleNumberClick(item.num)}
              style={{
                width: '76px', // Fixed size
                height: '76px', // Fixed size
                borderRadius: '50%',
                border: '1.2px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                margin: '0 auto' // Center in grid cell
              }}
              className="num-btn-premium"
            >
              <span style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1 }}>{item.num}</span>
              {item.letters && (
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', marginTop: '1px' }}>
                  {item.letters}
                </span>
              )}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick('0')}
            style={{
              width: '76px', // Fixed size
              height: '76px', // Fixed size
              borderRadius: '50%',
              border: '1.2px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-main)',
              fontSize: '1.7rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              margin: '0 auto' // Center in grid cell
            }}
            className="num-btn-premium"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            style={{
              height: '80px',
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
            <Delete size={32} />
          </button>
        </div>

        <style jsx>{`
          .num-btn-premium {
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .num-btn-premium:active {
            transform: scale(0.9);
            background: #7000ff !important;
            border-color: #7000ff !important;
            color: #fff !important;
            box-shadow: 0 5px 15px rgba(112, 0, 255, 0.3);
          }
          .num-btn-premium:active span {
            color: #fff !important;
          }
          .touch-active:active {
            transform: scale(0.85);
            opacity: 0.6;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
