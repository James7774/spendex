"use client";
import React, { useEffect } from 'react';
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
              zIndex: 9998
              // Removed backdropFilter for better performance on Android
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.2 }}
            drag="y"
            dragConstraints={{ top: -3000, bottom: 0 }} // Explicit large range for 1:1 UP movement
            dragElastic={1} // Strictly 1:1 movement, no resistance
            dragMomentum={false} // Stops instantly on release
            onDragEnd={(event, info) => {
              const draggedDistance = info.offset.y;
              const velocity = info.velocity.y;
              // Dismiss if dragged down > 100px OR flicked down with velocity > 300
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
              zIndex: 9999,
              maxHeight: '92vh',
              height: height,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              willChange: 'transform'
            }}
          >
            {/* Extended Background (Apron) to prevent gaps when dragging up */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              height: '1500px', // Massive extra height
              background: darkMode ? '#1e293b' : '#ffffff',
              pointerEvents: 'none'
            }} />

            {/* 1. Drag Handle - Draggable */}
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

            {/* 2. Fixed Header (Title + Close) - Draggable */}
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
                      onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking close
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

            {/* 3. Content Container - NOT Draggable (Scrollable) */}
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
    </AnimatePresence>
  );
}
