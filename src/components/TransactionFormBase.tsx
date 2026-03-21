"use client";
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { categoryData, categoryKeys, CategoryKey } from './icons/CategoryIcons';
import DatePicker from './DatePicker';

interface TransactionFormBaseProps {
  type: 'expense' | 'income';
  onClose?: () => void;
  title: string;
  themeColor: string;
  gradient: string;
}

export default function TransactionFormBase({ 
  type, 
  onClose, 
  title, 
  themeColor,
  gradient 
}: TransactionFormBaseProps) {
  const { addTransaction, t, language } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;
  
  const [amount, setAmount] = useState('');
  const [categoryKey, setCategoryKey] = useState<CategoryKey>(categoryKeys[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Helper to format numbers
  const formatNumber = (val: string) => {
    const clean = val.replace(/\D/g, '');
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '');
    if (!isNaN(Number(raw))) setAmount(raw);
  };

  const getCategoryName = (key: CategoryKey): string => {
    return tAny.categories[key] || key;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      category: categoryKey === 'other' && customCategory.trim() ? customCategory.trim() : categoryKey,
      date,
      note
    });

    setAmount('');
    setNote('');
    if (onClose) onClose();
  };

  const selectedCategoryData = categoryData[categoryKey];

  return (
    <div style={{ 
      width: '100%', 
      boxSizing: 'border-box',
      minHeight: '550px', // Fixed minimum height to prevent jumping
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ 
        marginBottom: '1.5rem', 
        fontWeight: 700, 
        color: 'var(--text-main)', 
        fontSize: '1.4rem',
        textAlign: 'center' 
      }}>
        {title}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', flex: 1 }}>
        {/* Summa Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {t.amount}
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              inputMode="decimal"
              value={formatNumber(amount)}
              onChange={handleAmountChange}
              placeholder="0" 
              required
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                paddingRight: '60px',
                borderRadius: '16px',
                border: `2px solid var(--border)`,
                fontSize: '1.25rem',
                fontWeight: 700,
                outline: 'none',
                background: 'var(--background)',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = themeColor;
                e.target.style.boxShadow = `0 0 0 4px ${themeColor}15`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <span style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              fontWeight: 600
            }}>
              {t.currencyLabel}
            </span>
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {t.category}
          </label>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowCategoryPicker(!showCategoryPicker)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '16px',
                border: '2px solid var(--border)',
                background: 'var(--background)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: selectedCategoryData?.bgColor || 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  {selectedCategoryData?.icon}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {getCategoryName(categoryKey)}
                </span>
              </span>
              <svg 
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: showCategoryPicker ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {showCategoryPicker && (
              <>
                <div 
                  onClick={() => setShowCategoryPicker(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '8px',
                  zIndex: 1000,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  animation: 'pickerIn 0.25s cubic-bezier(0, 0, 0.2, 1)',
                  transformOrigin: 'top center'
                }}>
                  <style>{`
                    @keyframes pickerIn {
                      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                      to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .cat-item:active { transform: scale(0.96); }
                  `}</style>
                  {categoryKeys.map((key) => {
                    const catData = categoryData[key];
                    const isSelected = categoryKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        className="cat-item"
                        onClick={() => {
                          setCategoryKey(key);
                          setShowCategoryPicker(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '14px',
                          border: 'none',
                          background: isSelected ? catData?.bgColor : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s ease',
                          marginBottom: '4px'
                        }}
                      >
                        <span style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: catData?.bgColor || 'var(--surface)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          {catData?.icon}
                        </span>
                        <span style={{ 
                          fontWeight: isSelected ? 700 : 500, 
                          color: isSelected ? catData?.color : 'var(--text-main)',
                          fontSize: '0.95rem',
                          flex: 1,
                          textAlign: 'left'
                        }}>
                          {getCategoryName(key)}
                        </span>
                        {isSelected && (
                          <div style={{ background: catData?.color, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Custom Category Input - Using a wrapper for consistent height */}
        <div style={{ 
          height: categoryKey === 'other' ? '82px' : '0px',
          opacity: categoryKey === 'other' ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: categoryKey === 'other' ? 'all' : 'none'
        }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {tAny.categoryNamePlaceholder || "Kategoriya nomi"}
          </label>
          <input 
            type="text" 
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="..."
            required={categoryKey === 'other'}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '16px',
              border: `2px solid ${themeColor}`,
              fontSize: '1rem',
              outline: 'none',
              background: 'var(--background)',
              color: 'var(--text-main)',
              boxShadow: `0 0 0 4px ${themeColor}10`
            }}
          />
        </div>

        {/* Date Picker */}
        <DatePicker 
          key={language}
          value={date}
          onChange={setDate}
          label={t.date}
        />

        {/* Note Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {t.note}
          </label>
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="..."
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '16px',
              border: '2px solid var(--border)',
              fontSize: '1rem',
              outline: 'none',
              background: 'var(--background)',
              color: 'var(--text-main)',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = themeColor}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '1.1rem',
              borderRadius: '18px',
              border: 'none',
              background: gradient,
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 8px 20px ${themeColor}40`,
            }}
          >
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}
