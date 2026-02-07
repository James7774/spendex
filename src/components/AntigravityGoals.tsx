
"use client";
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Target } from 'lucide-react';
import GoalCard from "@/components/GoalCard";

export default function AntigravityGoals() {
  const { t, goals, deleteGoal, updateGoal } = useFinance();

  if (!goals || goals.length === 0) return null;

  return (
    <div className="goals-section-wrapper">
      <div style={{ marginBottom: '1rem', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={20} color="#7000ff" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--text-main)', margin: 0 }}>
            {t.financialGoals}
          </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

      <style jsx>{`
        .goals-section-wrapper {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--surface);
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </div>
  );
}
