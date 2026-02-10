"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ExpensesChart from "@/components/ExpensesChart";
import GoalCard from "@/components/GoalCard";
import AddTransactionForm from "@/components/AddTransactionForm";
import BottomSheet from "@/components/BottomSheet";
import styles from "./dashboard.module.css";
import { useFinance } from "@/context/FinanceContext";
import { IncomeIcon, ExpenseIcon, ArrowRightIcon } from "@/components/Icons";
import { Plus, User } from "lucide-react";

export default function DashboardPage() {
  const { t, totalBalance, totalIncome, totalExpense, transactions, goals, deleteGoal, updateGoal, user } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [initialTxType, setInitialTxType] = useState<'expense' | 'income'>('expense');

  const openAddForm = (type: 'expense' | 'income') => {
    setInitialTxType(type);
    setShowAddForm(true);
  };

  // Helper for small currency format
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  // Helper to dynamically adjust font size based on length
  const getResponsiveStyle = (amount: number, type: 'main' | 'card') => {
    const str = amount.toLocaleString();
    const len = str.length;
    
    if (type === 'main') {
      if (len > 20) return { fontSize: '1.5rem', lineHeight: 1.1 }; // Huge numbers
      if (len > 15) return { fontSize: '1.8rem', lineHeight: 1.1 }; // Very large
      if (len > 12) return { fontSize: '2rem', lineHeight: 1.1 };   // Large
      return { fontSize: '2.4rem', lineHeight: 1 };               // Normal
    } else {
       // For cards (Income/Expense)
       if (len > 18) return { fontSize: '0.9rem', lineHeight: 1.2 };
       if (len > 14) return { fontSize: '1rem', lineHeight: 1.2 };
       if (len > 11) return { fontSize: '1.1rem', lineHeight: 1.2 };
       return { fontSize: '1.25rem', lineHeight: 1.2 };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;

  return (
    <div className={styles.dashboardContent} style={{ padding: 0 }}>
      {/* Premium Header Section */}
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        padding: 'calc(env(safe-area-inset-top) + 24px) 24px 36px',
        borderBottomLeftRadius: '40px',
        borderBottomRightRadius: '40px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(91, 33, 182, 0.3)',
        marginBottom: '24px',
        position: 'sticky', // Changed from relative to sticky
        top: 0,
        zIndex: 900,
        overflow: 'hidden' 
      }}>
        {/* Top Row: Total Balance & Profile */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
           <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
             <p style={{ fontSize: '0.95rem', opacity: 0.85, fontWeight: 500, marginBottom: '8px' }}>{t.totalBalance}</p>
             <h1 style={{ 
               fontWeight: 800, 
               margin: 0, 
               letterSpacing: '-0.5px',
               wordBreak: 'break-all', // Allow breaking if absolutely necessary
               ...getResponsiveStyle(totalBalance, 'main')
             }}>
                {formatCurrency(totalBalance)} <span style={{ fontSize: '0.5em', fontWeight: 500, verticalAlign: 'middle' }}>{t.currencyLabel}</span>
             </h1>
           </div>
           
           <Link href="/dashboard/settings">
             <div style={{
               width: '36px',
               height: '36px',
               borderRadius: '50%',
               background: 'rgba(255,255,255,0.2)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               backdropFilter: 'blur(10px)',
               cursor: 'pointer',
               border: '2px solid rgba(255,255,255,0.1)',
               overflow: 'hidden',
               marginTop: '4px',
               flexShrink: 0 // Prevent shrinking
             }}>
                {user?.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt="Profile" 
                    width={36} 
                    height={36} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    unoptimized
                  />
                ) : (
                  <User size={24} color="white" />
                )}
             </div>
           </Link>
        </div>

        {/* Summary Cards Row */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Income Card */}
          <div style={{
             flex: 1,
             minWidth: 0, // Critical for preventing overflow in flex items
             background: 'rgba(255, 255, 255, 0.1)',
             backdropFilter: 'blur(10px)',
             borderRadius: '24px',
             padding: '20px',
             display: 'flex',
             flexDirection: 'column',
             gap: '12px',
             border: '1px solid rgba(255,255,255,0.1)'
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '10px', 
                  background: 'rgba(74, 222, 128, 0.2)', // Green tint
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4ade80', // Green-400
                  flexShrink: 0
                }}>
                  <IncomeIcon size={18} />
                </div>
                <span style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.income}</span>
             </div>
             <h3 style={{ 
               fontWeight: 700, 
               margin: 0,
               wordBreak: 'break-all',
               ...getResponsiveStyle(totalIncome, 'card')
             }}>
               {formatCurrency(totalIncome)}
             </h3>
          </div>

          {/* Expense Card */}
          <div style={{
             flex: 1,
             minWidth: 0, // Critical for preventing overflow
             background: 'rgba(255, 255, 255, 0.1)',
             backdropFilter: 'blur(10px)',
             borderRadius: '24px',
             padding: '20px',
             display: 'flex',
             flexDirection: 'column',
             gap: '12px',
             border: '1px solid rgba(255,255,255,0.1)'
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '10px', 
                  background: 'rgba(248, 113, 113, 0.2)', // Red tint
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f87171', // Red-400
                  flexShrink: 0
                }}>
                  <ExpenseIcon size={18} />
                </div>
                <span style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.expense}</span>
             </div>
             <h3 style={{ 
               fontWeight: 700, 
               margin: 0,
               wordBreak: 'break-all',
               ...getResponsiveStyle(totalExpense, 'card')
             }}>
               {formatCurrency(totalExpense)}
             </h3>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ padding: '0 20px 160px' }}>
        
        {/* Action Buttons Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
           <button 
             onClick={() => openAddForm('expense')}
             className="touch-active"
             style={{
               flex: 1,
               background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
               color: 'white',
               border: 'none',
               borderRadius: '28px',
               padding: '24px 0',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '12px',
               boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)',
               cursor: 'pointer'
             }}
           >
              <div style={{ 
                 background: 'rgba(255,255,255,0.2)', 
                 width: '48px', 
                 height: '48px', 
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
              }}>
                <Plus size={24} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>{tAny.yourExpenses || "Xarajat"}</span>
           </button>

           <button 
             onClick={() => openAddForm('income')}
             className="touch-active"
             style={{
               flex: 1,
               background: 'var(--surface)',
               color: 'var(--text-main)',
               border: '1px solid var(--border)', // Subtle border
               borderRadius: '28px',
               padding: '24px 0',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '12px',
               boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
               cursor: 'pointer'
             }}
           >
              <div style={{ 
                 background: '#dcfce7', // Light green
                 width: '48px', 
                 height: '48px', 
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 color: '#16a34a'
              }}>
                <Plus size={24} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>{tAny.yourIncome || "Kirim"}</span>
           </button>
        </div>

        {/* Chart Section */}
        <section className={styles.section}>
          <div style={{ marginBottom: '1rem', padding: '0 4px' }}>
            <h3 className={styles.sectionHeader} style={{ margin: 0 }}>{t.chartTitle}</h3>
          </div>
          <div style={{height: '350px', paddingBottom: '10px'}}>
            <ExpensesChart />
          </div>
        </section>

        {/* Goals Section */}
        <section className={styles.section}>
          <div className={styles.flexBetween} style={{ marginBottom: '1rem' }}>
            <h3 className={styles.sectionHeader} style={{ margin: 0 }}>{t.myGoals}</h3>
            <Link href="/dashboard/goals" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>{t.viewAll}</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.map(goal => (
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
            {goals.length === 0 && (
              <div className={styles.emptyState} style={{ background: 'var(--background)', border: 'none', boxShadow: 'none' }}>
                  {t.nothingFound}
              </div>
            )}
          </div>
        </section>

        {/* Transactions Section */}
        <section className={styles.section}>
          <div className={styles.flexBetween} style={{ marginBottom: '1.25rem' }}>
            <h3 className={styles.sectionHeader} style={{ margin: 0 }}>{t.recentTransactions}</h3>
            <Link href="/dashboard/transactions" className={styles.viewAllBtn} style={{ 
                color: 'var(--primary)', 
                fontSize: '0.9rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {t.viewAll} <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className={styles.transactionsList}>
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className={styles.transactionItem}>
                <div className={styles.tIcon} style={{
                  background: tx.type === 'income' ? 'var(--bg-success-soft)' : 'var(--bg-danger-soft)',
                  color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {tx.type === 'income' ? <IncomeIcon size={18} /> : <ExpenseIcon size={18} />}
                </div>
                <div className={styles.tInfo}>
                  <p className={styles.tName}>{(t.categories as Record<string, string>)[tx.category] || tx.category}</p>
                  <p className={styles.tDate}>{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <div className={styles.tAmount} style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
            {transactions.slice(0, 5).length === 0 && (
              <div className={styles.emptyState} style={{ padding: '2rem' }}>
                {t.nothingFound}
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomSheet
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title={initialTxType === 'income' ? t.income : t.expense}
        showCloseIcon={true}
      >
        <AddTransactionForm 
          onClose={() => setShowAddForm(false)} 
          initialType={initialTxType}
        />
      </BottomSheet>
    </div>
  );
}
