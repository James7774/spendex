"use client";
import React, { useState } from 'react';
import GoalCard from "@/components/GoalCard";
import { useFinance } from "@/context/FinanceContext";
import styles from "../dashboard.module.css";
import { getGoalIcon } from "@/components/icons/GoalIcons";
import TransactionsFilter from "@/components/TransactionsFilter";

// Icon options
const iconOptions = [
  { value: '🎯', key: 'iconTarget' },
  { value: '🏠', key: 'iconHome' },
  { value: '🚗', key: 'iconCar' },
  { value: '📱', key: 'iconPhone' },
  { value: '✈️', key: 'iconTravel' },
  { value: '💻', key: 'iconComputer' },
];

export default function GoalsPage() {
  const { t, goals, addGoal, deleteGoal, updateGoal } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [icon, setIcon] = useState('🎯');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Helper to format/parse numbers
  const formatNumber = (val: string) => {
    // Remove non-digits
    const clean = val.replace(/\D/g, '');
    // Format with spaces
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

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.flexBetween}>
        <h1 className={styles.pageTitle}>{t.goals}</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '16px',
            fontSize: '0.9rem',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.1s',
            cursor: 'pointer'
          }}
          className="touch-active"
        >
            <span style={{ fontSize: '1.2em', lineHeight: 1 }}>+</span>
            {showForm ? t.cancel : t.newGoal}
        </button>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <TransactionsFilter />
      </div>

      {showForm && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1.2rem', 
          background: 'var(--surface)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                    <input 
                        placeholder={t.goalNamePlaceholder} 
                        value={title} onChange={e => setTitle(e.target.value)} required 
                        style={{ padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--background)', color: 'var(--text-main)', width: '100%', fontSize: '0.95rem' }}
                    />
                    {/* Custom Icon Picker */}
                    <div style={{ position: 'relative', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          background: 'var(--background)',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          justifyContent: 'space-between',
                          fontSize: '0.95rem'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getGoalIcon(icon, 22)}
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {(t as unknown as Record<string, string>)[iconOptions.find(o => o.value === icon)?.key || 'iconTarget']}
                          </span>
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                      
                      {showIconPicker && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '0.6rem',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '0.6rem',
                          zIndex: 100,
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}>
                          {iconOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setIcon(opt.value);
                                setShowIconPicker(false);
                              }}
                              style={{
                                padding: '0.6rem',
                                border: icon === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                                borderRadius: '10px',
                                background: icon === opt.value ? 'rgba(59, 130, 246, 0.1)' : 'var(--background)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.2s'
                              }}
                            >
                              {getGoalIcon(opt.value, 26)}
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                {(t as unknown as Record<string, string>)[opt.key]}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                    {/* Aqlli Input: Target */}
                    <div style={{ width: '100%' }}>
                         <input 
                            type="text" 
                            inputMode="decimal"
                            placeholder={t.targetAmountLabel} 
                            value={formatNumber(target)} 
                            onChange={handleTargetChange} 
                            required 
                            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--background)', color: 'var(--text-main)', fontSize: '0.95rem' }}
                        />
                        {target && (
                          <small style={{color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px', display: 'block'}}>
                              {parseInt(target).toLocaleString()} {t.currencyLabel}
                          </small>
                        )}
                    </div>

                    {/* Aqlli Input: Current */}
                    <div style={{ width: '100%' }}>
                        <input 
                            type="text" 
                            inputMode="decimal"
                            placeholder={t.currentAmountLabel} 
                            value={formatNumber(current)} 
                            onChange={handleCurrentChange} 
                            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--background)', color: 'var(--text-main)', fontSize: '0.95rem' }}
                        />
                        {current && (
                          <small style={{color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px', display: 'block'}}>
                              {parseInt(current).toLocaleString()} {t.currencyLabel}
                          </small>
                        )}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '600' }}>{t.save}</button>
            </form>
        </div>
      )}
      
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {goals.map((goal) => (
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
      </div>
    </div>
  );
}
