"use client";
import React, { useState, useMemo } from 'react';
import GoalCard from "@/components/GoalCard";
import { useFinance } from "@/context/FinanceContext";
import styles from "../dashboard.module.css";
import { getGoalIcon } from "@/components/icons/GoalIcons";
import TransactionsFilter from "@/components/TransactionsFilter";
import BottomSheet from "@/components/BottomSheet";
import { SearchIcon, CloseIcon, PlusIcon } from "@/components/Icons";
import { Sparkles, Check, Target, Plus, Zap } from "lucide-react";

// Icon options with rich metadata
const iconOptions = [
  { value: '🎯', label: 'Maqsad' },
  { value: '🏠', label: 'Uy' },
  { value: '🚗', label: 'Mashina' },
  { value: '📱', label: 'Texnika' },
  { value: '✈️', label: 'Sayohat' },
  { value: '💻', label: 'Kompyuter' },
  { value: '🎓', label: 'Ta\'lim' },
  { value: '💎', label: 'Zargarlik' },
];

// Quick presets for fast goal creation
const quickPresets = [
  { icon: '🚗', name: 'Yangi Mashina', target: '150000000' },
  { icon: '🏠', name: 'Kvartira xarid qilish', target: '500000000' },
  { icon: '📱', name: 'iPhone 16 Pro', target: '18000000' },
  { icon: '✈️', name: 'Umra / Sayohat', target: '25000000' },
  { icon: '💻', name: 'MacBook Pro M3', target: '22000000' },
];

export default function GoalsPage() {
  const { t, goals, addGoal, deleteGoal, updateGoal, darkMode, currencySymbol } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [icon, setIcon] = useState('🎯');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;
    addGoal({
        title,
        targetAmount: parseFloat(target),
        currentAmount: parseFloat(current) || 0,
        icon
    });
    setShowForm(false);
    setTitle('');
    setTarget('');
    setCurrent('');
  };

  // Helper to format numbers cleanly
  const formatNumber = (val: string) => {
    const clean = val.replace(/\D/g, '');
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '');
    if (!isNaN(Number(raw))) setTarget(raw);
  };

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '');
    if (!isNaN(Number(raw))) setCurrent(raw);
  };

  const applyPreset = (p: { icon: string; name: string; target: string }) => {
    setIcon(p.icon);
    setTitle(p.name);
    setTarget(p.target);
  };

  const addQuickSum = (amount: number) => {
    const currentNum = parseFloat(target) || 0;
    setTarget((currentNum + amount).toString());
  };

  // Calculate live preview metrics
  const targetNum = parseFloat(target) || 0;
  const currentNum = parseFloat(current) || 0;
  const progressPercent = targetNum > 0 ? Math.min(100, Math.round((currentNum / targetNum) * 100)) : 0;

  // Search logic
  const filteredGoals = useMemo(() => {
    if (!searchQuery.trim()) return goals;
    const query = searchQuery.toLowerCase().trim();
    return goals.filter(g => 
      g.title.toLowerCase().includes(query) || 
      g.targetAmount.toString().includes(query)
    );
  }, [searchQuery, goals]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.searchWrapper} style={{ paddingTop: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className={styles.searchContainer} style={{ flex: 1 }}>
              <input 
                type="text" 
                className={styles.searchInput}
                placeholder={t.searchGoalsPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            <div className={styles.innerSearchIcon}>
               <SearchIcon size={20} />
            </div>
            {searchQuery && (
              <button 
                className={styles.searchClearBtn}
                onClick={() => setSearchQuery("")}
                style={{ right: '12px' }}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
          <TransactionsFilter />
        </div>
      </div>

      {/* Add Button Section - Compact & Aligned */}
      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            width: '100%',
            background: showForm ? 'rgba(239, 68, 68, 0.1)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: showForm ? '#ef4444' : 'white',
            border: 'none',
            height: '46px',
            borderRadius: '16px',
            fontSize: '0.88rem',
            fontWeight: 800,
            boxShadow: showForm ? 'none' : '0 6px 20px rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
          className="touch-active"
        >
            <div style={{ 
              width: '24px', 
              height: '24px', 
              background: showForm ? 'transparent' : 'rgba(255,255,255,0.2)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: showForm ? 'rotate(45deg)' : 'none',
              transition: 'transform 0.3s ease'
            }}>
              <PlusIcon size={14} color={showForm ? "#ef4444" : "white"} />
            </div>
            <span style={{ letterSpacing: '-0.2px' }}>{showForm ? t.cancel : t.newGoal}</span>
        </button>
      </div>

      {/* Goal Add Form - Next-Gen Ultra-Premium BottomSheet */}
      <BottomSheet
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={t.newGoal}
        showCloseIcon={true}
      >
        <div style={{ padding: '10px 0 20px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Live Goal Preview Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  borderRadius: '24px',
                  padding: '18px 20px',
                  color: 'white',
                  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                  {/* Background Ambient Glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '18px',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      flexShrink: 0
                    }}>
                      {getGoalIcon(icon, 30)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Canli Ko'rinish
                      </div>
                      <h4 style={{ margin: '2px 0 0', fontWeight: 800, fontSize: '1.1rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {title.trim() || 'Maqsad nomi (Masalan: Mashina)'}
                      </h4>
                    </div>
                    <div style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: '1px solid rgba(129, 140, 248, 0.3)'
                    }}>
                      {progressPercent}%
                    </div>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1, #3b82f6)',
                      borderRadius: '10px',
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>

                  {/* Amounts row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.95, fontWeight: 700 }}>
                    <span style={{ color: '#94a3b8' }}>
                      Jamg'arilgan: <strong style={{ color: '#34d399' }}>{currentNum.toLocaleString()} {currencySymbol}</strong>
                    </span>
                    <span style={{ color: '#fff' }}>
                      Maqsad: <strong>{targetNum.toLocaleString()} {currencySymbol}</strong>
                    </span>
                  </div>
                </div>

                {/* 2. Quick Presets Chips */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', paddingLeft: '4px' }}>
                    <Zap size={14} color="#6366f1" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Tezkor Shablonlar
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    overflowX: 'auto', 
                    paddingBottom: '4px',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}>
                    {quickPresets.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="touch-active"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <span>{p.icon}</span>
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Icon Selection Row */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingLeft: '4px' }}>
                    Belgini Tanlang
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '10px' 
                  }}>
                    {iconOptions.map((opt) => {
                      const isSelected = icon === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setIcon(opt.value)}
                          className="touch-active"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '10px 6px',
                            borderRadius: '16px',
                            background: isSelected 
                              ? (darkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)') 
                              : 'var(--surface)',
                            border: `2px solid ${isSelected ? '#6366f1' : 'var(--border)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          <div style={{ fontSize: '1.4rem' }}>
                            {getGoalIcon(opt.value, 24)}
                          </div>
                          <span style={{ fontSize: '0.7rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#6366f1' : 'var(--text-secondary)' }}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Goal Title Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', paddingLeft: '4px' }}>
                    {t.goalNameLabel}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      placeholder="Masalan: Yangi Mashina" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      required 
                      style={{ 
                        width: '100%', 
                        padding: '14px 16px', 
                        border: '2px solid var(--border)', 
                        borderRadius: '16px',
                        background: 'var(--surface)', 
                        color: 'var(--text-main)', 
                        fontSize: '1rem',
                        fontWeight: 700,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'var(--shadow-sm)';
                      }}
                    />
                    {title && (
                      <button
                        type="button"
                        onClick={() => setTitle('')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'var(--border)',
                          border: 'none',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <CloseIcon size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 5. Target Amount & Current Amount Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'end' }}>
                    {/* Target Amount */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         <div style={{ minHeight: '36px', display: 'flex', alignItems: 'flex-end', paddingLeft: '4px' }}>
                           <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                              {t.targetAmountLabel}
                           </label>
                         </div>
                         <div style={{ position: 'relative' }}>
                           <input 
                              type="text" 
                              inputMode="decimal"
                              placeholder="0" 
                              value={formatNumber(target)} 
                              onChange={handleTargetChange} 
                              required 
                              style={{ 
                                width: '100%', 
                                padding: '14px 12px', 
                                border: '2px solid var(--border)', 
                                borderRadius: '16px', 
                                background: 'var(--surface)', 
                                color: 'var(--text-main)', 
                                fontSize: '1rem',
                                fontWeight: 800,
                                outline: 'none',
                                transition: 'all 0.2s',
                                textAlign: 'center'
                              }}
                              onFocus={(e) => {
                                 e.target.style.borderColor = '#6366f1';
                                 e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.15)';
                              }}
                              onBlur={(e) => {
                                 e.target.style.borderColor = 'var(--border)';
                                 e.target.style.boxShadow = 'none';
                              }}
                          />
                        </div>
                    </div>

                    {/* Current Amount */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ minHeight: '36px', display: 'flex', alignItems: 'flex-end', paddingLeft: '4px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                              {t.currentAmountLabel}
                          </label>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input 
                              type="text" 
                              inputMode="decimal"
                              placeholder="0" 
                              value={formatNumber(current)} 
                              onChange={handleCurrentChange} 
                              style={{ 
                                width: '100%', 
                                padding: '14px 12px', 
                                border: '2px solid var(--border)', 
                                borderRadius: '16px', 
                                background: 'var(--surface)', 
                                color: 'var(--text-main)', 
                                fontSize: '1rem',
                                fontWeight: 800,
                                outline: 'none',
                                transition: 'all 0.2s',
                                textAlign: 'center'
                              }}
                              onFocus={(e) => {
                                 e.target.style.borderColor = '#10b981';
                                 e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15)';
                              }}
                              onBlur={(e) => {
                                 e.target.style.borderColor = 'var(--border)';
                                 e.target.style.boxShadow = 'none';
                              }}
                          />
                        </div>
                    </div>
                </div>

                {/* 6. Quick Amount Addition Pills */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  {[1000000, 5000000, 10000000, 50000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => addQuickSum(amt)}
                      className="touch-active"
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      +{(amt / 1000000)}M
                    </button>
                  ))}
                </div>

                {/* 7. Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{ 
                      flex: 1, 
                      padding: '14px', 
                      borderRadius: '16px', 
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem', 
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                    className="touch-active"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit" 
                    className="touch-active"
                    style={{ 
                      flex: 2, 
                      padding: '14px', 
                      borderRadius: '16px', 
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: 'white',
                      fontSize: '0.95rem', 
                      fontWeight: 850,
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Check size={18} strokeWidth={3} />
                    <span>Saqlash</span>
                  </button>
                </div>

            </form>
        </div>
      </BottomSheet>

      {/* Goals Grid Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', 
        gap: '16px',
        paddingBottom: '140px' 
      }}>
        {filteredGoals.map((goal) => (
          <GoalCard 
            key={goal.id} 
            id={goal.id}
            title={goal.title}
            targetAmount={goal.targetAmount}
            currentAmount={goal.currentAmount}
            icon={goal.icon}
            onDelete={() => deleteGoal(goal.id)}
            onUpdate={(id, newAmount) => updateGoal(id, { currentAmount: newAmount })}
          />
        ))}

        {filteredGoals.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1',
            padding: '4rem 1rem', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            background: 'var(--surface)',
            borderRadius: '24px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ marginBottom: '16px', opacity: 0.5 }}>
               <Target size={48} />
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{tAny.noGoalsFound || t.nothingFound}</p>
          </div>
        )}
      </div>
    </div>
  );
}
