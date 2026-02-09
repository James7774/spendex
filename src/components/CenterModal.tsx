"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '@/context/FinanceContext';

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function CenterModal({ isOpen, onClose, title, children }: CenterModalProps) {
  const { darkMode } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 999998,
              backdropFilter: 'blur(5px)'
            }}
          />

          {/* Modal Container to center the content */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            pointerEvents: 'none'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                background: darkMode ? '#1e293b' : '#ffffff',
                borderRadius: '28px',
                padding: '24px',
                width: '100%',
                maxWidth: '320px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'center'
              }}
            >
              {title && (
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: 0,
                  color: darkMode ? '#fff' : '#0f172a'
                }}>
                  {title}
                </h3>
              )}
              
              <div style={{ flex: 1 }}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
