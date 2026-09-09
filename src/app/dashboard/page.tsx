"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import AddTransactionForm from "@/components/AddTransactionForm";
import BottomSheet from "@/components/BottomSheet";
import styles from "./dashboard.module.css";
import { useFinance } from "@/context/FinanceContext";
import { IncomeIcon, ExpenseIcon, ArrowRightIcon } from "@/components/Icons";
import { Plus, User, UtensilsCrossed, Car, Home, Clapperboard, HeartPulse, Wallet, ShoppingBag, Receipt, GraduationCap, Gift, MoreHorizontal, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { t, totalBalance, totalIncome, totalExpense, transactions, user, currencySymbol } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [initialTxType, setInitialTxType] = useState<'expense' | 'income'>('expense');

  const openAddForm = (type: 'expense' | 'income') => {
    setInitialTxType(type);
    setShowAddForm(true);
  };

  // Format numbers with commas, no abbreviation
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  // Dynamically shrink font based on character count
  const getResponsiveStyle = (amount: number, type: 'main' | 'card') => {
    const len = formatCurrency(amount).length;
    
    if (type === 'main') {
      if (len > 25) return { fontSize: '0.9rem', lineHeight: '1.15' };
      if (len > 20) return { fontSize: '1.05rem', lineHeight: '1.15' };
      if (len > 16) return { fontSize: '1.25rem', lineHeight: '1.1' };
      if (len > 13) return { fontSize: '1.45rem', lineHeight: '1.1' };
      if (len > 10) return { fontSize: '1.65rem', lineHeight: '1.05' };
      return { fontSize: '1.85rem', lineHeight: '1' };
    } else {
       if (len > 20) return { fontSize: '0.55rem', lineHeight: '1.15' };
       if (len > 16) return { fontSize: '0.65rem', lineHeight: '1.15' };
       if (len > 12) return { fontSize: '0.75rem', lineHeight: '1.2' };
       if (len > 9) return { fontSize: '0.82rem', lineHeight: '1.2' };
       if (len > 7) return { fontSize: '0.92rem', lineHeight: '1.2' };
       return { fontSize: '1.02rem', lineHeight: '1.2' };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;

  return (
    <div className={styles.dashboardContent} style={{ padding: 0, background: 'var(--background)' }}>
      {/* Premium Header Section - Compact Style */}
      <header style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', // Deep Midnight Blue
        padding: 'calc(env(safe-area-inset-top) + 12px) 18px 24px', // Reduced height
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        color: 'white',
        position: 'relative', 
        zIndex: 900,
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
      }}>
        {/* Top Row: Total Balance & Profile */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
           <div>
             <p style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 500, marginBottom: '3px' }}>{t.totalBalance}</p>
             <h1 style={{ 
               fontWeight: 800, 
               margin: 0, 
               letterSpacing: '-0.5px',
               ...getResponsiveStyle(totalBalance, 'main'),
               wordBreak: 'break-word' as const,
             }}>
                {formatCurrency(totalBalance)} <span style={{ fontSize: '0.45em', opacity: 0.8, fontWeight: 500 }}>{currencySymbol}</span>
             </h1>
           </div>
           
           <Link href="/dashboard/settings">
             <div style={{
               width: '32px',
               height: '32px',
               borderRadius: '50%',
               background: 'rgba(255,255,255,0.15)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255,255,255,0.2)',
               overflow: 'hidden',
             }}>
                {user?.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt="Profile" 
                    width={32} 
                    height={32} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    unoptimized
                  />
                ) : (
                  <User size={16} color="white" />
                )}
             </div>
           </Link>
        </div>

        {/* Summary Cards Row - Sleek Style */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Income Card */}
          <div style={{
             flex: 1,
             background: 'rgba(30, 41, 59, 0.45)',
             backdropFilter: 'blur(12px)',
             borderRadius: '16px',
             padding: '12px 14px',
             border: '1px solid rgba(255,255,255,0.08)',
             boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ 
                  width: '26px', height: '26px', borderRadius: '8px', 
                  background: 'rgba(34, 197, 94, 0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#4ade80'
                }}>
                  <IncomeIcon size={14} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{t.income}</span>
             </div>
             <div style={{ fontWeight: 700, ...getResponsiveStyle(totalIncome, 'card'), color: '#fff', wordBreak: 'break-word' as const, letterSpacing: '-0.5px' }}>{formatCurrency(totalIncome)}</div>
          </div>

          {/* Expense Card */}
          <div style={{
             flex: 1,
             background: 'rgba(30, 41, 59, 0.45)',
             backdropFilter: 'blur(12px)',
             borderRadius: '16px',
             padding: '12px 14px',
             border: '1px solid rgba(255,255,255,0.08)',
             boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ 
                  width: '26px', height: '26px', borderRadius: '8px', 
                  background: 'rgba(248, 113, 113, 0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#f87171'
                }}>
                  <ExpenseIcon size={14} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{t.expense}</span>
             </div>
             <div style={{ fontWeight: 700, ...getResponsiveStyle(totalExpense, 'card'), color: '#fff', wordBreak: 'break-word' as const, letterSpacing: '-0.5px' }}>{formatCurrency(totalExpense)}</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ 
        background: 'var(--background)',
        padding: '16px 14px 140px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative' as const,
        zIndex: 1,
      }}>
        
        {/* Action Buttons Row - Sleek & Compact */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>

           {/* Add Expense Button */}
           <button 
             onClick={() => openAddForm('expense')}
             className="touch-active"
             style={{
               flex: 1,
               background: 'var(--surface)',
               color: 'var(--text-main)',
               border: '1px solid var(--border)',
               borderRadius: '14px',
               height: '44px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '8px',
               boxShadow: 'var(--shadow-sm)',
               cursor: 'pointer',
               position: 'relative',
               overflow: 'hidden'
             }}
           >
              <div style={{ 
                 background: 'rgba(239, 68, 68, 0.1)',
                 width: '24px', height: '24px', borderRadius: '50%',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 color: '#ef4444'
              }}>
                <ArrowRight size={15} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{t.addExpense}</span>
           </button>

           {/* Add Income Button */}
           <button 
             onClick={() => openAddForm('income')}
             className="touch-active"
             style={{
               flex: 1,
               background: 'var(--surface)',
               color: 'var(--text-main)',
               border: '1px solid var(--border)',
               borderRadius: '14px',
               height: '44px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '8px',
               boxShadow: 'var(--shadow-sm)',
               cursor: 'pointer',
               position: 'relative',
               overflow: 'hidden'
             }}
           >
              <div style={{ 
                 background: 'rgba(16, 185, 129, 0.1)',
                 width: '24px', height: '24px', borderRadius: '50%',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 color: '#10b981'
              }}>
                <ArrowRight size={15} strokeWidth={2.5} style={{ transform: 'rotate(-90deg)' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{t.addIncome}</span>
           </button>
        </div>

        {/* Recent Transactions Section */}
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>{t.recentTransactions}</h3>
          <Link href="/dashboard/transactions" style={{ 
            color: 'var(--primary)', 
            fontSize: '0.82rem', 
            fontWeight: 600,
            textDecoration: 'none'
          }}>{t.viewAll}</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.slice(0, 6).map((tx) => {
            const categoryConfig: Record<string, { bg: string; color: string; Icon: React.ElementType }> = {
              food:          { bg: '#FFF3E0', color: '#E65100', Icon: UtensilsCrossed },
              transport:     { bg: '#E3F2FD', color: '#1565C0', Icon: Car },
              home:          { bg: '#F3E5F5', color: '#7B1FA2', Icon: Home },
              entertainment: { bg: '#FCE4EC', color: '#C62828', Icon: Clapperboard },
              health:        { bg: '#E8F5E9', color: '#2E7D32', Icon: HeartPulse },
              salary:        { bg: '#E0F2F1', color: '#00695C', Icon: Wallet },
              shopping:      { bg: '#FFF8E1', color: '#F57F17', Icon: ShoppingBag },
              bills:         { bg: '#EFEBE9', color: '#4E342E', Icon: Receipt },
              education:     { bg: '#E8EAF6', color: '#283593', Icon: GraduationCap },
              gift:          { bg: '#FCE4EC', color: '#AD1457', Icon: Gift },
              other:         { bg: '#F5F5F5', color: '#616161', Icon: MoreHorizontal },
            };
            const cc = categoryConfig[tx.category] || categoryConfig.other;
            const CategoryIcon = cc.Icon;
            const categoryName = (t.categories as Record<string, string>)[tx.category] || tx.category;
            const dateStr = new Date(tx.date).toLocaleDateString();
            const amountStr = tx.amount.toLocaleString();

            return (
              <div key={tx.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: 'var(--surface)',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                border: '1px solid var(--glass-border)'
              }}>
                {/* Category Icon */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: cc.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CategoryIcon size={18} color={cc.color} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: 700, 
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {categoryName}
                  </p>
                  <p style={{ 
                    margin: '2px 0 0', 
                    fontSize: '0.72rem', 
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {dateStr} {tx.note && `• ${tx.note}`}
                  </p>
                </div>

                {/* Amount */}
                <div style={{
                  fontWeight: 800,
                  fontSize: amountStr.length > 18 ? '0.7rem' : amountStr.length > 12 ? '0.78rem' : '0.92rem',
                  color: tx.type === 'income' ? '#10b981' : '#ef4444',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'right',
                  maxWidth: '40%',
                  minWidth: '65px',
                }}>
                  {tx.type === 'income' ? '+' : '-'}{amountStr} <span style={{ fontSize: '0.85em', opacity: 0.8 }}>{currencySymbol}</span>
                </div>
              </div>
            );
          })}

          {transactions.length === 0 && (
            <div style={{ 
              padding: '4rem 1rem', 
              textAlign: 'center', 
              color: 'var(--text-secondary)',
              background: 'var(--surface)',
              borderRadius: '24px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ marginBottom: '16px', opacity: 0.5 }}>
                 <Receipt size={48} />
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{t.nothingFound}</p>
            </div>
          )}
        </div>
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
