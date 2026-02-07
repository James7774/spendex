"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};
import { useFinance } from '@/context/FinanceContext';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  customTrigger?: React.ReactNode;
}

export default function DatePicker({ value, onChange, label, customTrigger }: DatePickerProps) {
  const { t } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  // Select date
  const selectDate = (day: number) => {
    const dateStr = `${currentDate.year}-${String(currentDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  // Today
  const selectToday = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    onChange(dateStr);
    setCurrentDate({ year: today.getFullYear(), month: today.getMonth() });
    setIsOpen(false);
  };

  // Format display date
  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return t.selectDate;
      return `${d.getDate()} ${t.months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return t.selectDate;
    }
  };

  // When opening, sync internal view to the selected date if it exists
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentDate({ year: d.getFullYear(), month: d.getMonth() });
      }
    }
    setIsOpen(!isOpen);
  };

  // Generate calendar grid derived values
  const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month);
  const firstDay = getFirstDayOfMonth(currentDate.year, currentDate.month);
  const today = new Date();
  
  const isToday = (day: number) => 
    today.getDate() === day && 
    today.getMonth() === currentDate.month && 
    today.getFullYear() === currentDate.year;
  
  const isSelected = (day: number) => 
    selectedDate && 
    selectedDate.getDate() === day && 
    selectedDate.getMonth() === currentDate.month && 
    selectedDate.getFullYear() === currentDate.year;

  // Jump to specific year
  const changeYear = (offset: number) => {
    setCurrentDate(prev => ({ ...prev, year: prev.year + offset }));
  };

  return (
    <div 
      ref={dropdownRef} 
      style={{ 
        position: 'relative',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()} // Block context menu for entire component
    >
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '0.85rem', 
          marginBottom: '0.4rem', 
          color: 'var(--text-secondary)', 
          fontWeight: 700 
        }}>
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      {customTrigger ? (
        <div 
          onClick={handleToggle} 
          style={{ 
            cursor: 'pointer', 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          {customTrigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '16px',
            border: '2.5px solid var(--border)',
            background: 'var(--background)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
            color: 'var(--text-main)',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              {value ? formatDisplayDate(value) : t.selectDate}
            </span>
          </span>
          <svg 
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="3"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      )}

      {/* Calendar Portal - Renders outside the parent hierarchy to prevent stacking/overflow issues */}
      {isOpen && (
        <Portal>
          <div 
            className="calendar-backdrop"
            onClick={() => setIsOpen(false)}
            onContextMenu={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()} // Prevent scrolling the background
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999, // Super high z-index
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)', // Slightly reduced blur for performance
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent',
              overscrollBehavior: 'none'
            }}
          >
            <div 
              className="calendar-modal"
              draggable={false}
              onDragStart={(e) => { e.preventDefault(); return false; }} // KILL ghost dragging
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '32px',
                padding: '1.5rem',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                width: '340px', 
                maxWidth: '90vw',
                minWidth: '280px',
                flexShrink: 0, 
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent',
                WebkitUserDrag: 'none',
                userDrag: 'none',
                willChange: 'transform',
                touchAction: 'none', // Critical
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100000,
                transform: 'translateZ(0)' // Hardware acceleration hack
              } as any}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Year Switcher Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '4px',
                opacity: 0.6
              }}>
                 <button 
                   type="button"
                   onClick={(e) => { e.stopPropagation(); changeYear(-1); }} 
                   onContextMenu={(e) => e.preventDefault()}
                   style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '10px', fontSize: '1.2rem', fontWeight: 900, touchAction: 'manipulation', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', WebkitTouchCallout: 'none' } as any}
                   onPointerDown={(e) => e.preventDefault()}
                 >«</button>
                 <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>{currentDate.year}</span>
                 <button 
                   type="button"
                   onClick={(e) => { e.stopPropagation(); changeYear(1); }} 
                   onContextMenu={(e) => e.preventDefault()}
                   style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '10px', fontSize: '1.2rem', fontWeight: 900, touchAction: 'manipulation', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', WebkitTouchCallout: 'none' } as any}
                   onPointerDown={(e) => e.preventDefault()}
                 >»</button>
              </div>

              {/* Month Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.25rem'
              }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prevMonth(); }}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'var(--background)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    WebkitTouchCallout: 'none'
                  } as any}
                  onPointerDown={(e) => e.preventDefault()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="3">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                    {t.months[currentDate.month]}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); nextMonth(); }}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'var(--background)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    WebkitTouchCallout: 'none'
                  } as any}
                  onPointerDown={(e) => e.preventDefault()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="3">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>

              {/* Weekday Headers */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: '2px',
                marginBottom: '12px'
              }}>
                {t.weekDaysShort.map((day: string) => (
                  <div key={day} style={{ 
                    textAlign: 'center', 
                    fontSize: '0.7rem', 
                    fontWeight: 900, 
                    color: 'var(--text-secondary)',
                    opacity: 0.5,
                    padding: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '4px',
                  minHeight: '260px',
                  willChange: 'contents'
                }}
              >
                {(() => {
                  const items = [];
                  const prevMonthLastDay = new Date(currentDate.year, currentDate.month, 0).getDate();
                  
                  // Render logic preserved...
                  for (let i = firstDay - 1; i >= 0; i--) {
                    const day = prevMonthLastDay - i;
                    items.push(
                      <div key={`prev-${day}`} style={{
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        opacity: 0.2,
                        cursor: 'default',
                        pointerEvents: 'none'
                      }}>
                        {day}
                      </div>
                    );
                  }
                  for (let day = 1; day <= daysInMonth; day++) {
                    const selected = isSelected(day);
                    const todayMark = isToday(day);
                    items.push(
                      <button
                        key={`day-${day}`}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); selectDate(day); }}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                          aspectRatio: '1/1',
                          width: '100%',
                          borderRadius: '16px',
                          border: 'none',
                          background: selected 
                            ? 'linear-gradient(135deg, #7000ff 0%, #9033ff 100%)' 
                            : 'transparent',
                          color: selected ? '#fff' : todayMark ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: selected ? 900 : todayMark ? 900 : 750,
                          fontSize: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                          WebkitTouchCallout: 'none'
                        } as any}
                        onPointerDown={(e) => e.preventDefault()}
                      >
                        {day}
                        {todayMark && !selected && (
                          <div style={{
                            position: 'absolute',
                            bottom: '6px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'var(--primary)'
                          }} />
                        )}
                      </button>
                    );
                  }
                  const remainingCells = 42 - items.length;
                  for (let day = 1; day <= remainingCells; day++) {
                    items.push(
                      <div key={`next-${day}`} style={{
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        opacity: 0.2,
                        cursor: 'default',
                        pointerEvents: 'none'
                      }}>
                        {day}
                      </div>
                    );
                  }
                  return items;
                })()}
              </div>

              {/* Footer Actions */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid var(--border)'
              }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange(''); setIsOpen(false); }}
                  onContextMenu={(e) => e.preventDefault()}
                  className="footer-btn secondary"
                  style={{
                    padding: '14px',
                    borderRadius: '18px',
                    border: '2px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    WebkitTouchCallout: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  } as any}
                >
                  {t.clear}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); selectToday(); }}
                  onContextMenu={(e) => e.preventDefault()}
                  className="footer-btn primary"
                  style={{
                    padding: '14px',
                    borderRadius: '18px',
                    border: 'none',
                    background: '#7000ff',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(112, 0, 255, 0.25)',
                    WebkitTouchCallout: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  } as any}
                >
                  {t.today}
                </button>
              </div>
              
              <style jsx>{`
                @keyframes scaleUp {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .calendar-modal {
                  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .footer-btn:active {
                  transform: scale(0.96);
                }
              `}</style>
              <style jsx global>{`
                .calendar-modal *, .calendar-modal {
                  -webkit-touch-callout: none !important;
                  -webkit-user-select: none !important;
                  -webkit-user-drag: none !important;
                  -moz-user-select: none !important;
                  -ms-user-select: none !important;
                  user-select: none !important;
                  user-drag: none !important;
                }
                * {
                  -webkit-tap-highlight-color: transparent !important;
                }
              `}</style>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
