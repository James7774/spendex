"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
}

export default function DatePicker({ value, onChange, label }: DatePickerProps) {
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
    const d = new Date(dateStr);
    return `${d.getDate()} ${t.months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Generate calendar grid
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

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '0.85rem', 
          marginBottom: '0.4rem', 
          color: 'var(--text-secondary)', 
          fontWeight: 500 
        }}>
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          border: '2px solid var(--border)',
          background: 'var(--background)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
          color: 'var(--text-main)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Calendar Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
            <circle cx="12" cy="16" r="1" fill="var(--primary)"/>
          </svg>
          <span style={{ fontWeight: 500 }}>
            {value ? formatDisplayDate(value) : t.selectDate}
          </span>
        </span>
        <svg 
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '1rem',
          zIndex: 1000,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          minWidth: '280px'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <button
              type="button"
              onClick={prevMonth}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--background)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>
              {t.months[currentDate.month]} {currentDate.year}
            </span>
            
            <button
              type="button"
              onClick={nextMonth}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--background)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Weekday Headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '4px',
            marginBottom: '8px'
          }}>
            {t.weekDaysShort.map((day: string) => (
              <div key={day} style={{ 
                textAlign: 'center', 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'var(--text-secondary)',
                padding: '4px'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '4px' 
          }}>
            {/* Empty cells for first week */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const todayClass = isToday(day);
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: todayClass && !selected ? '2px solid var(--primary)' : 'none',
                    background: selected 
                      ? 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)' 
                      : 'transparent',
                    color: selected ? '#fff' : todayClass ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: selected || todayClass ? 600 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selected ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) e.currentTarget.style.background = 'var(--background)';
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)'
          }}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t.clear}
            </button>
            <button
              type="button"
              onClick={selectToday}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
            >
              {t.today}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
