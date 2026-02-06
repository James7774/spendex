"use client";
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { categoryData, categoryKeys, CategoryKey } from './icons/CategoryIcons';
import DatePicker from './DatePicker';

export default function AddTransactionForm({ onClose }: { onClose?: () => void }) {
  const { addTransaction, t, language } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;
  
  const [type, setType] = useState<'expense' | 'income'>('expense');
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

  // Get translated category name
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

    // Reset form or close
    setAmount('');
    setNote('');
    if (onClose) onClose();
  };

  const selectedCategoryData = categoryData[categoryKey];

  return (
    <div style={{
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 700, color: 'var(--text-main)', fontSize: '1.25rem' }}>
        {t.addTransaction}
      </h3>

      {/* Type Toggle */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '1.5rem', 
        background: 'var(--background)', 
        padding: '4px', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        <button
          onClick={() => setType('expense')}
          type="button"
          style={{
            flex: 1,
            border: 'none',
            padding: '0.7rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600,
            background: type === 'expense' ? 'var(--danger)' : 'transparent',
            color: type === 'expense' ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.3s ease'
          }}
        >
          {t.expense}
        </button>
        <button
          onClick={() => setType('income')}
          type="button"
          style={{
            flex: 1,
            border: 'none',
            padding: '0.7rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600,
            background: type === 'income' ? 'var(--success)' : 'transparent',
            color: type === 'income' ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.3s ease'
          }}
        >
          {t.income}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Summa */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
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
                padding: '0.85rem 1rem',
                paddingRight: '60px',
                borderRadius: '12px',
                border: '2px solid var(--border)',
                fontSize: '1.1rem',
                fontWeight: 600,
                outline: 'none',
                background: 'var(--background)',
                color: 'var(--text-main)',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              {t.currencyLabel}
            </span>
          </div>
        </div>

        {/* Kategoriya - Custom Picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {t.category}
          </label>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowCategoryPicker(!showCategoryPicker)}
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
                transition: 'all 0.2s'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: selectedCategoryData?.bgColor || 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedCategoryData?.icon}
                </span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                  {getCategoryName(categoryKey)}
                </span>
              </span>
              <svg 
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"
                style={{ transform: showCategoryPicker ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {/* Category Dropdown */}
            {showCategoryPicker && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '0.5rem',
                zIndex: 1000,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {categoryKeys.map((key) => {
                  const catData = categoryData[key];
                  const isSelected = categoryKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setCategoryKey(key);
                        setShowCategoryPicker(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: isSelected ? catData?.bgColor : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s',
                        marginBottom: '4px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--background)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: catData?.bgColor || 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? `0 4px 12px ${catData?.color}40` : 'none',
                        transition: 'all 0.2s'
                      }}>
                        {catData?.icon}
                      </span>
                      <span style={{ 
                        fontWeight: isSelected ? 600 : 500, 
                        color: isSelected ? catData?.color : 'var(--text-main)',
                        transition: 'all 0.2s'
                      }}>
                        {getCategoryName(key)}
                      </span>
                      {isSelected && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 'auto' }}>
                          <circle cx="12" cy="12" r="10" fill={catData?.color}/>
                          <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Custom Category Input - Only if "Other" is selected */}
        {categoryKey === 'other' && (
          <div style={{ animation: 'slideDown 0.3s ease-out' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {tAny.categoryNamePlaceholder || "Kategoriya nomi"}
            </label>
            <input 
              type="text" 
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="..."
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '2px solid var(--primary)',
                fontSize: '1rem',
                outline: 'none',
                background: 'var(--background)',
                color: 'var(--text-main)',
                transition: 'border-color 0.2s',
                boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
              }}
            />
          </div>
        )}

        {/* Sana - Custom DatePicker */}
        <DatePicker 
          key={language}
          value={date}
          onChange={setDate}
          label={t.date}
        />

        {/* Izoh */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {t.note}
          </label>
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '2px solid var(--border)',
              fontSize: '1rem',
              outline: 'none',
              background: 'var(--background)',
              color: 'var(--text-main)',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            marginTop: '0.5rem', 
            width: '100%', 
            padding: '1rem',
            borderRadius: '12px',
            border: 'none',
            background: type === 'expense' 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
              : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: type === 'expense' 
              ? '0 4px 15px rgba(220, 38, 38, 0.3)' 
              : '0 4px 15px rgba(34, 197, 94, 0.3)'
          }}
        >
          {t.save}
        </button>
      </form>
    </div>
  );
}
