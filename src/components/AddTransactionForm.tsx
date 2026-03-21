"use client";
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import TransactionFormBase from './TransactionFormBase';

/**
 * Specialized Expense Form
 */
export function ExpenseForm({ onClose }: { onClose?: () => void }) {
  const { t } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;
  return (
    <TransactionFormBase
      type="expense"
      onClose={onClose}
      title={tAny.addExpense || t.expense}
      themeColor="#ef4444"
      gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
    />
  );
}

/**
 * Specialized Income Form
 */
export function IncomeForm({ onClose }: { onClose?: () => void }) {
  const { t } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;
  return (
    <TransactionFormBase
      type="income"
      onClose={onClose}
      title={tAny.addIncome || t.income}
      themeColor="#22c55e"
      gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
    />
  );
}

/**
 * Main AddTransactionForm (Switcher)
 * Keeps backward compatibility while providing the new "separate" feel.
 */
export default function AddTransactionForm({ 
  onClose, 
  initialType = 'expense' 
}: { 
  onClose?: () => void, 
  initialType?: 'expense' | 'income' 
}) {
  return (
    <div style={{ width: '100%' }}>
      {initialType === 'expense' ? (
        <ExpenseForm onClose={onClose} />
      ) : (
        <IncomeForm onClose={onClose} />
      )}
    </div>
  );
}
