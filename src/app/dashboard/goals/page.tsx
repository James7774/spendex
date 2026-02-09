"use client";
import React, { useState, useMemo } from 'react';
import GoalCard from "@/components/GoalCard";
import { useFinance } from "@/context/FinanceContext";
import styles from "../dashboard.module.css";
import { getGoalIcon } from "@/components/icons/GoalIcons";
import TransactionsFilter from "@/components/TransactionsFilter";
import BottomSheet from "@/components/BottomSheet";
import { SearchIcon, CloseIcon, PlusIcon } from "@/components/Icons";

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
  const { t, goals, addGoal, deleteGoal, updateGoal, darkMode } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
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

  // Helper to format/parse numbers
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
      {/* Top Search & Actions Row */}
      <div className={styles.searchWrapper} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
        <div className={styles.searchContainer} style={{ width: '100%' }}>
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder={tAny.searchPlaceholder || "Maqsadlarni qidirish..."}
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

        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <TransactionsFilter />
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              flex: 1,
              background: showForm ? 'rgba(239, 68, 68, 0.1)' : 'linear-gradient(135deg, #7000ff 0%, #9033ff 100%)',
              color: showForm ? '#ef4444' : 'white',
              border: 'none',
              height: '54px',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: 850,
              boxShadow: showForm ? 'none' : '0 8px 20px rgba(112, 0, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
            }}
            className="touch-active"
          >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: showForm ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.3s ease'
              }}>
                <PlusIcon size={14} color="white" />
              </div>
              <span style={{ letterSpacing: '-0.3px' }}>{showForm ? t.cancel : t.newGoal}</span>
          </button>
        </div>
      </div>

      {/* Goal Add Form - BottomSheet for Premium Feel */}
      <BottomSheet
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={t.newGoal}
        showCloseIcon={true}
      >
        <div style={{ padding: '20px 0' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Icon & Title Group - Slimmer & Elegant */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '16px',
                  background: 'var(--bg-secondary)',
                  padding: '20px',
                  borderRadius: '24px',
                  border: '1px solid ' + (darkMode ? 'rgba(255,255,255,0.05)' : '#f1f1f5')
                }}>
                   <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          background: darkMode ? '#334155' : '#fff',
                          border: '2px solid ' + (showIconPicker ? '#7000ff' : (darkMode ? 'rgba(255,255,255,0.1)' : '#eee')),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                      >
                        {getGoalIcon(icon, 36)}
                      </button>

                      {showIconPicker && (
                        <div style={{
                          position: 'absolute',
                          top: '80px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: darkMode ? '#1e293b' : '#fff',
                          border: '1px solid ' + (darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'),
                          borderRadius: '20px',
                          padding: '10px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '10px',
                          zIndex: 200,
                          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
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
                                width: '48px',
                                height: '48px',
                                border: 'none',
                                borderRadius: '14px',
                                background: icon === opt.value ? '#7000ff' : (darkMode ? '#334155' : '#f8fafc'),
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.4rem',
                                transition: 'all 0.2s'
                              }}
                            >
                              {getGoalIcon(opt.value, 24)}
                            </button>
                          ))}
                        </div>
                      )}
                   </div>

                   <div style={{ width: '100%' }}>
                     <label style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 900, 
                        color: '#94a3b8', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        marginBottom: '6px', 
                        display: 'block',
                        textAlign: 'center'
                     }}>{tAny.goalName || "Maqsad nomi"}</label>
                     <input 
                        placeholder={t.goalNamePlaceholder} 
                        value={title} onChange={e => setTitle(e.target.value)} required 
                        style={{ 
                          width: '100%', 
                          padding: '12px 0', 
                          border: 'none', 
                          borderBottom: '1.5px solid ' + (darkMode ? '#334155' : '#f1f5f9'),
                          background: 'transparent', 
                          color: darkMode ? '#fff' : '#1e293b', 
                          fontSize: '1.25rem',
                          fontWeight: 850,
                          textAlign: 'center',
                          outline: 'none',
                          transition: 'border-color 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#7000ff'}
                        onBlur={(e) => e.target.style.borderColor = (darkMode ? '#334155' : '#f1f5f9')}
                      />
                   </div>
                </div>
                
                {/* Fixed Alignment for Amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ width: '100%' }}>
                         <label style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 900, 
                            color: '#94a3b8', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            marginBottom: '10px', 
                            display: 'flex',
                            alignItems: 'center',
                            height: '30px' // Fix height to prevent crooked look
                         }}>{t.targetAmountLabel}</label>
                         <input 
                            type="text" 
                            inputMode="decimal"
                            placeholder="0" 
                            value={formatNumber(target)} 
                            onChange={handleTargetChange} 
                            required 
                            style={{ 
                              width: '100%', 
                              padding: '14px', 
                              border: '1.5px solid ' + (darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'), 
                              borderRadius: '16px', 
                              background: darkMode ? 'rgba(255,255,255,0.03)' : '#fcfcfd', 
                              color: darkMode ? '#fff' : '#1e293b', 
                              fontSize: '1rem',
                              fontWeight: 850,
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#7000ff'}
                            onBlur={(e) => e.target.style.borderColor = (darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9')}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <label style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 900, 
                            color: '#94a3b8', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            marginBottom: '10px', 
                            display: 'flex',
                            alignItems: 'center',
                            height: '30px' // Fix height to prevent crooked look
                        }}>Hozirgi summa</label>
                        <input 
                            type="text" 
                            inputMode="decimal"
                            placeholder="0" 
                            value={formatNumber(current)} 
                            onChange={handleCurrentChange} 
                            style={{ 
                              width: '100%', 
                              padding: '14px', 
                              border: '1.5px solid ' + (darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'), 
                              borderRadius: '16px', 
                              background: darkMode ? 'rgba(255,255,255,0.03)' : '#fcfcfd', 
                              color: darkMode ? '#fff' : '#1e293b', 
                              fontSize: '1rem',
                              fontWeight: 850,
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#7000ff'}
                            onBlur={(e) => e.target.style.borderColor = (darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9')}
                        />
                    </div>
                </div>

                {/* Slimmer Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{ 
                      flex: 1, 
                      padding: '14px', 
                      borderRadius: '16px', 
                      border: 'none',
                      background: darkMode ? '#334155' : '#f1f5f9',
                      color: darkMode ? '#cbd5e1' : '#64748b',
                      fontSize: '0.9rem', 
                      fontWeight: 850,
                      cursor: 'pointer'
                    }}
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit" 
                    style={{ 
                      flex: 2, 
                      padding: '14px', 
                      borderRadius: '16px', 
                      border: 'none',
                      background: 'linear-gradient(135deg, #7000ff 0%, #9033ff 100%)',
                      color: 'white',
                      fontSize: '0.95rem', 
                      fontWeight: 850,
                      boxShadow: '0 6px 16px rgba(112, 0, 255, 0.2)',
                      cursor: 'pointer'
                    }}
                    className="touch-active"
                  >
                    {t.save}
                  </button>
                </div>
            </form>
        </div>
      </BottomSheet>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          <div className={styles.emptyState}>
             {searchQuery ? tAny.nothingFound : tAny.noDataYet}
          </div>
        )}
      </div>
    </div>
  );
}
