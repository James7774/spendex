"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '@/context/FinanceContext';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: string; // e.g. 'auto', '90vh'
  showCloseIcon?: boolean;
}

export default function BottomSheet({ isOpen, onClose, title, children, height = 'auto', showCloseIcon = false }: BottomSheetProps) {
  const { darkMode, setOverlayOpen } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setOverlayOpen(true);
    } else {
      document.body.style.overflow = '';
      setOverlayOpen(false);
    }
    return () => { 
      document.body.style.overflow = '';
      setOverlayOpen(false);
    };
  }, [isOpen, setOverlayOpen]);

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
              background: 'rgba(0,0,0,0.7)',
              zIndex: 99998
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.2 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 1 }}
            dragMomentum={false}
            onDragEnd={(event, info) => {
              const draggedDistance = info.offset.y;
              const velocity = info.velocity.y;
              if (draggedDistance > 100 || (velocity > 300 && draggedDistance > 0)) {
                onClose();
              }
            }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: darkMode ? '#1e293b' : '#ffffff',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '0',
              zIndex: 99999,
              maxHeight: '92vh',
              height: height,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -4px 30px rgba(0,0,0,0.3)',
              willChange: 'transform'
            }}
          >
            {/* Extended Background (Apron) */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              height: '1500px',
              background: darkMode ? '#1e293b' : '#ffffff',
              pointerEvents: 'none'
            }} />

            {/* 1. Drag Handle */}
            <div
              style={{
                width: '100%',
                padding: '12px 0 8px 0',
                display: 'flex',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'grab',
                touchAction: 'none'
              }}
            >
              <div style={{
                width: '40px',
                height: '4px',
                borderRadius: '4px',
                background: 'var(--border)'
              }} />
            </div>

            {/* 2. Fixed Header */}
            {(title || showCloseIcon) && (
              <div style={{ 
                padding: '0 24px 16px 24px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexShrink: 0,
                cursor: 'grab'
              }}>
                 {title ? (
                    <h3 style={{
                      fontSize: '1.4rem',
                      fontWeight: 750,
                      color: 'var(--text-main)',
                      margin: 0,
                      letterSpacing: '-0.5px'
                    }}>
                      {title}
                    </h3>
                 ) : <div />}
                 
                 {showCloseIcon && (
                    <button
                      onClick={onClose}
                      onPointerDown={(e) => e.stopPropagation()}
                      style={{
                        background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        border: 'none',
                        color: darkMode ? '#94a3b8' : '#64748b', 
                        cursor: 'pointer',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                 )}
              </div>
            )}

            {/* 3. Content Container */}
            <div 
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '4px 24px 40px 24px',
                overscrollBehavior: 'contain'
              }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
