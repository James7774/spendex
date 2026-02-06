"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '@/context/FinanceContext';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: string; // e.g. 'auto', '90vh'
}

export default function BottomSheet({ isOpen, onClose, title, children, height = 'auto' }: BottomSheetProps) {
  const { darkMode } = useFinance();

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
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
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9998,
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.5 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.08}
            onDragEnd={(event, info) => {
              if (info.offset.y > 150 || (info.velocity.y > 500 && info.offset.y > 0)) {
                onClose();
              }
            }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: darkMode ? '#1e293b' : '#ffffff',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '0',
              zIndex: 9999,
              maxHeight: '92vh',
              height: height,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {/* Drag Handle Area - Draggable because it bubbles up */}
            <div
              style={{
                width: '100%',
                padding: '16px 0',
                display: 'flex',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'grab',
                touchAction: 'none'
              }}
            >
              <div style={{
                width: '48px',
                height: '5px',
                borderRadius: '3px',
                background: darkMode ? 'rgba(255,255,255,0.2)' : '#e2e8f0'
              }} />
            </div>

            {/* Content Container - STOPS Drag Propagation */}
            <div 
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 20px 40px 20px',
                overscrollBehavior: 'contain'
              }}
            >
              {title && (
                <h3 style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: darkMode ? '#fff' : '#0f172a'
                }}>
                  {title}
                </h3>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
