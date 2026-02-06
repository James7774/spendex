"use client";
import { useState } from "react";
import Link from "next/link";
import ExpensesChart from "@/components/ExpensesChart";
import GoalCard from "@/components/GoalCard";
import AddTransactionForm from "@/components/AddTransactionForm";
import BottomSheet from "@/components/BottomSheet";
import styles from "./dashboard.module.css";
import { useFinance } from "@/context/FinanceContext";
import { IncomeIcon, ExpenseIcon, ArrowRightIcon, PlusIcon } from "@/components/Icons";

export default function DashboardPage() {
  const { t, totalBalance, totalIncome, totalExpense, transactions, goals, deleteGoal, updateGoal } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className={styles.dashboardContent}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t.dashboard}</h1>
          <p className={styles.pageSubtitle}>{new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* Add Transaction Button - Aligned Right with modern style */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
              : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: showAddForm 
              ? '0 4px 18px rgba(239, 68, 68, 0.35)' 
              : '0 4px 18px rgba(99, 102, 241, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.25s ease',
            cursor: 'pointer'
          }}
          className="touch-active"
        >
          <span style={{ 
            fontSize: '1.3em', 
            lineHeight: 1,
            transition: 'transform 0.3s',
            transform: showAddForm ? 'rotate(45deg)' : 'rotate(0deg)'
          }}>+</span>
          {showAddForm ? t.cancel : t.addTransaction}
        </button>
      </div>

      <BottomSheet
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title={t.addTransaction}
      >
        <AddTransactionForm onClose={() => setShowAddForm(false)} />
      </BottomSheet>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>{t.totalBalance}</p>
          <h2 className={styles.statValue} style={{color: 'var(--primary)'}}>{totalBalance.toLocaleString()} <span style={{fontSize: '0.7em', color: 'var(--text-secondary)'}}>{t.currencyLabel}</span></h2>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>{t.income}</p>
          <h2 className={styles.statValue} style={{color: 'var(--success)'}}>+{totalIncome.toLocaleString()} <span style={{fontSize: '0.7em', color: 'var(--text-secondary)'}}>{t.currencyLabel}</span></h2>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>{t.expense}</p>
          <h2 className={styles.statValue} style={{color: 'var(--danger)'}}>-{totalExpense.toLocaleString()} <span style={{fontSize: '0.7em', color: 'var(--text-secondary)'}}>{t.currencyLabel}</span></h2>
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ marginBottom: '1rem', padding: '0 4px' }}>
           <h3 className={styles.sectionHeader} style={{ margin: 0 }}>{t.chartTitle}</h3>
        </div>
        <div style={{height: '350px', paddingBottom: '10px'}}>
          <ExpensesChart />
        </div>
      </section>

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
  );
}
